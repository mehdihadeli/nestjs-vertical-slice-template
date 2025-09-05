import { DiagnosticsProvider } from '@libs/opentelemetry/diagnostics-provider';
import { Logger } from '@nestjs/common';
import { Context, Span, SpanStatusCode, context, trace } from '@opentelemetry/api';
import {
  ATTR_EXCEPTION_MESSAGE,
  ATTR_EXCEPTION_STACKTRACE,
  ATTR_EXCEPTION_TYPE,
  ATTR_OTEL_STATUS_CODE,
  ATTR_OTEL_STATUS_DESCRIPTION,
} from '@opentelemetry/semantic-conventions';

import { CreateSpanInfo } from './create-span-info';

export const ISpanRunnerToken = Symbol('ISpanRunner');

export interface ISpanRunner {
  createAndStartSpan(createSpanInfo: CreateSpanInfo): Span;
  executeSpanAsync(createSpanInfo: CreateSpanInfo, action: (span: Span | null) => Promise<void>): Promise<void>;
  executeSpanWithResult<TResult>(
    createSpanInfo: CreateSpanInfo,
    action: (span: Span | null) => Promise<TResult>,
  ): Promise<TResult>;
}

export class SpanRunner implements ISpanRunner {
  private readonly logger: Logger = new Logger(SpanRunner.name);
  constructor(private readonly diagnosticsProvider: DiagnosticsProvider) {
    this.diagnosticsProvider = diagnosticsProvider;
  }

  createAndStartSpan(createSpanInfo: CreateSpanInfo): Span {
    if (!createSpanInfo) {
      throw new Error('createSpanInfo cannot be null');
    }

    const tracer = this.diagnosticsProvider.getTracer();
    const spanName = `${this.diagnosticsProvider.getInstrumentationName()}.${createSpanInfo.name}`;

    const spanOptions = {
      kind: createSpanInfo.kind,
      attributes: createSpanInfo.attributes,
    };

    let parentContext: Context = context.active();

    if (createSpanInfo.parentContext) {
      parentContext = createSpanInfo.parentContext;
    } else if (createSpanInfo.parentSpan) {
      parentContext = trace.setSpan(context.active(), createSpanInfo.parentSpan);
    }

    return tracer.startSpan(spanName, spanOptions, parentContext);
  }

  async executeSpanAsync(createSpanInfo: CreateSpanInfo, action: (span: Span | null) => Promise<void>): Promise<void> {
    if (!createSpanInfo) {
      throw new Error('createSpanInfo cannot be null');
    }

    const span = this.createAndStartSpan(createSpanInfo);

    try {
      await action(span);
      this.setOkStatus(span);
    } catch (error) {
      this.handleSpanError(span, error as Error);
      throw error;
    } finally {
      span.end();
    }
  }

  async executeSpanWithResult<TResult>(
    createSpanInfo: CreateSpanInfo,
    action: (span: Span | null) => Promise<TResult>,
  ): Promise<TResult> {
    if (!createSpanInfo) {
      throw new Error('createSpanInfo cannot be null');
    }

    const span = this.createAndStartSpan(createSpanInfo);

    try {
      const result = await action(span);
      this.setOkStatus(span);
      return result;
    } catch (error) {
      this.handleSpanError(span, error as Error);
      throw error;
    } finally {
      span.end();
    }
  }

  private handleSpanError(span: Span, error: Error): void {
    this.setErrorStatus(span, error);
    this.logger.error(`Error occurred during span ${span.spanContext().spanId}: ${error.message}`, error.stack);
  }

  private setOkStatus(span: Span, description?: string): void {
    span.setStatus({ code: SpanStatusCode.OK, message: description });

    span.setAttribute(ATTR_OTEL_STATUS_CODE, 'OK');

    if (description) {
      span.setAttribute(ATTR_OTEL_STATUS_DESCRIPTION, description);
    }
  }

  private setErrorStatus(span: Span, error: Error, description?: string): void {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: description || error.message,
    });

    span.setAttribute(ATTR_OTEL_STATUS_CODE, 'ERROR');

    if (description) {
      span.setAttribute(ATTR_OTEL_STATUS_DESCRIPTION, description);
    }

    this.setExceptionTags(span, error);
  }

  private setExceptionTags(span: Span, error: Error): void {
    span.recordException(error);

    span.setAttribute(ATTR_EXCEPTION_MESSAGE, error.message);
    span.setAttribute(ATTR_EXCEPTION_STACKTRACE, error.stack || '');
    span.setAttribute(ATTR_EXCEPTION_TYPE, error.constructor.name);
  }
}
