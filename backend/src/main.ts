import { AppModule } from '@app/app.module';
import { AppOptions } from '@libs/configurations/app-options';
import { ConfigBinder } from '@libs/configurations/config-binder';
import { Guard } from '@libs/core/validations/guard';
import { NestOtelLogger } from '@libs/logger/nest/nest-otel-logger';
import { SwaggerModule } from '@libs/swagger/swagger.module';
import { VersioningModule } from '@libs/versioning/versioning.module';
import { corsMiddleware } from '@libs/web/cors/cors.middleware';
import { appResponseTimeMiddleware } from '@libs/web/performance/app.response-time.middleware';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();

  const logger = app.get(NestOtelLogger);

  const configService = app.get(ConfigService);

  const appOptions = ConfigBinder.getOption<AppOptions>('appOptions');
  const port = Guard.notNegativeOrZero(appOptions?.port, 'port');

  // https://github.com/iamolegga/nestjs-pino#example
  // https://docs.nestjs.com/techniques/logger
  app.useLogger(logger);

  VersioningModule.setup(app);

  SwaggerModule.setup(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // https://docs.nestjs.com/middleware#global-middleware
  // global middlewares can be registered with `app.use()` and they don't support dependency injection
  app.use(compression());
  app.use(helmet());
  app.use(corsMiddleware(configService));
  app.use(appResponseTimeMiddleware);

  if (appOptions?.apiPrefix) {
    app.setGlobalPrefix(appOptions.apiPrefix, {
      exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
  }

  // express style router handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/' || req.originalUrl.includes('favicon.ico')) {
      Guard.notNull(appOptions?.serviceName, 'serviceName');
      return res.send(appOptions?.serviceName);
    }
    return next();
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application is running on port ${port}`);
};
bootstrap().catch(handleError);
function handleError(error: any): void {
  Logger.error(`⚠️ Application failed to start: ${error}`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
