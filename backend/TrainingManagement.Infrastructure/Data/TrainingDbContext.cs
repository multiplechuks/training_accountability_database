using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrainingManagement.Core.Entities;
using TrainingManagement.Infrastructure.Data.Configurations;

namespace TrainingManagement.Infrastructure.Data;

public class TrainingDbContext : IdentityDbContext<User, ApplicationRole, int>
{
    private readonly IHttpContextAccessor? _httpContextAccessor;

    public TrainingDbContext(DbContextOptions<TrainingDbContext> options, IHttpContextAccessor? httpContextAccessor = null)
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
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

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var currentUser = _httpContextAccessor?.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value ?? "System";

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
                entry.Entity.CreatedBy = currentUser;
                entry.Entity.UpdatedBy = currentUser;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
                entry.Entity.UpdatedBy = currentUser;
                entry.Property(e => e.CreatedAt).IsModified = false;
                entry.Property(e => e.CreatedBy).IsModified = false;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

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
