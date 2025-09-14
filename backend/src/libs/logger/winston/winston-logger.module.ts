import { Configuration } from '@libs/configurations/configuration';
import { DependencyValidatorService } from '@libs/logger/dependency-validator.service';
import { LOGGER_PROVIDER_TOKEN } from '@libs/logger/logger.tokens';
import { LoggerOptions } from '@libs/logger/nest/logger-options';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import * as winston from 'winston';
import { Logger } from 'winston';

const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

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
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
          ),
          transports: [new winston.transports.Console()],
        });
      },
    };

    return {
      module: WinstonLoggerModule,
      providers: [
        winstonProvider,
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useExisting: Logger,
        },
        DependencyValidatorService,
      ],
      exports: [Logger, LOGGER_PROVIDER_TOKEN],
    };
  }
}
