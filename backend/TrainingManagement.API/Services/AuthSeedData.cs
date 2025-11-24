using Microsoft.AspNetCore.Identity;
using TrainingManagement.Core.Entities;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.API.Services;

public static class AuthSeedData
{
    public static async Task SeedRolesAndUsersAsync(
        UserManager<User> userManager,
        RoleManager<ApplicationRole> roleManager,
        TrainingDbContext context)
    {
        // Seed Roles
        var roles = new[] { "Admin", "User", "Manager", "Trainer", "Participant" };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var role = new ApplicationRole
                {
                    Name = roleName,
                    NormalizedName = roleName.ToUpper(),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                };

                await roleManager.CreateAsync(role);
            }
        }

        // Seed Admin User
        var adminEmail = "admin@learning.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Administrator",
                DateOfBirth = new DateTime(1990, 1, 1),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "System"
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(adminUser, new[] { "Admin", "Manager" });
            }
        }

        // Seed Test User
        var testUserEmail = "test@learning.com";
        if (await userManager.FindByEmailAsync(testUserEmail) == null)
        {
            var testUser = new User
            {
                UserName = testUserEmail,
                Email = testUserEmail,
                EmailConfirmed = true,
                FirstName = "Test",
                LastName = "User",
                DateOfBirth = new DateTime(1992, 5, 15),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "System"
            };

            var result = await userManager.CreateAsync(testUser, "Test123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(testUser, "User");
            }
        }

        // Seed Trainer User
        var trainerEmail = "trainer@learning.com";
        if (await userManager.FindByEmailAsync(trainerEmail) == null)
        {
            var trainerUser = new User
            {
                UserName = trainerEmail,
                Email = trainerEmail,
                EmailConfirmed = true,
                FirstName = "John",
                LastName = "Trainer",
                DateOfBirth = new DateTime(1985, 8, 20),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "System"
            };

            var result = await userManager.CreateAsync(trainerUser, "Trainer123!");
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(trainerUser, new[] { "Trainer", "User" });
            }
        }

        await context.SaveChangesAsync();
    }
}
