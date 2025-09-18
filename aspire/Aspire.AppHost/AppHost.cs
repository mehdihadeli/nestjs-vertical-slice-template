using Aspire.AppHost;
using Aspire.AppHost.AspireIntegrations.Grafana;
using Aspire.AppHost.AspireIntegrations.Loki;
using Aspire.AppHost.AspireIntegrations.OpenTelemetryCollector;
using Aspire.AppHost.AspireIntegrations.Postgres;
using Aspire.AppHost.AspireIntegrations.Prometheus;
using Aspire.AppHost.AspireIntegrations.Tempo;
using Aspire.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var appHostLaunchProfile = builder.GetLaunchProfileName();
Console.WriteLine($"AppHost LaunchProfile is: {appHostLaunchProfile}");

var postgres = builder.AddAspirePostgres(
    AspireResources.Postgres,
    initScriptPath: "./../../deployments/configs/init-postgres.sql"
);
var foodPostgres = postgres.AddAspirePostgresDatabase(
    nameOrConnectionStringName: AspireApplicationResources.PostgresDatabase.Foods,
    databaseName: nameof(AspireApplicationResources.PostgresDatabase.Foods).ToLowerInvariant()
);

var prometheus = builder.AddAspirePrometheus(
    AspireResources.Prometheus,
    configBindMountPath: "./../../deployments/configs/prometheus.yaml"
);
var loki = builder.AddAspireLoki(
    AspireResources.Loki,
    configBindMountPath: "./../../deployments/configs/loki-config.yaml"
);
var tempo = builder.AddAspireTempo(
    AspireResources.Tempo,
    configBindMountPath: "./../../deployments/configs/tempo.yaml"
);

var otelCollector = builder.AddAspireOpenTelemetryCollector(
    nameOrConnectionStringName: AspireResources.OpenTelemetryCollector,
    configBindMountPath: "./../../deployments/configs/otel-collector-config.yaml",
    waitForDependencies: [ prometheus, loki, tempo]
);

var grafana = builder.AddAspireGrafana(
    AspireResources.Grafana,
    provisioningPath: "./../../deployments/configs/grafana/provisioning",
    dashboardsPath: "./../../deployments/configs/grafana/dashboards",
    waitForDependencies: [prometheus, loki, tempo]
);

var foodApi = builder.AddNpmApp(AspireApplicationResources.Api.FoodApi, "../../backend", "start:dev")
    .WaitFor(foodPostgres)
    .WithReference(foodPostgres)
    .WithReference(otelCollector)
    .WaitFor(otelCollector)
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("NODE_ENV", "development")
    .WithHttpEndpoint(env: "APP_OPTIONS__PORT")
    .WithExternalHttpEndpoints()
    // AddProject --> WithProjectDefaults--> WithOtlpExporter: Injects the appropriate environment variables to allow sending telemetry to the dashboard.
    // It sets the OTLP endpoint (OTEL_EXPORTER_OTLP_ENDPOINT) to the value of the `ASPIRE_DASHBOARD_OTLP_ENDPOINT_URL`
    // environment variable with a default value of `http://localhost:18889`.
    // https://github.com/dotnet/aspire/blob/5be4f73b7dfb0d1665d73bd96434295e268a0453/src/Aspire.Hosting/OtlpConfigurationExtensions.cs#L187
    // https://github.com/dotnet/aspire/blob/5be4f73b7dfb0d1665d73bd96434295e268a0453/src/Aspire.Hosting/ProjectResourceBuilderExtensions.cs#L308
    .WithOtlpExporter()
    .PublishAsDockerFile();

builder.Build().Run();
