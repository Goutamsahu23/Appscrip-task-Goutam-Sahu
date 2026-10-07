import cors from 'cors';
import express from 'express';

import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { requestLogger } from './middlewares/requestLogger';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(requestLogger);
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET'],
    }),
  );
  app.use(express.json());

  // Routes get mounted here in later steps

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
