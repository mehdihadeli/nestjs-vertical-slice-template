import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { Logger } from 'winston';

import { OtelLogger } from '../nest/otel-logger';

@Injectable()
export class WinstonOtelLogger implements LoggerService {
  constructor(
    private readonly winstonLogger: Logger,
    private readonly otelLogger: OtelLogger,
  ) {}

  log(message: string, ...optionalParams: any[]): void {
    this.winstonLogger.info(message, optionalParams);
    this.otelLogger.log(message, optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.winstonLogger.error(message, optionalParams);
    this.otelLogger.error(message, optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.winstonLogger.warn(message, optionalParams);
    this.otelLogger.warn(message, optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.winstonLogger.debug(message, optionalParams);
    this.otelLogger.debug(message, optionalParams);
  }

  verbose(message: string, ...optionalParams: any[]): void {
    // Winston has 'verbose', call it if it exists, fallback to debug
    if (typeof this.winstonLogger.verbose === 'function') {
      this.winstonLogger.verbose(message, optionalParams);
    } else {
      this.winstonLogger.debug(message, optionalParams);
    }
    this.otelLogger.verbose(message, optionalParams);
  }

  fatal(message: string, ...optionalParams: any[]): void {
    // Safely check and call fatal if it exists
    const maybeFatal = (this.winstonLogger as Partial<Record<'fatal', (...args: any[]) => void>>).fatal;
    if (typeof maybeFatal === 'function') {
      maybeFatal.call(this.winstonLogger, message, optionalParams);
    } else {
      this.winstonLogger.error(message, optionalParams);
    }
    this.otelLogger.fatal(message, optionalParams);
  }

  setLogLevels(levels: LogLevel[]): void {
    this.otelLogger.setLogLevels(levels);
  }
}
