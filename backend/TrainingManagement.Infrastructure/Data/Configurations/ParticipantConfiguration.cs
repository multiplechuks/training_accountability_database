using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class ParticipantConfiguration
{
    public static void Configure(ModelBuilder builder)
    {
        builder.Entity<Participant>(entity =>
        {
            entity.HasKey(e => e.PK);

            entity.HasOne(e => e.Title)
                .WithMany(e => e.Participants)
                .HasForeignKey(e => e.TitleFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.IdType)
                .WithMany(e => e.Participants)
                .HasForeignKey(e => e.IdTypeFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.SalaryScale)
                .WithMany(e => e.Participants)
                .HasForeignKey(e => e.SalaryScaleFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Department)
                .WithMany(e => e.Participants)
                .HasForeignKey(e => e.DepartmentFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.DutyStation)
                .WithMany(e => e.Participants)
                .HasForeignKey(e => e.DutyStationFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.IdNumber).IsUnique();
        });

        builder.Entity<NextOfKin>(entity =>
        {
            entity.HasKey(e => e.PK);

            entity.HasOne(e => e.Participant)
                .WithOne(e => e.NextOfKin)
                .HasForeignKey<NextOfKin>(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.RelationshipType)
                .WithMany(e => e.NextOfKins)
                .HasForeignKey(e => e.RelationshipTypeFK)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
