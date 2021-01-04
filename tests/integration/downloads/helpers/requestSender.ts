/* eslint-disable @typescript-eslint/no-explicit-any */
import * as supertest from 'supertest';
import { Application } from 'express';

import { container } from 'tsyringe';
import { ServerBuilder } from '../../../../src/serverBuilder';

let app: Application | null = null;

export async function init(): Promise<void> {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  app = await builder.build();
}

export async function download(key: string, parseFile = false): Promise<supertest.Response> {
  let res = supertest.agent(app).get(`/download/${key}`);
  if (parseFile) {
    res = res.buffer(true).parse(binaryParser);
  }
  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const binaryParser = (res: supertest.Response, fn: (err: Error | null, body: any) => void): void => {
  const data: any[] = []; // Binary data needs binary storage

  res.on('data', (chunk) => {
    data.push(chunk);
  });
  res.on('end', () => {
    fn(null, Buffer.concat(data).toString());
  });
};
