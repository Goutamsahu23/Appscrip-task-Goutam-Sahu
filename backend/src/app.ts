import cors from 'cors';
import express from 'express';

import { env } from './config/env';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET'],
    }),
  );
  app.use(express.json());

  return app;
}
