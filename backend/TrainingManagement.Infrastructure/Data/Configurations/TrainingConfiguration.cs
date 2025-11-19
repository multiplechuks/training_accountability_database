using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class TrainingConfiguration
{
    public static void ConfigureTrainingEntities(ModelBuilder builder)
    {
        builder.Entity<Training>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.Institution);
            entity.HasIndex(e => e.Program);
            entity.HasIndex(e => e.FinancialYear);

            entity.HasOne(e => e.Sponsor)
                .WithMany(e => e.Trainings)
                .HasForeignKey(e => e.SponsorFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(e => e.ParticipantEnrollments)
                .WithOne(e => e.Training)
                .HasForeignKey(e => e.TrainingFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.TrainingBudgets)
                .WithOne(e => e.Training)
                .HasForeignKey(e => e.TrainingFK)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.TrainingReports)
                .WithOne(e => e.Training)
                .HasForeignKey(e => e.TrainingFK)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<TrainingBudget>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.Property(e => e.AllocatedAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SpentAmount).HasColumnType("decimal(18,2)");
            entity.Ignore(e => e.RemainingAmount); // Computed property
        });
    }
}
