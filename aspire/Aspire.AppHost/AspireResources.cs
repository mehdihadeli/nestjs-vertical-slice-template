using Humanizer;

namespace Aspire.AppHost;

public static class AspireResources
{
    public static readonly string Postgres = nameof(Postgres).Kebaberize();
    
    public static readonly string Redis = nameof(Redis).Kebaberize();
    public static readonly string MongoDb = nameof(MongoDb).Kebaberize();
    public static readonly string Prometheus = nameof(Prometheus).Kebaberize();
    public static readonly string Loki = nameof(Loki).Kebaberize();
    public static readonly string Tempo = nameof(Tempo).Kebaberize();
    public static readonly string OpenTelemetryCollector = nameof(OpenTelemetryCollector).Kebaberize();
    public static readonly string Grafana = nameof(Grafana).Kebaberize();
    public static readonly string ElasticSearch = nameof(ElasticSearch).Kebaberize();
    public static readonly string Kibana = nameof(Kibana).Kebaberize();
    public static readonly string EventStore = nameof(EventStore).Kebaberize();
    public static readonly string ReactFoodDelivery = nameof(ReactFoodDelivery).Kebaberize();
    public static readonly string Rabbitmq = nameof(Rabbitmq).Kebaberize();
    public static readonly string AspireDashboard = nameof(AspireDashboard).Kebaberize();
}
