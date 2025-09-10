import { AppOptions } from '@libs/configurations/app-options';
import { Configuration } from '@libs/configurations/configuration';
import { VersioningModule } from '@libs/versioning/versioning.module';
import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TestAppInfrastructureBootstrapper {
  bootstrap(app: INestApplication): void;
}

export class DefaultTestAppInfrastructureBootstrapper implements TestAppInfrastructureBootstrapper {
  bootstrap(app: INestApplication): void {
    const configService = app.get(ConfigService);
    //const logger = app.get(PinoOtelLogger);

    const appOptions = Configuration.getOption<AppOptions>('appOptions');

    // https://github.com/iamolegga/nestjs-pino#example
    // https://docs.nestjs.com/techniques/logger
    // set `localInstance` inside `Logger` class and all instances of `Logger` will use this internal local instance
    //app.useLogger(logger);

    // https://github.com/nestjs/swagger/issues/105#issuecomment-568782648
    // api prefix should be before swagger registration
    if (appOptions?.apiPrefix) {
      app.setGlobalPrefix(appOptions.apiPrefix, {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
      });
    }

    // Setup Versioning & Swagger
    VersioningModule.setup(app);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }
}
