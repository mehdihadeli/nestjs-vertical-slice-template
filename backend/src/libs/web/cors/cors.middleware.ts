import { getCorsOptions } from '@libs/web/cors/cors-options';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cors, { CorsOptions as CorsOptionsType } from 'cors';
import { NextFunction, Request, Response } from 'express';

// https://docs.nestjs.com/middleware#functional-middleware
// https://github.com/nestjs/nest/blob/b245ea09405cf625c71d60792ba57222a5d31eb1/packages/platform-express/adapters/express-adapter.ts#L268

export function corsMiddleware(configService: ConfigService) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const options = getCorsOptions('corsOptions');

    const corsOptions: CorsOptionsType = {
      origin: options.allowedOrigins,
      methods: options.allowedMethods,
      allowedHeaders: options.allowedHeaders,
      preflightContinue: false,
      credentials: options.useCredentials,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };
    cors(corsOptions)(req, res, next);
  };
}
