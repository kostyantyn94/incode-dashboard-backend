import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.validated = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details,
        });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
