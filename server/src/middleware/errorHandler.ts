import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const occurrenceId = randomUUID();
  console.error(`[${occurrenceId}] Unhandled request error`, {
    method: req.method,
    path: req.originalUrl,
    error,
  });

  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'Record already exists' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;

  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({
      error: 'Erro interno do servidor',
      occurrenceId,
    });
  }

  const message = error?.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
