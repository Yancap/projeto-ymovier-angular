import { Readable } from 'stream';

export async function buffer(readable: Readable) {
  const chunks: any[] = [];
  for await (const chunk of readable) {
    console.log(chunk);
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}
