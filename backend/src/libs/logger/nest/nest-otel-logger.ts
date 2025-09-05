import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { Injectable, Logger, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class NestOtelLogger implements LoggerService {
  constructor(
    private readonly nestLogger: Logger,
    private readonly otelLogger: OtelLogger,
  ) {}

  log(message: any, ...optionalParams: any[]): void {
    this.nestLogger.log(message, optionalParams);
    this.otelLogger.log(message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): any {}

  error(message: any, ...optionalParams: any[]): any {}

  fatal(message: any, ...optionalParams: any[]): any {}

  setLogLevels(levels: LogLevel[]): any {}

  verbose(message: any, ...optionalParams: any[]): any {}

  warn(message: any, ...optionalParams: any[]): any {}
}
