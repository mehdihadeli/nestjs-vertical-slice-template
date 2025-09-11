import { AppOptions } from '@libs/configurations/app-options';
import { Configuration } from '@libs/configurations/configuration';
import { DependencyValidatorService } from '@libs/opentelemetry/dependency-validator.service';
import { DiagnosticsProvider } from '@libs/opentelemetry/diagnostics-provider';
import { ApplicationOtelLogger } from '@libs/opentelemetry/loggers/application-otel-logger';
import { OtelLogger } from '@libs/opentelemetry/loggers/otel-logger';
import { OpenTelemetryOptions } from '@libs/opentelemetry/open-telemetry-options';
import { ISpanRunnerToken, SpanRunner } from '@libs/opentelemetry/span-runner';
import { DynamicModule, Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPLogExporter as OTLPGrpcLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPLogExporter as OTLPHttpLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter as OTLGrpcMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPMetricExporter as OTLPHttpMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter as OTLPGrpcTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPTraceExporter as OTLPHttpTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { logs, metrics, NodeSDK, tracing } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

@Global()
@Module({})
export class OpenTelemetryModule implements OnModuleInit {
  private static options?: OpenTelemetryOptions;
  private static isStarted = false;

  static forRoot(openTelemetryOptions?: OpenTelemetryOptions): DynamicModule {
    OpenTelemetryModule.options = openTelemetryOptions;

    const providers = [
      DependencyValidatorService,
      DiagnosticsProvider,
      {
        provide: ISpanRunnerToken,
        useClass: SpanRunner,
      },
      OtelLogger,
      ApplicationOtelLogger,
    ];

    const exports = [ISpanRunnerToken, DiagnosticsProvider, ApplicationOtelLogger, OtelLogger];

    return {
      module: OpenTelemetryModule,
      providers,
      exports,
      global: true,
    };
  }

  private static start(openTelemetryOptionsParams?: OpenTelemetryOptions): void {
    const appOptions = Configuration.getOption<AppOptions>('appOptions');

    const openTelemetryOptions =
      openTelemetryOptionsParams ?? Configuration.getOption<OpenTelemetryOptions>('openTelemetryOptions');

    // https://opentelemetry.io/docs/languages/js/instrumentation/#initialize-the-sdk
    // Install node SDK
    const otelSdk = new NodeSDK({
      resource: defaultResource().merge(
        resourceFromAttributes({
          [ATTR_SERVICE_NAME]: appOptions.serviceName,
          [ATTR_SERVICE_VERSION]: appOptions.version,
        }),
      ),
      instrumentations: [getNodeAutoInstrumentations()],
      metricReader: new metrics.PeriodicExportingMetricReader({
        exporter: OpenTelemetryModule.getMetricExporter(openTelemetryOptions),
      }),
      spanProcessors: OpenTelemetryModule.getSpanProcessors(openTelemetryOptions),
      logRecordProcessors: OpenTelemetryModule.getLogProcessors(openTelemetryOptions),
      textMapPropagator: new CompositePropagator({
        propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
      }),
    });

    process.on('SIGTERM', () => {
      otelSdk
        .shutdown()
        .then(
          () => Logger.log('SDK shut down successfully'),
          err => Logger.log('Error shutting down SDK', err),
        )
        .finally(() => process.exit(0));
    });

    otelSdk.start();
  }

  private static getMetricExporter(otelOptions: OpenTelemetryOptions): metrics.PushMetricExporter {
    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.openTelemetryCollectorOptions.otlpGrpcExporterEndpoint
    ) {
      return new OTLGrpcMetricExporter({
        url: otelOptions.openTelemetryCollectorOptions.otlpGrpcExporterEndpoint,
      });
    }

    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.openTelemetryCollectorOptions.otlpHttpExporterEndpoint
    ) {
      return new OTLPHttpMetricExporter({
        url: otelOptions.openTelemetryCollectorOptions.otlpHttpExporterEndpoint,
      });
    }

    if (
      otelOptions.aspireDashboardOTLPOptions?.enabled &&
      otelOptions.aspireDashboardOTLPOptions.otlpGrpcExporterEndpoint
    ) {
      return new OTLGrpcMetricExporter({
        url: otelOptions.aspireDashboardOTLPOptions.otlpGrpcExporterEndpoint,
      });
    }

    return new metrics.ConsoleMetricExporter();
  }

  private static getLogProcessors(otelOptions: OpenTelemetryOptions): logs.LogRecordProcessor[] {
    const logProcessors: logs.LogRecordProcessor[] = [];

    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.openTelemetryCollectorOptions.otlpHttpExporterEndpoint
    ) {
      logProcessors.push(
        new logs.SimpleLogRecordProcessor(
          new OTLPHttpLogExporter({
            url: otelOptions.openTelemetryCollectorOptions.otlpHttpExporterEndpoint,
          }),
        ),
      );
    }

    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.openTelemetryCollectorOptions.otlpGrpcExporterEndpoint
    ) {
      logProcessors.push(
        new logs.SimpleLogRecordProcessor(
          new OTLPGrpcLogExporter({
            url: otelOptions.openTelemetryCollectorOptions.otlpGrpcExporterEndpoint,
          }),
        ),
      );
    }

    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.aspireDashboardOTLPOptions?.otlpGrpcExporterEndpoint
    ) {
      logProcessors.push(
        new logs.SimpleLogRecordProcessor(
          new OTLPGrpcLogExporter({
            url: otelOptions.aspireDashboardOTLPOptions?.otlpGrpcExporterEndpoint,
          }),
        ),
      );
    }

    if (otelOptions.useConsoleExporter) {
      logProcessors.push(new logs.SimpleLogRecordProcessor(new logs.ConsoleLogRecordExporter()));
    }

    return logProcessors;
  }

  private static getSpanProcessors(otelOptions: OpenTelemetryOptions): tracing.SpanProcessor[] {
    const spanProcessors: tracing.SpanProcessor[] = [];

    if (otelOptions.useConsoleExporter) {
      spanProcessors.push(new tracing.BatchSpanProcessor(new tracing.ConsoleSpanExporter()));
    }

    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.openTelemetryCollectorOptions.otlpHttpExporterEndpoint
    ) {
      spanProcessors.push(
        new tracing.BatchSpanProcessor(
          new OTLPHttpTraceExporter({
            url: otelOptions.openTelemetryCollectorOptions.otlpHttpExporterEndpoint,
          }),
        ),
      );
    }

    if (
      otelOptions.openTelemetryCollectorOptions?.enabled &&
      otelOptions.openTelemetryCollectorOptions.otlpGrpcExporterEndpoint
    ) {
      spanProcessors.push(
        new tracing.BatchSpanProcessor(
          new OTLPGrpcTraceExporter({
            url: otelOptions.openTelemetryCollectorOptions.otlpGrpcExporterEndpoint,
          }),
        ),
      );
    }

    if (
      otelOptions.aspireDashboardOTLPOptions?.enabled &&
      otelOptions.aspireDashboardOTLPOptions.otlpGrpcExporterEndpoint
    ) {
      spanProcessors.push(
        new tracing.BatchSpanProcessor(
          new OTLPGrpcTraceExporter({
            // This may not work if OTLPTraceExporter doesn't support grpc url option directly.
            // Adjust this config if you want to use grpc version
            url: otelOptions.aspireDashboardOTLPOptions.otlpGrpcExporterEndpoint,
          }),
        ),
      );
    }
    return spanProcessors;
  }

  onModuleInit(): any {
    if (OpenTelemetryModule.isStarted) return;
    OpenTelemetryModule.start(OpenTelemetryModule.options);
    OpenTelemetryModule.isStarted = true;
  }
}
