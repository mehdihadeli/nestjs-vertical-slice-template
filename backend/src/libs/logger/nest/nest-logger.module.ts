import { Configuration } from '@libs/configurations/configuration';
import { DependencyValidatorService } from '@libs/logger/dependency-validator.service';
import { LOGGER_PROVIDER_TOKEN } from '@libs/logger/logger.tokens';
import { LoggerOptions } from '@libs/logger/nest/logger-options';
import { Global, Logger, Module } from '@nestjs/common';

// https://github.com/iamolegga/nestjs-pino#asynchronous-configuration
// https://docs.nestjs.com/techniques/logger
@Global()
@Module({
  imports: [],
  providers: [
    DependencyValidatorService,
    {
      provide: LOGGER_PROVIDER_TOKEN,
      useExisting: Logger,
    },
    // If we supply a custom logger via `app.useLogger()`, it will actually be used by Nest internally. That means
    // that our code remains implementation agnostic (using `Logger` class), while we can easily substitute the default
    // logger for our custom one by calling app.useLogger().

    // Nest Logger
    // https://docs.nestjs.com/fundamentals/async-providers
    {
      provide: Logger,
      useFactory: () => {
        const loggerOptions = Configuration.getOption<LoggerOptions>('loggerOptions');
        const logger = new Logger().localInstance;
        // const logger = new ConsoleLogger('App', {
        //   logLevels: [loggerOptions.level ?? 'log'],
        // });
        logger.setLogLevels?.([loggerOptions.level ?? 'log']);

        return logger;
      },
    },
  ],
  exports: [Logger, LOGGER_PROVIDER_TOKEN],
})
export class NestLoggerModule {}
