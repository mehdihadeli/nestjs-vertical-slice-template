import { Configuration } from '@libs/configurations/configuration';
import { LoggerOptions } from '@libs/logger/nest/logger-options';
import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerModule as NestjsPinoLoggerModule } from 'nestjs-pino';
import { Params } from 'nestjs-pino/params';
import { v4 as uuidv4 } from 'uuid';

import { PinoOtelLogger } from './pino-otel.logger';

@Global()
@Module({
  imports: [],
})
export class PinoLoggerModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PinoLoggerModule,
      providers: [PinoOtelLogger, OtelLogger],
      imports: [
        // https://docs.nestjs.com/modules#dynamic-modules
        // https://docs.nestjs.com/fundamentals/dynamic-modules
        NestjsPinoLoggerModule.forRootAsync({
          useFactory: (): Params => {
            const loggerOptions = Configuration.getOption<LoggerOptions>('loggerOptions');

            return {
              pinoHttp: {
                genReqId: (req, _): string => req.headers['x-correlation-id']?.at(0) ?? uuidv4().toString(),
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
      exports: [NestjsPinoLoggerModule, PinoOtelLogger, OtelLogger],
    };
  }
}
