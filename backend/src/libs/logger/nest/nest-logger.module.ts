import { ConfigBinder } from '@libs/configurations/config-binder';
import { LoggerOptions } from '@libs/logger/nest/logger-options';
import { NestOtelLogger } from '@libs/logger/nest/nest-otel-logger';
import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { OpenTelemetryModule } from '@libs/opentelemetry/opentelemetry.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// https://github.com/iamolegga/nestjs-pino#asynchronous-configuration
// https://docs.nestjs.com/techniques/logger
@Module({
  imports: [ConfigModule, OpenTelemetryModule],
  providers: [
    // If we supply a custom logger via `app.useLogger()`, it will actually be used by Nest internally. That means
    // that our code remains implementation agnostic (using `Logger` class), while we can easily substitute the default
    // logger for our custom one by calling app.useLogger().

    // Nest Logger
    // https://docs.nestjs.com/fundamentals/async-providers
    {
      provide: Logger,
      useFactory: () => {
        const loggerOptions = ConfigBinder.getOption<LoggerOptions>('loggerOptions');
        const logger = new Logger().localInstance;
        logger.setLogLevels?.([loggerOptions.level ?? 'log']);

        return logger;
      },
    },
    OtelLogger,
    {
      provide: NestOtelLogger,
      useClass: NestOtelLogger,
    },
  ],
  exports: [OtelLogger, NestOtelLogger, Logger],
})
export class NestLoggerModule {}
