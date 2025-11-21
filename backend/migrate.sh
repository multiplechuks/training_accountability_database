#!/bin/bash

# Database Migration Helper Script
# Usage: ./migrate.sh [provider] [operation]
# Providers: SqlServer, MySQL, PostgreSQL, SQLite
# Operations: add, update, remove, drop

PROVIDER=${1:-SqlServer}
OPERATION=${2:-update}
MIGRATION_NAME=${3:-"Migration_$(date +%Y%m%d_%H%M%S)"}

PROJECT_DIR="$(pwd)"
STARTUP_PROJECT="TrainingManagement.API"
INFRASTRUCTURE_PROJECT="TrainingManagement.Infrastructure"

echo "🔄 Database Migration Helper"
echo "Provider: $PROVIDER"
echo "Operation: $OPERATION"

case $OPERATION in
    add)
        echo "📝 Adding new migration: $MIGRATION_NAME"
        ASPNETCORE_ENVIRONMENT=$PROVIDER dotnet ef migrations add $MIGRATION_NAME \
            --project $INFRASTRUCTURE_PROJECT \
            --startup-project $STARTUP_PROJECT \
            --context TrainingDbContext
        ;;
    update)
        echo "🔄 Updating database to latest migration"
        ASPNETCORE_ENVIRONMENT=$PROVIDER dotnet ef database update \
            --project $INFRASTRUCTURE_PROJECT \
            --startup-project $STARTUP_PROJECT \
            --context TrainingDbContext
        ;;
    remove)
        echo "🗑️ Removing last migration"
        ASPNETCORE_ENVIRONMENT=$PROVIDER dotnet ef migrations remove \
            --project $INFRASTRUCTURE_PROJECT \
            --startup-project $STARTUP_PROJECT \
            --context TrainingDbContext
        ;;
    drop)
        echo "💥 Dropping database (DESTRUCTIVE)"
        read -p "Are you sure you want to drop the database? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            ASPNETCORE_ENVIRONMENT=$PROVIDER dotnet ef database drop \
                --project $INFRASTRUCTURE_PROJECT \
                --startup-project $STARTUP_PROJECT \
                --context TrainingDbContext \
                --force
        else
            echo "Operation cancelled"
        fi
        ;;
    info)
        echo "ℹ️ Database information"
        ASPNETCORE_ENVIRONMENT=$PROVIDER dotnet ef dbcontext info \
            --project $INFRASTRUCTURE_PROJECT \
            --startup-project $STARTUP_PROJECT \
            --context TrainingDbContext
        ;;
    *)
        echo "❌ Unknown operation: $OPERATION"
        echo "Available operations: add, update, remove, drop, info"
        exit 1
        ;;
esac

echo "✅ Operation completed"
