import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError } from 'zod';

export const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof ZodError ? 400 : 500;
  const message = err instanceof Error ? err.message : 'An unexpected error occurred';
  res.status(status).json({ error: message });
};
