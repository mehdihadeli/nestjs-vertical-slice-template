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

var foodApi = builder.AddNpmApp("frontend", "../../backend", "start:dev")
    .WithReference(foodPostgres)
    .WithEnvironment("BROWSER", "none") 
    .WithEnvironment("NODE_ENV", "development")
    .WithHttpEndpoint(env: "APP_OPTIONS__PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
