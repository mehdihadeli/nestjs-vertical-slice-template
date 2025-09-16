using aspire.AppHost;
using aspire.AppHost.AspireIntegrations;
using aspire.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var appHostLaunchProfile = builder.GetLaunchProfileName();
Console.WriteLine($"AppHost LaunchProfile is: {appHostLaunchProfile}");

var pgUser = builder.AddParameter("pg-user", value: "postgres", publishValueAsDefault: true);
var pgPassword = builder.AddParameter(name: "pg-password", value: new GenerateParameterDefault { MinLength = 3 }, true);

var postgres = builder.AddAspirePostgres(
    AspireResources.Postgres,
    userName: pgUser,
    password: pgPassword,
    initScriptPath: "./../../deployments/configs/init-postgres.sql"
);
var foodPostgres = postgres.AddAspirePostgresDatabase(
    nameOrConnectionStringName: AspireApplicationResources.PostgresDatabase.Foods,
    databaseName: nameof(AspireApplicationResources.PostgresDatabase.Foods).ToLowerInvariant()
);

var foodApi = builder.AddNpmApp(AspireApplicationResources.Api.FoodApi, "../../backend", "start:dev")
    .WithReference(foodPostgres)
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
