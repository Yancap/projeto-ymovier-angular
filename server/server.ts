import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from '../src/main.server';
import { config } from 'dotenv';
import { fauna } from './services/fauna';
import { query } from 'faunadb';
import { SignatureCollectionProps } from './interfaces/signature-collection-props';
import { User } from './interfaces/user';
import { stripe } from './services/stripe';
import Stripe from 'stripe';
import { saveSignature } from './services/saveSignature';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);


  server.post(
    '/api/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      let dotenv = config().parsed && process.env;
      if (!dotenv) {
        return res.status(404).send({
          message: 'Arquivo .env não configurado no servidor',
          field: '',
          type: 'error',
          status: 500,
        });
      }

      let signature_return = '';
      const secret = req.headers['stripe-signature'] as string | string[];
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          secret,
          dotenv['STRIPE_WEBHOOK_SECRET'] as string
        );

        const relevantEvents = new Set([
          'checkout.session.completed',
          'customer.subscription.updated',
          'customer.subscription.deleted',
        ]);

        const { type } = event;
        if (relevantEvents.has(type)) {
          try {
            switch (type) {
              case 'customer.subscription.updated':
              case 'customer.subscription.deleted':
                const signature = event.data.object as Stripe.Subscription;
                signature_return = await saveSignature(
                  signature.id,
                  signature.customer.toString(),
                  false
                );
                break;
              case 'checkout.session.completed':
                const checkoutSession = event.data
                  .object as Stripe.Checkout.Session;
                signature_return = await saveSignature(
                  checkoutSession.subscription?.toString() as string,
                  checkoutSession.customer?.toString() as string,
                  true
                );
                break;
              default:
                throw new Error('Unhandled event: ' + type);
            }
          } catch (error) {
            return res.send({ error: 'Webhook handler failed.' });
          }
        }
      } catch (error) {
        return res.status(404).send('Webhook Error');
      }
      res.send({ received: true, signature: signature_return });
      // res.redirect('/');
      return res;
    }
  );

  server.use(express.json());

  server.post('/api/auth', async (req, res) => {
    const { body } = req;
    let dotenv = config().parsed && process.env;
    if (!dotenv) {
      return res.status(404).send({
        message: 'Arquivo .env não configurado no servidor',
        field: '',
        type: 'error',
        status: 500,
      });
    }

    console.log("dotenv");
    console.log(dotenv);


    let client_id = dotenv['CLIENT_ID'];
    let client_secret = dotenv['CLIENT_SECRET'];

    console.log("CLIENT_ID: ", client_id);
    console.log("CLIENT_SECRET: ", client_secret);

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

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: bodyStringify,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        host: 'projeto-ymovier-angular.onrender.com',
        origin: 'https://projeto-ymovier-angular.onrender.com',
      },
    })
    const json = await response.json();
    return res.send(json);
  });

  server.post('/api/save_user', async (req, res) => {
    const { body } = req;
    if (!('email' in body)) {
      return res.status(404).send({
        message: 'O corpo da requisição está inválido.',
        field: '',
        type: 'error',
        status: 404,
      });
    }

    const { email } = body;
    if (!email) {
      return res.status(404).send({
        message: 'Email inválido.',
        description:
          'Por favor, verifique se o seu e-mail está publico em seu Github.',
        field: '',
        type: 'error',
        status: 404,
      });
    }

    try {
      const user = await fauna.query(
        query.If(
          query.Not(
            query.Exists(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(email as string)
              )
            )
          ),
          query.Create(query.Collection('users'), {
            data: { email: email },
          }),
          query.Get(
            query.Match(
              query.Index('user_by_email'),
              query.Casefold(email as string)
            )
          )
        )
      );
      if ('data' in user) return res.status(201).send({ data: user['data'] });
      return res.status(201).send();
    } catch (error) {
      return res.status(404).send({
        message:
          'Aconteceu um erro no salvamento das informações do usuário no faunadb.',
        field: '',
        type: 'error',
        error: error,
        status: 404,
      });
    }
  });

  server.post('/api/session', async (req, res) => {
    const { body } = req;

    if (!('email' in body)) {
      return res.status(404).send({
        message: 'O corpo da requisição está inválido.',
        field: '',
        type: 'error',
        status: 404,
      });
    }
    const { email } = body;
    try {
      const userActiveSignature = await fauna.query<SignatureCollectionProps>(
        query.Get(
          query.Intersection([
            query.Match(
              query.Index('signatures_by_user_ref'),
              query.Select(
                'ref',
                query.Get(
                  query.Match(
                    query.Index('user_by_email'),
                    query.Casefold(email)
                  )
                )
              )
            ),
            query.Match(query.Index('signatures_by_status'), 'active'),
          ])
        )
      );
      return res.send({
        activeSignature: userActiveSignature.data.status,
      });
    } catch (error) {
      return res.send({
        activeSignature: null,
      });
    }
  });

  server.post('/api/signature', async (req, res) => {
    const { body } = req;

    let dotenv = config().parsed && process.env;;
    if (!dotenv) {
      return res.status(404).send({
        message: 'Arquivo .env não configurado no servidor',
        field: '',
        type: 'error',
        status: 500,
      });
    }

    if (!('email' in body)) {
      return res.status(404).send({
        message: 'O corpo da requisição está inválido.',
        field: '',
        type: 'error',
        status: 404,
      });
    }
    const { email } = body;

    try {
      const user = await fauna.query<User>(
        query.Get(
          query.Match(
            query.Index('user_by_email'),
            query.Casefold(email as string)
          )
        )
      );
      let customerId = user.data.stripe_customer_id;
      if (!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email,
        });
        await fauna.query(
          query.Update(query.Ref(query.Collection('users'), user.ref.id), {
            data: {
              stripeCustomerId: stripeCustomer.id,
            },
          })
        );
        customerId = stripeCustomer.id;
      }
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        line_items: [{ price: 'price_1NWTHPCGnWxAsuIluA7e1LWT', quantity: 1 }],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: dotenv['STRIPE_SUCCESS_URL'] as string,
        cancel_url: dotenv['STRIPE_CANCEL_URL'] as string,
      });
      return res.status(201).send({ sessionId: stripeCheckoutSession.id });
    } catch (error) {
      return res.status(500).send({
        error,
      });
    }
  });

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
      .then((html: any) => res.send(html))
      .catch((err: any) => next(err));
  });


  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on ${port}`);
  });
}

run();
