import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { WinstonOtelLogger } from '@libs/logger/winston/winston-otel.logger';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import * as winston from 'winston';
import { Logger } from 'winston';
const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

import { Configuration } from '@libs/configurations/configuration';
import { LoggerOptions } from '@libs/logger/nest/logger-options';

@Global()
@Module({
  imports: [],
})
export class WinstonLoggerModule {
  static forRootAsync(): DynamicModule {
    const winstonProvider: Provider = {
      provide: Logger,
      useFactory: (): Logger => {
        const loggerOptions = Configuration.getOption<LoggerOptions>('loggerOptions');

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
      providers: [winstonProvider, WinstonOtelLogger, OtelLogger],
      exports: [Logger, WinstonOtelLogger, OtelLogger],
    };
  }
}
