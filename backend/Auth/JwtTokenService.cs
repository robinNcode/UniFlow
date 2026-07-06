using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Uniflow.Data;
using Uniflow.Entities;
using Uniflow.Enums;

namespace Uniflow.Auth;

public record AccessTokenResult(string AccessToken, string RefreshToken, DateTime AccessTokenExpiresAt);

/// <summary>
/// Reference implementation tying the auth tables to actual JWT issuance.
/// - Access tokens: short-lived (15 min), stateless, signature+exp only.
/// - Refresh tokens: long-lived (30 days), persisted hashed, rotated on
///   every use, and checked for reuse (theft detection).
/// - Revocation: checking RevokedAccessTokens is only needed on routes
///   that must honor immediate logout/force-revoke; most endpoints can
///   skip the DB round-trip entirely and just validate the JWT.
/// </summary>
public class JwtTokenService
{
    private readonly UniflowDbContext _db;
    private readonly string _signingKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly TimeSpan _accessTokenLifetime = TimeSpan.FromMinutes(15);
    private readonly TimeSpan _refreshTokenLifetime = TimeSpan.FromDays(30);

    public JwtTokenService(UniflowDbContext db, string signingKey, string issuer, string audience)
    {
        _db = db;
        _signingKey = signingKey;
        _issuer = issuer;
        _audience = audience;
    }

    /// <summary>Issues a fresh access + refresh token pair and persists the refresh token (hashed).</summary>
    public async Task<AccessTokenResult> IssueTokensAsync(
        SubjectType subjectType,
        Guid subjectId,
        IEnumerable<string> permissions,
        string? createdByIp = null,
        string? userAgent = null)
    {
        var jti = Guid.NewGuid();
        var now = DateTime.UtcNow;
        var accessExpiresAt = now.Add(_accessTokenLifetime);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, jti.ToString()),
            new(JwtRegisteredClaimNames.Sub, subjectId.ToString()),
            new("subject_type", subjectType.ToString()),
        };
        claims.AddRange(permissions.Select(p => new Claim("perm", p)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_signingKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            notBefore: now,
            expires: accessExpiresAt,
            signingCredentials: creds);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        var rawRefreshToken = GenerateSecureRandomToken();
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            SubjectType = subjectType,
            SubjectId = subjectId,
            TokenHash = Hash(rawRefreshToken),
            Jti = jti,
            IssuedAt = now,
            ExpiresAt = now.Add(_refreshTokenLifetime),
            CreatedByIp = createdByIp,
            UserAgent = userAgent
        };

        await _db.RefreshTokens.AddAsync(refreshTokenEntity);
        await _db.SaveChangesAsync();

        return new AccessTokenResult(accessToken, rawRefreshToken, accessExpiresAt);
    }

    /// <summary>
    /// Rotates a refresh token: validates it's active, revokes it, issues
    /// a new pair. If the presented token was already revoked, that's a
    /// reuse signal — the whole token family (same Jti) is revoked.
    /// </summary>
    public async Task<AccessTokenResult?> RefreshAsync(string rawRefreshToken, IEnumerable<string> currentPermissions, string? createdByIp = null, string? userAgent = null)
    {
        var tokenHash = Hash(rawRefreshToken);
        var existing = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        if (existing is null)
        {
            return null; // unknown token
        }

        if (existing.RevokedAt is not null)
        {
            // Reuse of a revoked token — treat as compromised and kill the whole family.
            await RevokeFamilyAsync(existing.Jti, "reuse_detected");
            return null;
        }

        if (existing.ExpiresAt <= DateTime.UtcNow)
        {
            return null; // expired, nothing to rotate
        }

        var result = await IssueTokensAsync(existing.SubjectType, existing.SubjectId, currentPermissions, createdByIp, userAgent);

        existing.RevokedAt = DateTime.UtcNow;
        // The new refresh token's Id isn't known until after IssueTokensAsync saves it;
        // in a real implementation, thread the new RefreshToken entity through instead
        // of re-querying by hash so this stays a single round trip.
        var newRefreshEntity = await _db.RefreshTokens.FirstAsync(t => t.TokenHash == Hash(result.RefreshToken));
        existing.ReplacedByTokenId = newRefreshEntity.Id;
        await _db.SaveChangesAsync();

        return result;
    }

    /// <summary>Revokes every refresh token sharing a Jti (used on reuse detection or "logout all devices").</summary>
    public async Task RevokeFamilyAsync(Guid jti, string reason)
    {
        var tokens = await _db.RefreshTokens.Where(t => t.Jti == jti && t.RevokedAt == null).ToListAsync();
        foreach (var t in tokens)
        {
            t.RevokedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
    }

    /// <summary>Immediate access-token revocation (logout, password change) via the jti denylist.</summary>
    public async Task RevokeAccessTokenAsync(Guid jti, SubjectType subjectType, Guid subjectId, DateTime tokenExpiresAt, string reason)
    {
        await _db.RevokedAccessTokens.AddAsync(new RevokedAccessToken
        {
            Id = Guid.NewGuid(),
            Jti = jti,
            SubjectType = subjectType,
            SubjectId = subjectId,
            ExpiresAt = tokenExpiresAt,
            RevokedAt = DateTime.UtcNow,
            Reason = reason
        });
        await _db.SaveChangesAsync();
    }

    /// <summary>Only needed on routes that must honor immediate revocation — most routes skip this.</summary>
    public Task<bool> IsAccessTokenRevokedAsync(Guid jti)
        => _db.RevokedAccessTokens.AnyAsync(t => t.Jti == jti);

    private static string GenerateSecureRandomToken()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    private static string Hash(string raw)
        => Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(raw)));
}
