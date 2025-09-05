import { Attributes, Context, Span, SpanKind } from '@opentelemetry/api';

export class CreateSpanInfo {
  name: string;
  kind: SpanKind;
  parentContext?: Context;
  parentSpan?: Span;
  attributes?: Attributes;
}
