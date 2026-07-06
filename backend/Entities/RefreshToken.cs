using Uniflow.Enums;

namespace Uniflow.Entities;

/// <summary>
/// Persisted refresh token (hashed). Access tokens are stateless JWTs
/// and are never stored. On each refresh, the current row is marked
/// revoked and ReplacedByTokenId points at its successor; presenting
/// an already-revoked token again indicates theft and should trigger
/// revoking the whole chain (same Jti) at the application layer.
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; }
    public SubjectType SubjectType { get; set; }
    public Guid SubjectId { get; set; }

    /// <summary>SHA-256 hash of the raw refresh token — never store the raw value.</summary>
    public string TokenHash { get; set; } = null!;

    /// <summary>Matches the "jti" claim of the access-token family this refresh token belongs to.</summary>
    public Guid Jti { get; set; }

    public DateTime IssuedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public Guid? ReplacedByTokenId { get; set; }
    public string? CreatedByIp { get; set; }
    public string? UserAgent { get; set; }

    public RefreshToken? ReplacedByToken { get; set; }

    public bool IsActive => RevokedAt is null && ExpiresAt > DateTime.UtcNow;
}
