using Uniflow.Enums;

namespace Uniflow.Entities;

/// <summary>
/// Denylist for access-token "jti" claims that must stop working before
/// their natural exp — logout, password change, admin force-logout.
/// Everything else about access-token validation stays stateless
/// (signature + exp only); this table is checked only in those few
/// immediate-revocation cases. Safe to purge rows once ExpiresAt passes.
/// </summary>
public class RevokedAccessToken
{
    public Guid Id { get; set; }
    public Guid Jti { get; set; }
    public SubjectType SubjectType { get; set; }
    public Guid SubjectId { get; set; }
    public DateTime ExpiresAt { get; set; } // mirrors the original token's exp, for cleanup
    public DateTime RevokedAt { get; set; }
    public string? Reason { get; set; }
}
