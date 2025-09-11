import { Configuration } from '@libs/configurations/configuration';
import { DependencyValidatorService } from '@libs/logger/dependency-validator.service';
import { LOGGER_PROVIDER_TOKEN } from '@libs/logger/logger.tokens';
import { LoggerOptions } from '@libs/logger/nest/logger-options';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerModule as NestjsPinoLoggerModule } from 'nestjs-pino';
import { Logger } from 'nestjs-pino';
import { Params } from 'nestjs-pino/params';
import { v7 as uuidv7 } from 'uuid';

@Global()
@Module({
  imports: [],
})
export class PinoLoggerModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PinoLoggerModule,
      providers: [
        DependencyValidatorService,
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useExisting: Logger,
        },
      ],
      imports: [
        // https://docs.nestjs.com/modules#dynamic-modules
        // https://docs.nestjs.com/fundamentals/dynamic-modules
        NestjsPinoLoggerModule.forRootAsync({
          useFactory: (): Params => {
            const loggerOptions = Configuration.getOption<LoggerOptions>('loggerOptions');

            return {
              pinoHttp: {
                genReqId: (req, _): string => req.headers['x-correlation-id']?.at(0) ?? uuidv7().toString(),
                level: loggerOptions?.level ?? 'log',
                transport: {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    ignore: 'pid,hostname',
                    singleLine: false,
                    levelFirst: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss',
                  },
                },
              },
            };
          },
        }),
      ],
      exports: [NestjsPinoLoggerModule, LOGGER_PROVIDER_TOKEN],
    };
  }
}
