namespace Uniflow.Entities;

public class StaffUser
{
    public Guid Id { get; set; }
    public Guid? UniversityId { get; set; } // null = platform-wide staff (e.g. super_admin)
    public Guid RoleId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string PasswordHash { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public University? University { get; set; }
    public Role Role { get; set; } = null!;
}
