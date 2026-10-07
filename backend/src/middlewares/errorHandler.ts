import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function isMalformedJsonError(
  err: unknown,
): err is SyntaxError & { status: number; body?: unknown } {
  return (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status?: number }).status === 400 &&
    'body' in err
  );
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Something went wrong';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request data';
    details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  } else if (isMalformedJsonError(err)) {
    statusCode = 400;
    code = 'BAD_REQUEST';
    message = 'Malformed JSON in request body';
  }

  if (statusCode >= 500) {
    logger.error({ err, path: req.path, method: req.method }, message);
  } else {
    logger.warn({ err, path: req.path, method: req.method }, message);
  }

  const body: ErrorBody = {
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };

  // Don't leak internals outside of development
  if (statusCode >= 500 && !env.isProduction) {
    body.error.details = {
      ...(typeof details === 'object' && details !== null ? details : {}),
      stack: err instanceof Error ? err.stack : undefined,
    };
  }

  res.status(statusCode).json(body);
};
