import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { WinstonOtelLogger } from '@libs/logger/winston/winston-otel.logger';
import { OpenTelemetryModule } from '@libs/opentelemetry/opentelemetry.module';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as winston from 'winston';
import { Logger } from 'winston';
const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

import { ConfigBinder } from '@libs/configurations/config-binder';
import { LoggerOptions } from '@libs/logger/nest/logger-options';

@Module({
  imports: [ConfigModule, OpenTelemetryModule],
})
export class WinstonLoggerModule {
  static forRootAsync(): DynamicModule {
    const winstonProvider: Provider = {
      provide: Logger,
      useFactory: (): Logger => {
        const loggerOptions = ConfigBinder.getOption<LoggerOptions>('loggerOptions');

        return winston.createLogger({
          level: loggerOptions?.level ?? 'info',
          format: combine(
            colorize({ all: true }),
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss A',
            }),
            colorize(),
            prettyPrint({
              depth: 5,
            }),
            printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
          ),
          transports: [new winston.transports.Console()],
        });
      },
    };

    return {
      module: WinstonLoggerModule,
      imports: [ConfigModule],
      providers: [winstonProvider, WinstonOtelLogger, OtelLogger],
      exports: [Logger, WinstonOtelLogger, OtelLogger],
    };
  }
}
