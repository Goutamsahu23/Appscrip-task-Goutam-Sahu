import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

type RequestSchemas = {
  params?: ZodType;
  query?: ZodType;
};

// Express 5 keeps req.query / req.params read-only, so validated values go on res.locals
export function validate(schemas: RequestSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        res.locals.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        res.locals.query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
