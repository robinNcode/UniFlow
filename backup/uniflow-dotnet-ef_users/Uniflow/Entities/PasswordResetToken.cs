using Uniflow.Enums;

namespace Uniflow.Entities;

public class PasswordResetToken
{
    public Guid Id { get; set; }
    public SubjectType SubjectType { get; set; }
    public Guid SubjectId { get; set; }

    /// <summary>SHA-256 hash of the raw reset token sent to the user — never store the raw value.</summary>
    public string TokenHash { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
