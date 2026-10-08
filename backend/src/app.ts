import cors from 'cors';
import express from 'express';
import path from 'node:path';

import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { requestLogger } from './middlewares/requestLogger';
import { apiRouter } from './routes';

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

  app.use(
    '/images',
    express.static(path.join(process.cwd(), 'public', 'images'), {
      maxAge: '7d',
      immutable: true,
    }),
  );

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
