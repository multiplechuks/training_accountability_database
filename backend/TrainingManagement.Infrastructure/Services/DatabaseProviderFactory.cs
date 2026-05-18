using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TrainingManagement.Infrastructure.Configuration;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public interface IDatabaseProviderFactory
{
    void ConfigureDbContext(IServiceCollection services, DatabaseConfiguration config);
}

public class DatabaseProviderFactory : IDatabaseProviderFactory
{
    public void ConfigureDbContext(IServiceCollection services, DatabaseConfiguration config)
    {
        services.AddDbContext<TrainingDbContext>(options =>
        {
            switch (config.Provider)
            {
                case DatabaseProvider.MySQL:
                    options.UseMySql(config.ConnectionString, ServerVersion.AutoDetect(config.ConnectionString));
                    break;
                case DatabaseProvider.PostgreSQL:
                    options.UseNpgsql(config.ConnectionString);
                    break;
                case DatabaseProvider.SQLite:
                    options.UseSqlite(config.ConnectionString);
                    break;
                default:
                    options.UseSqlServer(config.ConnectionString);
                    break;
            }
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
}
