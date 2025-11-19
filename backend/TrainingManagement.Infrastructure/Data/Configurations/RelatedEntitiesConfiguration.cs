using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class RelatedEntitiesConfiguration
{
    public static void ConfigureRelatedEntities(ModelBuilder builder)
    {
        builder.Entity<Bond>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.Property(e => e.BondAmount).HasColumnType("decimal(18,2)");
        });

        builder.Entity<TrainingReport>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.ReportDate);
        });
    }

    public static void ConfigureTransferEntities(ModelBuilder builder)
    {
        builder.Entity<ParticipantTraining>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => new { e.ParticipantFK, e.TrainingFK });

            entity.HasOne(e => e.Participant)
                .WithMany(e => e.ParticipantTrainings)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Training)
                .WithMany(e => e.ParticipantTrainings)
                .HasForeignKey(e => e.TrainingFK)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<TrainingTransfer>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.StartDate);

            entity.HasOne(e => e.Participant)
                .WithMany(e => e.TrainingTransfers)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Training)
                .WithMany(e => e.TrainingTransfers)
                .HasForeignKey(e => e.TrainingFK)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
