using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class AllowanceConfiguration
{
    public static void ConfigureAllowanceEntities(ModelBuilder builder)
    {
        builder.Entity<Allowance>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Admission)
                .WithMany()
                .HasForeignKey(e => e.AdmissionFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Participant)
                .WithMany(e => e.Allowances)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.AllowanceType)
                .WithMany(e => e.Allowances)
                .HasForeignKey(e => e.AllowanceTypeFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.AllowanceStatus)
                .WithMany(e => e.Allowances)
                .HasForeignKey(e => e.StatusFK)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<AllowanceType>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        builder.Entity<AllowanceStatus>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Name).IsUnique();
        });
    }
}
