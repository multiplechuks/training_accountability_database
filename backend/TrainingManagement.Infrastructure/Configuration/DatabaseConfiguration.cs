namespace TrainingManagement.Infrastructure.Configuration;

public class DatabaseConfiguration
{
    public const string SECTION_NAME = "Database";

    public DatabaseProvider Provider { get; set; } = DatabaseProvider.SqlServer;
    public string ConnectionString { get; set; } = string.Empty;
    public bool EnableSensitiveDataLogging { get; set; } = false;
    public bool EnableDetailedErrors { get; set; } = false;

    // MySQL specific settings
    public MySqlSettings MySQL { get; set; } = new();

    // PostgreSQL specific settings
    public PostgreSqlSettings PostgreSQL { get; set; } = new();

    // SQLite specific settings
    public SqliteSettings SQLite { get; set; } = new();
}

public enum DatabaseProvider
{
    SqlServer,
    MySQL,
    PostgreSQL,
    SQLite
}

public class MySqlSettings
{
    public string ServerVersion { get; set; } = "8.0.0";
    public bool EnableRetryOnFailure { get; set; } = true;
    public int MaxRetryCount { get; set; } = 3;
    public TimeSpan MaxRetryDelay { get; set; } = TimeSpan.FromSeconds(30);
}

public class PostgreSqlSettings
{
    public bool EnableRetryOnFailure { get; set; } = true;
    public int MaxRetryCount { get; set; } = 3;
    public TimeSpan MaxRetryDelay { get; set; } = TimeSpan.FromSeconds(30);
}

public class SqliteSettings
{
    public string DataDirectory { get; set; } = "Data";
    public bool EnableForeignKeys { get; set; } = true;
}
