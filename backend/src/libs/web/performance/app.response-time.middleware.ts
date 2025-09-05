import { NextFunction, Request, Response } from 'express';
import responseTime from 'response-time';

// https://docs.nestjs.com/middleware#functional-middleware
// functional middleware doesn't support dependency injection
export function appResponseTimeMiddleware(req: Request, res: Response, next: NextFunction): any {
  return responseTime()(req, res, next);
}
