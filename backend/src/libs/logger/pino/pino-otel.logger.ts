import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PinoOtelLogger implements LoggerService {
  constructor(
    private readonly pinoLogger: Logger,
    private readonly otelLogger: OtelLogger,
  ) {}

  log(message: any, ...optionalParams: any[]): void {
    this.pinoLogger.log(message, optionalParams);
    this.otelLogger.log(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    this.pinoLogger.error(message, optionalParams);
    this.otelLogger.error(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.pinoLogger.warn(message, optionalParams);
    this.otelLogger.warn(message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    this.pinoLogger.debug(message, optionalParams);
    this.otelLogger.debug(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    if (typeof (this.pinoLogger as Logger & { trace?: (...args: any[]) => void }).trace === 'function') {
      (this.pinoLogger as Logger & { trace: (...args: any[]) => void }).trace(message, optionalParams);
    } else {
      this.pinoLogger.debug(message, optionalParams);
    }
    this.otelLogger.verbose(message, optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]): void {
    // Only call fatal if it exists and is a function
    if (typeof (this.pinoLogger as Logger & { fatal?: (...args: any[]) => void }).fatal === 'function') {
      (this.pinoLogger as Logger & { fatal: (...args: any[]) => void }).fatal(message, optionalParams);
    } else {
      this.pinoLogger.error(message, optionalParams);
    }
    this.otelLogger.fatal(message, optionalParams);
  }

  setLogLevels(levels: LogLevel[]): void {
    // Only OtelLogger supports this
    this.otelLogger.setLogLevels(levels);
  }
}
