using Microsoft.EntityFrameworkCore;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class DatabaseSpecificConfiguration
{
    public static void ConfigureDatabaseSpecific(ModelBuilder builder, string? databaseProvider)
    {
        var provider = databaseProvider?.ToLower();

        switch (provider)
        {
            case "microsoft.entityframeworkcore.sqlserver":
                // ConfigureSqlServer(builder);
                break;
            case "pomelo.entityframeworkcore.mysql":
                ConfigureMySql(builder);
                break;
            case "npgsql.entityframeworkcore.postgresql":
                ConfigurePostgreSQL(builder);
                break;
            case "microsoft.entityframeworkcore.sqlite":
                ConfigureSqlite(builder);
                break;
        }
    }

    // private static void ConfigureSqlServer(ModelBuilder builder)
    // {
    //     // SQL Server specific configurations
    //     // Decimal precision is already configured above
    // }

    private static void ConfigureMySql(ModelBuilder builder)
    {
        // MySQL specific configurations
        // Use utf8mb4 charset for proper Unicode support
        builder.HasCharSet("utf8mb4");

        // MySQL doesn't support DateTimeOffset, use DateTime
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTimeOffset) || property.ClrType == typeof(DateTimeOffset?))
                {
                    property.SetColumnType("datetime(6)");
                }
            }
        }
    }

    private static void ConfigurePostgreSQL(ModelBuilder builder)
    {
        // PostgreSQL specific configurations
        // PostgreSQL is case-sensitive, so we'll use snake_case naming
        foreach (var entity in builder.Model.GetEntityTypes())
        {
            // Convert table names to snake_case
            var tableName = entity.GetTableName();
            if (tableName != null)
            {
                entity.SetTableName(ToSnakeCase(tableName));
            }

            // Convert column names to snake_case
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.GetColumnName()));
            }

            // Convert index names to snake_case
            foreach (var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if (indexName != null)
                {
                    index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }
        }
    }

    private static void ConfigureSqlite(ModelBuilder builder)
    {
        // SQLite specific configurations
        // SQLite doesn't support some data types, so we need to handle them
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                // Convert decimal to TEXT for SQLite
                if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                {
                    property.SetColumnType("TEXT");
                }

                // Convert DateTimeOffset to TEXT
                if (property.ClrType == typeof(DateTimeOffset) || property.ClrType == typeof(DateTimeOffset?))
                {
                    property.SetColumnType("TEXT");
                }
            }
        }
    }

    private static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return input;
        }

        var result = new System.Text.StringBuilder();
        for (int i = 0; i < input.Length; i++)
        {
            var currentChar = input[i];
            if (char.IsUpper(currentChar) && i > 0)
            {
                result.Append('_');
            }
            result.Append(char.ToLower(currentChar));
        }
        return result.ToString();
    }
}
