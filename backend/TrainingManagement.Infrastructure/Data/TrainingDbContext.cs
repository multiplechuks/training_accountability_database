using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Infrastructure.Data.Configurations;

namespace TrainingManagement.Infrastructure.Data;

public class TrainingDbContext : IdentityDbContext<User, ApplicationRole, int>
{
    public TrainingDbContext(DbContextOptions<TrainingDbContext> options) : base(options)
    {
    }

    // Core entities
    public DbSet<Participant> Participants { get; set; }
    public DbSet<NextOfKin> NextOfKins { get; set; }
    public DbSet<Nomination> Nominations { get; set; }
    public DbSet<Admission> Admissions { get; set; }

    // Allowances (kept)
    public DbSet<Allowance> Allowances { get; set; }
    public DbSet<AllowanceType> AllowanceTypes { get; set; }
    public DbSet<AllowanceStatus> AllowanceStatuses { get; set; }

    // Configurable lookups
    public DbSet<Title> Titles { get; set; }
    public DbSet<IdType> IdTypes { get; set; }
    public DbSet<RelationshipType> RelationshipTypes { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<SalaryScale> SalaryScales { get; set; }
    public DbSet<DutyStation> DutyStations { get; set; }
    public DbSet<SponsorType> SponsorTypes { get; set; }
    public DbSet<Qualification> Qualifications { get; set; }
    public DbSet<NominatedProgram> NominatedPrograms { get; set; }
    public DbSet<AdmissionProgram> AdmissionPrograms { get; set; }
    public DbSet<ModeOfStudy> ModesOfStudy { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        IdentityConfiguration.ConfigureIdentityTables(modelBuilder);
        ParticipantConfiguration.Configure(modelBuilder);
        NominationConfiguration.Configure(modelBuilder);
        AdmissionConfiguration.Configure(modelBuilder);
        AllowanceConfiguration.ConfigureAllowanceEntities(modelBuilder);
        LookupConfiguration.Configure(modelBuilder);
        DatabaseSpecificConfiguration.ConfigureDatabaseSpecific(modelBuilder, "microsoft.entityframeworkcore.sqlserver");
    }
}
