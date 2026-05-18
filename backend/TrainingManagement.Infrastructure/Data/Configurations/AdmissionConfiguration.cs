using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class AdmissionConfiguration
{
    public static void Configure(ModelBuilder builder)
    {
        builder.Entity<Admission>(entity =>
        {
            entity.HasKey(e => e.PK);

            entity.HasOne(e => e.Nomination)
                .WithOne(e => e.Admission)
                .HasForeignKey<Admission>(e => e.NominationFK)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.AdmissionProgram)
                .WithMany(e => e.Admissions)
                .HasForeignKey(e => e.AdmissionProgramFK)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.ModeOfStudy)
                .WithMany(e => e.Admissions)
                .HasForeignKey(e => e.ModeOfStudyFK)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Allowance>(entity =>
        {
            entity.HasOne(e => e.Admission)
                .WithMany()
                .HasForeignKey(e => e.AdmissionFK)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
