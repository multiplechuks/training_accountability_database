using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class LookupConfiguration
{
    public static void Configure(ModelBuilder builder)
    {
        builder.Entity<Title>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<IdType>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<RelationshipType>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<Department>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<SalaryScale>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Scale).IsUnique(); });
        builder.Entity<DutyStation>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<SponsorType>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<Qualification>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
        builder.Entity<NominatedProgram>(e => e.HasKey(x => x.PK));
        builder.Entity<AdmissionProgram>(e => e.HasKey(x => x.PK));
        builder.Entity<ModeOfStudy>(e => { e.HasKey(x => x.PK); e.HasIndex(x => x.Name).IsUnique(); });
    }
}
