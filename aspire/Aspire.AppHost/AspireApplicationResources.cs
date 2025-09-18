using Humanizer;

namespace Aspire.AppHost;

public class AspireApplicationResources
{
    public static class PostgresDatabase
    {
        private const string Postfix = "db";
        private const string Prefix = "pg";
        public static readonly string Foods = $"{Prefix}-{nameof(Foods).Kebaberize()}{Postfix}";
    }

    public static class Api
    {
        public static readonly string FoodApi = $"{nameof(FoodApi).Kebaberize()}";
    }
}
