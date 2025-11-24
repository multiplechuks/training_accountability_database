using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class ParticipantConfiguration
{
    public static void ConfigureParticipantEntities(ModelBuilder builder)
    {
        builder.Entity<Participant>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.IdNo).IsUnique();
            entity.HasIndex(e => e.Email);

            entity.HasMany(e => e.ParticipantEnrollments)
                .WithOne(e => e.Participant)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.NextOfKins)
                .WithOne(e => e.Participant)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ParticipantEnrollment>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => new { e.ParticipantFK, e.TrainingFK }).IsUnique();

            entity.HasOne(e => e.Designation)
                .WithMany(e => e.ParticipantEnrollments)
                .HasForeignKey(e => e.DesignationFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.SalaryScale)
                .WithMany(e => e.ParticipantEnrollments)
                .HasForeignKey(e => e.SalaryScaleFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Department)
                .WithMany(e => e.ParticipantEnrollments)
                .HasForeignKey(e => e.DepartmentFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Facility)
                .WithMany(e => e.ParticipantEnrollments)
                .HasForeignKey(e => e.FacilityFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Sponsor)
                .WithMany()
                .HasForeignKey(e => e.SponsorFK)
                .OnDelete(DeleteBehavior.SetNull);

            // Temporarily comment out Bond relationship until properly configured
            // entity.HasOne(e => e.Bond)
            //     .WithOne(e => e.ParticipantEnrollment)
            //     .HasForeignKey<Bond>(e => e.ParticipantEnrollmentFK)
            //     .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<NextOfKin>(entity =>
        {
            entity.HasKey(e => e.PK);
            entity.HasIndex(e => e.ParticipantFK);
        });
    }
}
