import pino from 'pino';

import { env } from '../config/env';

export const logger = pino({
  level: env.isProduction ? 'info' : 'debug',
  // Pretty logs in the terminal while developing; plain JSON in production
  ...(env.isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      }),
});
