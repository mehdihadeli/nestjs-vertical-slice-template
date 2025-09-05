export class OpenTelemetryOptions {
  useConsoleExporter: boolean;
  openTelemetryCollectorOptions?: OpenTelemetryCollectorOptions;
  aspireDashboardOTLPOptions?: AspireDashboardOTLPOptions;
}

export class OpenTelemetryCollectorOptions {
  enabled: boolean;
  otlpGrpcExporterEndpoint?: string;
  otlpHttpExporterEndpoint?: string;
}

export class AspireDashboardOTLPOptions {
  enabled: boolean;
  otlpGrpcExporterEndpoint?: string;
}
