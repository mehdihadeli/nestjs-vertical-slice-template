import { OtelLogger } from '@libs/logger/nest/otel-logger';
import { Injectable, Logger, LoggerService, LogLevel } from '@nestjs/common';

/**
 * Combines NestJS built-in Logger with OpenTelemetry logging.
 * Forwards all log calls to both systems.
 */
@Injectable()
export class NestOtelLogger implements LoggerService {
  constructor(
    private readonly nestLogger: Logger,
    private readonly otelLogger: OtelLogger,
  ) {}

  /**
   * Log a message at 'log' level.
   * NestJS Logger accepts optional `context`.
   */
  log(message: any, ...optionalParams: any[]): void {
    this.nestLogger.log(message, optionalParams);
    this.otelLogger.log(message, optionalParams);
  }

  /**
   * Log a message at 'error' level.
   */
  error(message: any, ...optionalParams: any[]): void {
    this.nestLogger.error(message, optionalParams);
    this.otelLogger.error(message, optionalParams);
  }

  /**
   * Log a message at 'warn' level.
   */
  warn(message: any, ...optionalParams: any[]): void {
    this.nestLogger.warn(message, optionalParams);
    this.otelLogger.warn(message, optionalParams);
  }

  /**
   * Log a message at 'debug' level.
   */
  debug(message: any, ...optionalParams: any[]): void {
    this.nestLogger.debug(message, optionalParams);
    this.otelLogger.debug(message, optionalParams);
  }

  /**
   * Log a message at 'verbose' level.
   * NestJS Logger supports 'verbose', so we call it directly.
   */
  verbose(message: any, ...optionalParams: any[]): void {
    this.nestLogger.verbose(message, optionalParams);
    this.otelLogger.verbose(message, optionalParams);
  }

  /**
   * Log a message at 'fatal' level.
   * NestJS Logger doesn't have 'fatal' — fallback to 'error'.
   */
  fatal(message: any, ...optionalParams: any[]): void {
    this.nestLogger.error(message, optionalParams); // NestJS has no .fatal()
    this.otelLogger.fatal(message, optionalParams);
  }

  /**
   * Set active log levels (delegates to OtelLogger).
   * NestJS Logger does not expose a public setLogLevels, so we only forward to OtelLogger.
   */
  setLogLevels(levels: LogLevel[]): void {
    this.otelLogger.setLogLevels(levels);
  }
}
