@echo off
REM Database Migration Helper Script for Windows
REM Usage: migrate.bat [provider] [operation]
REM Providers: SqlServer, MySQL, PostgreSQL, SQLite
REM Operations: add, update, remove, drop

setlocal enabledelayedexpansion

set PROVIDER=%1
if "%PROVIDER%"=="" set PROVIDER=SqlServer

set OPERATION=%2
if "%OPERATION%"=="" set OPERATION=update

set MIGRATION_NAME=%3
if "%MIGRATION_NAME%"=="" (
    for /f "tokens=2 delims= " %%i in ('date /t') do set DATE=%%i
    for /f "tokens=1 delims= " %%i in ('time /t') do set TIME=%%i
    set MIGRATION_NAME=Migration_!DATE:/=!_!TIME::=!
    set MIGRATION_NAME=!MIGRATION_NAME: =!
)

set STARTUP_PROJECT=TrainingManagement.API
set INFRASTRUCTURE_PROJECT=TrainingManagement.Infrastructure

echo 🔄 Database Migration Helper
echo Provider: %PROVIDER%
echo Operation: %OPERATION%

if "%OPERATION%"=="add" (
    echo 📝 Adding new migration: %MIGRATION_NAME%
    set ASPNETCORE_ENVIRONMENT=%PROVIDER%
    dotnet ef migrations add %MIGRATION_NAME% --project %INFRASTRUCTURE_PROJECT% --startup-project %STARTUP_PROJECT% --context TrainingDbContext
) else if "%OPERATION%"=="update" (
    echo 🔄 Updating database to latest migration
    set ASPNETCORE_ENVIRONMENT=%PROVIDER%
    dotnet ef database update --project %INFRASTRUCTURE_PROJECT% --startup-project %STARTUP_PROJECT% --context TrainingDbContext
) else if "%OPERATION%"=="remove" (
    echo 🗑️ Removing last migration
    set ASPNETCORE_ENVIRONMENT=%PROVIDER%
    dotnet ef migrations remove --project %INFRASTRUCTURE_PROJECT% --startup-project %STARTUP_PROJECT% --context TrainingDbContext
) else if "%OPERATION%"=="drop" (
    echo 💥 Dropping database (DESTRUCTIVE)
    set /p CONFIRM="Are you sure you want to drop the database? [y/N] "
    if /i "!CONFIRM!"=="y" (
        set ASPNETCORE_ENVIRONMENT=%PROVIDER%
        dotnet ef database drop --project %INFRASTRUCTURE_PROJECT% --startup-project %STARTUP_PROJECT% --context TrainingDbContext --force
    ) else (
        echo Operation cancelled
    )
) else if "%OPERATION%"=="info" (
    echo ℹ️ Database information
    set ASPNETCORE_ENVIRONMENT=%PROVIDER%
    dotnet ef dbcontext info --project %INFRASTRUCTURE_PROJECT% --startup-project %STARTUP_PROJECT% --context TrainingDbContext
) else (
    echo ❌ Unknown operation: %OPERATION%
    echo Available operations: add, update, remove, drop, info
    exit /b 1
)

echo ✅ Operation completed
