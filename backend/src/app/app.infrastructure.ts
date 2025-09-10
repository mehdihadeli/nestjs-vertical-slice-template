import { AppOptions } from '@libs/configurations/app-options';
import { Configuration } from '@libs/configurations/configuration';
import { Guard } from '@libs/core/validations/guard';
import { PinoOtelLogger } from '@libs/logger/pino/pino-otel.logger';
import { SwaggerModule } from '@libs/swagger/swagger.module';
import { VersioningModule } from '@libs/versioning/versioning.module';
import { corsMiddleware } from '@libs/web/cors/cors.middleware';
import { appResponseTimeMiddleware } from '@libs/web/performance/app.response-time.middleware';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

export class AppInfrastructure {
  static setup(app: INestApplication): void {
    const configService = app.get(ConfigService);
    const logger = app.get(PinoOtelLogger);

    const appOptions = Configuration.getOption<AppOptions>('appOptions');

    // https://github.com/iamolegga/nestjs-pino#example
    // https://docs.nestjs.com/techniques/logger
    // set `localInstance` inside `Logger` class and all instances of `Logger` will use this internal local instance
    app.useLogger(logger);

    // https://github.com/nestjs/swagger/issues/105#issuecomment-568782648
    // api prefix should be before swagger registration
    if (appOptions?.apiPrefix) {
      app.setGlobalPrefix(appOptions.apiPrefix, {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
      });
    }

    // Setup Versioning & Swagger
    VersioningModule.setup(app);
    SwaggerModule.setup(app);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // https://docs.nestjs.com/middleware#global-middleware
    // global middlewares can be registered with `app.use()` and they don't support dependency injection
    app.use(compression());
    app.use(helmet());
    app.use(corsMiddleware(configService));
    app.use(appResponseTimeMiddleware);

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl === '/' || req.originalUrl.includes('favicon.ico')) {
        Guard.notNull(appOptions?.serviceName, 'serviceName');
        return res.send(appOptions?.serviceName);
      }
      return next();
    });
  }
}
