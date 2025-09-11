import { LOGGER_PROVIDER_TOKEN } from '@libs/logger/logger.tokens';
import { OtelLogger } from '@libs/opentelemetry/loggers/otel-logger';
import { Inject, Injectable, type LoggerService, LogLevel } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ApplicationOtelLogger implements LoggerService {
  constructor(
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly systemLogger: LoggerService,
    private readonly otelLogger: OtelLogger,
  ) {}

  log(message: any, ...optionalParams: any[]): void {
    this.systemLogger.log(message, optionalParams);
    this.otelLogger.log(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    this.systemLogger.error(message, optionalParams);
    this.otelLogger.error(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.systemLogger.warn(message, optionalParams);
    this.otelLogger.warn(message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    if (typeof (this.systemLogger as Logger & { debug?: (...args: any[]) => void }).debug === 'function') {
      (this.systemLogger as Logger & { debug: (...args: any[]) => void }).debug(message, optionalParams);
    }
    this.otelLogger.debug(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    if (typeof (this.systemLogger as Logger & { trace?: (...args: any[]) => void }).trace === 'function') {
      (this.systemLogger as Logger & { trace: (...args: any[]) => void }).trace(message, optionalParams);
    } else if (typeof (this.systemLogger as Logger & { debug?: (...args: any[]) => void }).debug === 'function') {
      (this.systemLogger as Logger & { debug: (...args: any[]) => void }).debug(message, optionalParams);
    }
    this.otelLogger.verbose(message, optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]): void {
    // Only call fatal if it exists and is a function
    if (typeof (this.systemLogger as Logger & { fatal?: (...args: any[]) => void }).fatal === 'function') {
      (this.systemLogger as Logger & { fatal: (...args: any[]) => void }).fatal(message, optionalParams);
    } else {
      this.systemLogger.error(message, optionalParams);
    }
    this.otelLogger.fatal(message, optionalParams);
  }

  setLogLevels(levels: LogLevel[]): void {
    // Only OtelLogger supports this
    this.otelLogger.setLogLevels(levels);
  }
}
