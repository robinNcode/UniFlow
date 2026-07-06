using Microsoft.EntityFrameworkCore;
using Uniflow.Entities;
using Uniflow.Enums;

namespace Uniflow.Data.Seeders;

/// <summary>
/// Idempotent seeder: safe to run multiple times, checks for existing
/// data before inserting. Call from Program.cs on startup (dev/staging)
/// or from a dedicated console command.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(UniflowDbContext db)
    {
        await db.Database.MigrateAsync();

        if (await db.Universities.AnyAsync())
        {
            return; // already seeded
        }

        // ---- Universities ----
        var buet = new University
        {
            Id = Guid.NewGuid(),
            Name = "Bangladesh University of Engineering and Technology",
            ShortName = "BUET",
            Domain = "buet.ac.bd",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var du = new University
        {
            Id = Guid.NewGuid(),
            Name = "University of Dhaka",
            ShortName = "DU",
            Domain = "du.ac.bd",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await db.Universities.AddRangeAsync(buet, du);

        // ---- Programs ----
        var cse = new AcademicProgram
        {
            Id = Guid.NewGuid(),
            UniversityId = buet.Id,
            Name = "Computer Science and Engineering",
            Code = "CSE",
            DurationYears = 4,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var eee = new AcademicProgram
        {
            Id = Guid.NewGuid(),
            UniversityId = buet.Id,
            Name = "Electrical and Electronic Engineering",
            Code = "EEE",
            DurationYears = 4,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await db.Programs.AddRangeAsync(cse, eee);

        // ---- Admission Cycle ----
        var cycle = new AdmissionCycle
        {
            Id = Guid.NewGuid(),
            ProgramId = cse.Id,
            Title = "CSE 2026 Fall Admission",
            OpensAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc),
            ClosesAt = new DateTime(2026, 9, 15, 23, 59, 59, DateTimeKind.Utc),
            MeritResultAt = new DateTime(2026, 10, 1, 0, 0, 0, DateTimeKind.Utc),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await db.AdmissionCycles.AddAsync(cycle);

        // ---- Seat Quotas ----
        var quotas = new List<SeatQuota>
        {
            new()
            {
                Id = Guid.NewGuid(), CycleId = cycle.Id, QuotaType = QuotaType.general,
                TotalSeats = 120, FilledSeats = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), CycleId = cycle.Id, QuotaType = QuotaType.freedom_fighter,
                TotalSeats = 5, FilledSeats = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), CycleId = cycle.Id, QuotaType = QuotaType.tribal,
                TotalSeats = 3, FilledSeats = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), CycleId = cycle.Id, QuotaType = QuotaType.district_quota,
                TotalSeats = 10, FilledSeats = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), CycleId = cycle.Id, QuotaType = QuotaType.physically_challenged,
                TotalSeats = 2, FilledSeats = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            }
        };

        await db.SeatQuotas.AddRangeAsync(quotas);

        // ---- Students ----
        var students = new List<Student>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Phone = "8801711000001",
                Email = "rafiq.hasan@example.com",
                FullName = "Rafiq Hasan",
                FatherName = "Abdul Hasan",
                MotherName = "Rahima Hasan",
                DateOfBirth = new DateOnly(2008, 3, 12),
                NidOrBirthReg = "1234567890123",
                PasswordHash = BCryptPlaceholderHash("password123"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Phone = "8801711000002",
                Email = "nusrat.jahan@example.com",
                FullName = "Nusrat Jahan",
                FatherName = "Kamal Uddin",
                MotherName = "Selina Begum",
                DateOfBirth = new DateOnly(2008, 7, 22),
                NidOrBirthReg = "9876543210987",
                PasswordHash = BCryptPlaceholderHash("password123"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await db.Students.AddRangeAsync(students);

        await db.SaveChangesAsync();

        // ---- Sample Application (depends on IDs generated above) ----
        var generalQuota = quotas.First(q => q.QuotaType == QuotaType.general);

        var application = new Application
        {
            Id = Guid.NewGuid(),
            StudentId = students[0].Id,
            CycleId = cycle.Id,
            QuotaId = generalQuota.Id,
            MeritScore = 87.500m,
            Status = ApplicationStatus.pending,
            AppliedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await db.Applications.AddAsync(application);
        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Placeholder hash so seed data doesn't store plaintext passwords.
    /// Replace with your real password hasher (e.g. BCrypt.Net-Next,
    /// ASP.NET Core Identity's PasswordHasher) before using in a real app.
    /// </summary>
    private static string BCryptPlaceholderHash(string plainText)
        => Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(plainText)));
}
