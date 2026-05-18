using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class NominationConfiguration
{
    public static void Configure(ModelBuilder builder)
    {
        builder.Entity<Nomination>(entity =>
        {
            entity.HasKey(e => e.PK);

            entity.Property(e => e.EstimatedBudget)
                .HasPrecision(18, 4);

            entity.HasOne(e => e.Participant)
                .WithMany(e => e.Nominations)
                .HasForeignKey(e => e.ParticipantFK)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Qualification)
                .WithMany(e => e.Nominations)
                .HasForeignKey(e => e.QualificationFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.NominatedProgram)
                .WithMany(e => e.Nominations)
                .HasForeignKey(e => e.NominatedProgramFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.SponsorType)
                .WithMany(e => e.Nominations)
                .HasForeignKey(e => e.SponsorTypeFK)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
