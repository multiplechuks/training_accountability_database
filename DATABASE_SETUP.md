# Botswana Training Management System - Database Configuration

This system supports multiple database providers: **SQL Server**, **MySQL**, **PostgreSQL**, and **SQLite**.

## 🗄️ Supported Database Providers

### 1. SQL Server (Default)
```json
{
  "Database": {
    "Provider": "SqlServer",
    "ConnectionString": "Server=.;Database=TrainingManagementDb;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

### 2. MySQL
```json
{
  "Database": {
    "Provider": "MySQL",
    "ConnectionString": "Server=localhost;Database=TrainingManagementDb;Uid=root;Pwd=your-secure-password-here;",
    "MySQL": {
      "ServerVersion": "8.0.0"
    }
  }
}
```

### 3. PostgreSQL
```json
{
  "Database": {
    "Provider": "PostgreSQL",
    "ConnectionString": "Host=localhost;Database=TrainingManagementDb;Username=postgres;Password=your-secure-password-here;"
  }
}
```

### 4. SQLite
```json
{
  "Database": {
    "Provider": "SQLite",
    "SQLite": {
      "DataDirectory": "Data",
      "EnableForeignKeys": true
    }
  }
}
```

## 🚀 Quick Start

### Option 1: Using Environment-Specific Configuration Files

1. **SQL Server** (default):
   ```bash
   dotnet run
   ```

2. **MySQL**:
   ```bash
   dotnet run --environment MySQL
   ```

3. **PostgreSQL**:
   ```bash
   dotnet run --environment PostgreSQL
   or
   ASPNETCORE_ENVIRONMENT=PostgreSQL dotnet run
   ```

4. **SQLite**:
   ```bash
   dotnet run --environment SQLite
   ```

### Option 2: Modify appsettings.json

Simply change the `Provider` value in `appsettings.json`:

```json
{
  "Database": {
    "Provider": "MySQL",  // Change this to: SqlServer, MySQL, PostgreSQL, or SQLite
    "ConnectionString": "your-connection-string-here"
  }
}
```

## 🛠️ Database Setup Instructions

### SQL Server
1. Install SQL Server or SQL Server Express
2. Update connection string with your server details
3. Run migrations: `./migrate.bat SqlServer update`

### MySQL
1. Install MySQL Server
2. Create database: `CREATE DATABASE TrainingManagementDb;`
3. Update connection string with your credentials
4. Run migrations: `./migrate.bat MySQL update`

### PostgreSQL
1. Install PostgreSQL
2. Create database: `createdb TrainingManagementDb`
3. Update connection string with your credentials
4. Run migrations: `./migrate.bat PostgreSQL update`

### SQLite
1. No installation required (embedded database)
2. Database file will be created automatically in `Data/TrainingManagement.db`
3. Run migrations: `./migrate.bat SQLite update`

## 🔧 Migration Commands

### Windows (PowerShell/CMD):
```bash
# Add new migration
./migrate.bat [Provider] add "MigrationName"

# Update database
./migrate.bat [Provider] update

# Remove last migration
./migrate.bat [Provider] remove

# Drop database (destructive)
./migrate.bat [Provider] drop

# Get database info
./migrate.bat [Provider] info
```

### Linux/Mac (Bash):
```bash
# Add new migration
./migrate.sh [Provider] add "MigrationName"

# Update database
./migrate.sh [Provider] update

# Remove last migration
./migrate.sh [Provider] remove

# Drop database (destructive)
./migrate.sh [Provider] drop

# Get database info
./migrate.sh [Provider] info
```

## 🔐 Connection String Examples

### SQL Server
```
Server=localhost;Database=TrainingManagementDb;Trusted_Connection=true;TrustServerCertificate=true;
```

### MySQL
```
Server=localhost;Port=3306;Database=TrainingManagementDb;Uid=root;Pwd=your_password;
```

### PostgreSQL
```
Host=localhost;Port=5432;Database=TrainingManagementDb;Username=postgres;Password=your_password;
```

### SQLite
```
Data Source=Data/TrainingManagement.db;Foreign Keys=True;
```

## ⚙️ Configuration Options

```json
{
  "Database": {
    "Provider": "SqlServer",
    "ConnectionString": "your-connection-string",
    "EnableSensitiveDataLogging": false,
    "EnableDetailedErrors": true,
    
    "MySQL": {
      "ServerVersion": "8.0.0",
      "EnableRetryOnFailure": true,
      "MaxRetryCount": 3,
      "MaxRetryDelay": "00:00:30"
    },
    
    "PostgreSQL": {
      "EnableRetryOnFailure": true,
      "MaxRetryCount": 3,
      "MaxRetryDelay": "00:00:30"
    },
    
    "SQLite": {
      "DataDirectory": "Data",
      "EnableForeignKeys": true
    }
  }
}
```

## 🐋 Docker Support

### MySQL with Docker:
```bash
docker run --name mysql-training -e MYSQL_ROOT_PASSWORD=YOUR_PASSWORD_HERE -e MYSQL_DATABASE=TrainingManagementDb -p 3306:3306 -d mysql:8.0
```

### PostgreSQL with Docker:
```bash
docker run --name postgres-training -e POSTGRES_PASSWORD=YOUR_PASSWORD_HERE -e POSTGRES_DB=TrainingManagementDb -p 5432:5432 -d postgres:15
```

## 🔍 Troubleshooting

### Common Issues:

1. **Connection refused**: Ensure database server is running
2. **Authentication failed**: Check username/password in connection string
3. **Database doesn't exist**: Create the database manually or use migrations
4. **Version mismatch**: Update ServerVersion for MySQL in configuration

### Database-Specific Notes:

- **SQL Server**: Requires SQL Server Express or higher
- **MySQL**: Supports version 5.7 and higher, recommend 8.0+
- **PostgreSQL**: Supports version 10 and higher, recommend 13+
- **SQLite**: Perfect for development and small deployments

## 📊 Performance Considerations

- **SQL Server**: Best for Windows environments, excellent performance
- **MySQL**: Great for web applications, good performance
- **PostgreSQL**: Advanced features, excellent for complex queries
- **SQLite**: Fastest setup, good for development and small applications

Choose the database that best fits your deployment environment and requirements!
