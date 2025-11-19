using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TrainingManagement.Infrastructure.Configuration;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public interface IDatabaseProviderFactory
{
    void ConfigureDbContext(IServiceCollection services, DatabaseConfiguration config);
    string GetConnectionString(DatabaseConfiguration config);
}

public class DatabaseProviderFactory : IDatabaseProviderFactory
{
    public void ConfigureDbContext(IServiceCollection services, DatabaseConfiguration config)
    {
        var connectionString = GetConnectionString(config);

        services.AddDbContext<TrainingDbContext>(options =>
        {
            ConfigureProvider(options, config, connectionString);

            if (config.EnableSensitiveDataLogging)
            {
                options.EnableSensitiveDataLogging();
            }

            if (config.EnableDetailedErrors)
            {
                options.EnableDetailedErrors();
            }
        });
    }

    public string GetConnectionString(DatabaseConfiguration config)
    {
        if (!string.IsNullOrEmpty(config.ConnectionString))
        {
            return config.ConnectionString;
        }

        return config.Provider switch
        {
            DatabaseProvider.SqlServer => "Server=.;Database=TrainingManagementDb;Trusted_Connection=true;TrustServerCertificate=true;",
            DatabaseProvider.MySQL => "Server=localhost;Database=TrainingManagementDb;Uid=root;Pwd=password;",
            DatabaseProvider.PostgreSQL => "Host=localhost;Database=TrainingManagementDb;Username=postgres;Password=password;",
            DatabaseProvider.SQLite => GetSqliteConnectionString(config.SQLite),
            _ => throw new NotSupportedException($"Database provider {config.Provider} is not supported")
        };
    }

    private static void ConfigureProvider(DbContextOptionsBuilder options, DatabaseConfiguration config, string connectionString)
    {
        switch (config.Provider)
        {
            case DatabaseProvider.SqlServer:
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                });
                break;

            case DatabaseProvider.MySQL:
                var serverVersion = ServerVersion.Parse(config.MySQL.ServerVersion);
                options.UseMySql(connectionString, serverVersion, mysqlOptions =>
                {
                    if (config.MySQL.EnableRetryOnFailure)
                    {
                        mysqlOptions.EnableRetryOnFailure(
                            maxRetryCount: config.MySQL.MaxRetryCount,
                            maxRetryDelay: config.MySQL.MaxRetryDelay,
                            errorNumbersToAdd: null);
                    }
                });
                break;

            case DatabaseProvider.PostgreSQL:
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    if (config.PostgreSQL.EnableRetryOnFailure)
                    {
                        npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: config.PostgreSQL.MaxRetryCount,
                            maxRetryDelay: config.PostgreSQL.MaxRetryDelay,
                            errorCodesToAdd: null);
                    }
                });
                break;

            case DatabaseProvider.SQLite:
                options.UseSqlite(connectionString, sqliteOptions =>
                {
                    sqliteOptions.CommandTimeout(30);
                });
                break;

            default:
                throw new NotSupportedException($"Database provider {config.Provider} is not supported");
        }
    }

    private static string GetSqliteConnectionString(SqliteSettings settings)
    {
        var dataDirectory = Path.Combine(Directory.GetCurrentDirectory(), settings.DataDirectory);
        if (!Directory.Exists(dataDirectory))
        {
            Directory.CreateDirectory(dataDirectory);
        }

        var dbPath = Path.Combine(dataDirectory, "TrainingManagement.db");
        var connectionString = $"Data Source={dbPath};";

        if (settings.EnableForeignKeys)
        {
            connectionString += "Foreign Keys=True;";
        }

        return connectionString;
    }
}
