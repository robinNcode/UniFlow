using Microsoft.EntityFrameworkCore;
using Uniflow.Entities;

namespace Uniflow.Data.Seeders;

public static class AuthSeeder
{
    public static async Task SeedAsync(UniflowDbContext db)
    {
        if (await db.Roles.AnyAsync())
        {
            return; // already seeded
        }

        var roles = new List<Role>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "super_admin",
                Description = "Full platform access across all universities",
                Permissions = "[\"*\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "admission_officer",
                Description = "Manages admission cycles, seat quotas, and reviews applications",
                Permissions = "[\"admission_cycles.manage\",\"seat_quotas.manage\",\"applications.review\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "finance_officer",
                Description = "Views and reconciles payments",
                Permissions = "[\"payments.view\",\"payments.reconcile\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "support_staff",
                Description = "Read-only access for handling student queries",
                Permissions = "[\"applications.view\",\"students.view\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await db.Roles.AddRangeAsync(roles);
        await db.SaveChangesAsync();

        var superAdminRole = roles.First(r => r.Name == "super_admin");

        var superAdmin = new StaffUser
        {
            Id = Guid.NewGuid(),
            UniversityId = null, // platform-wide
            RoleId = superAdminRole.Id,
            FullName = "Platform Administrator",
            Email = "admin@uniflow.local",
            Phone = null,
            PasswordHash = PlaceholderHash("ChangeMe123!"),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await db.StaffUsers.AddAsync(superAdmin);
        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Placeholder hash — replace with BCrypt.Net-Next or ASP.NET Core
    /// Identity's PasswordHasher before this goes anywhere near production.
    /// The seeded super_admin password ("ChangeMe123!") must be rotated
    /// immediately after first deploy.
    /// </summary>
    private static string PlaceholderHash(string plainText)
        => Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(plainText)));
}
