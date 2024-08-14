import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { config } from 'dotenv';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  server.use(express.json());
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.post('/api/v1/test', (req, res) => {
    let dotenv = config();
    console.log(dotenv);
  });

  server.post('/api/v1/auth', (req, res) => {
    const { body } = req;
    let dotenv = config().parsed;
    if(!dotenv) {
      return res.status(404).send({
        message: 'Arquivo .env não configurado no servidor',
        field: '',
        type: 'error',
        status: 500,
      });
    }

    let client_id = dotenv['CLIENT_ID'];
    let client_secret = dotenv['CLIENT_SECRET'];;

    if (!('code' in body)) {
      return res.status(404).send({
        message: 'O corpo da requisição está inválido.',
        field: '',
        type: 'error',
        status: 404,
      });
    }

    if (!(client_id && client_secret)) {
      return res.status(404).send({
        message: 'As variaves de ambiente estão inválidas ou sem valor.',
        field: '',
        type: 'error',
        status: 500,
      });
    }

    const bodyStringify = JSON.stringify({
      client_id,
      client_secret,
      code: body.code,
    });

    return fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: bodyStringify,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        host: 'localhost:4000',
        origin: 'http://localhost:4000',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        return res.send(response);
      });
  });
  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
