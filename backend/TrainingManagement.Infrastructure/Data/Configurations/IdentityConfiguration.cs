using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data.Configurations;

public static class IdentityConfiguration
{
    public static void ConfigureIdentityTables(ModelBuilder builder)
    {
        // Rename Identity tables and configure integer keys
        builder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        builder.Entity<ApplicationRole>(entity =>
        {
            entity.ToTable("Roles");
            // Don't configure HasKey here - it's already configured in the base class
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");
    }
}
