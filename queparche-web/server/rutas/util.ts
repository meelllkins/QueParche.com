import type { NextFunction, Request, RequestHandler, Response } from 'express';

/** Envuelve un handler async para que sus errores lleguen al manejador central. */
export const manejar =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
