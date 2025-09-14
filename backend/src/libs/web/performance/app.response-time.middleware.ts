import { ExpressMiddleware } from '@libs/web/express.middleware';
import { NextFunction, Request, Response } from 'express';
import responseTime from 'response-time';

// https://docs.nestjs.com/middleware#functional-middleware
// functional middleware doesn't support dependency injection

// Type the responseTime function
const responseTimeTyped = responseTime as unknown as () => ExpressMiddleware;

export function appResponseTimeMiddleware(req: Request, res: Response, next: NextFunction): void {
  return responseTimeTyped()(req, res, next);
}
