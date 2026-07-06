namespace Uniflow.Entities;

public class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    /// <summary>JSON array of permission strings, e.g. ["applications.review", "seat_quotas.manage"].</summary>
    public string Permissions { get; set; } = "[]";

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<StaffUser> StaffUsers { get; set; } = new List<StaffUser>();
}
