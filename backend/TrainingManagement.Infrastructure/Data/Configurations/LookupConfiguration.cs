using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class LookupConfiguration
{
    public static void ConfigureLookupEntities(ModelBuilder builder)
    {
        builder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasIndex(e => e.Code).IsUnique();
        });

        builder.Entity<Facility>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Code).IsUnique();
        });

        builder.Entity<Designation>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.Code).IsUnique();
        });

        builder.Entity<SalaryScale>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Scale).IsUnique();
            entity.Property(e => e.MinSalary).HasColumnType("decimal(18,2)");
            entity.Property(e => e.MaxSalary).HasColumnType("decimal(18,2)");
        });

        builder.Entity<Sponsor>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Email);
        });
    }
}
