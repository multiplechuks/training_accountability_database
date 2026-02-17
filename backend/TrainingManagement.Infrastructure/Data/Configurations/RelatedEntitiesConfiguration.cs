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

            entity.HasOne(e => e.ParticipantEnrollment)
                .WithOne(e => e.Bond)
                .HasForeignKey<Bond>(e => e.ParticipantEnrollmentFK)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<TrainingReport>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.ReportDate);
        });

        builder.Entity<TrainingBudget>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.Property(e => e.AllocatedAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SpentAmount).HasColumnType("decimal(18,2)");
            entity.Ignore(e => e.RemainingAmount); // Computed property

            entity.HasOne(e => e.Training)
                .WithMany(e => e.TrainingBudgets)
                .HasForeignKey(e => e.TrainingFK)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // New entities for 6-form enrollment
        builder.Entity<Nomination>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.Property(e => e.EstimatedBudget).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.YearOfNomination);
            entity.HasIndex(e => e.NominationStatus);

            entity.HasOne(e => e.Participant)
                .WithMany(e => e.Nominations)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Sponsor)
                .WithMany()
                .HasForeignKey(e => e.SponsorFK)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<TrainingExtension>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.Property(e => e.EstimatedExtensionCost).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.ExtensionStartDate);

            entity.HasOne(e => e.ParticipantEnrollment)
                .WithMany(e => e.TrainingExtensions)
                .HasForeignKey(e => e.ParticipantEnrollmentFK)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<EnrollmentProgress>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => new { e.ParticipantFK, e.EnrollmentStatus });
            entity.HasIndex(e => e.CurrentStep);

            entity.HasOne(e => e.Participant)
                .WithMany(e => e.EnrollmentProgresses)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Nomination)
                .WithMany()
                .HasForeignKey(e => e.NominationFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.ParticipantEnrollment)
                .WithMany(e => e.EnrollmentProgresses)
                .HasForeignKey(e => e.ParticipantEnrollmentFK)
                .OnDelete(DeleteBehavior.SetNull);
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
