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

    // DbSets for core entities
    public DbSet<Participant> Participants { get; set; }
    public DbSet<Training> Trainings { get; set; }
    public DbSet<ParticipantEnrollment> ParticipantEnrollments { get; set; }
    public DbSet<Allowance> Allowances { get; set; }
    public DbSet<AllowanceType> AllowanceTypes { get; set; }
    public DbSet<AllowanceStatus> AllowanceStatuses { get; set; }

    // DbSets for lookup entities (from LookupEntities.cs)
    public DbSet<Department> Departments { get; set; }
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<Designation> Designations { get; set; }
    public DbSet<SalaryScale> SalaryScales { get; set; }
    public DbSet<Sponsor> Sponsors { get; set; }

    // DbSets for additional entities (from AdditionalEntities.cs)
    public DbSet<NextOfKin> NextOfKins { get; set; }
    public DbSet<ParticipantTraining> ParticipantTrainings { get; set; }
    // public DbSet<Bond> Bonds { get; set; } // Temporarily disabled until relationship is properly configured

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations using local method calls
        IdentityConfiguration.ConfigureIdentityTables(modelBuilder);
        TrainingConfiguration.ConfigureTrainingEntities(modelBuilder);
        ParticipantConfiguration.ConfigureParticipantEntities(modelBuilder);
        AllowanceConfiguration.ConfigureAllowanceEntities(modelBuilder);
        RelatedEntitiesConfiguration.ConfigureRelatedEntities(modelBuilder);
        LookupConfiguration.ConfigureLookupEntities(modelBuilder);
        DatabaseSpecificConfiguration.ConfigureDatabaseSpecific(modelBuilder, "microsoft.entityframeworkcore.sqlserver");
    }
}
