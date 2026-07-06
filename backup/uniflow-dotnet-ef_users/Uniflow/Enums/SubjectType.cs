namespace Uniflow.Enums;

/// <summary>
/// Distinguishes which actor a token/role row belongs to, since
/// refresh_tokens / revoked_access_tokens / password_reset_tokens
/// are shared across both Student and StaffUser without a real FK
/// (MySQL can't FK one column to two different tables).
/// </summary>
public enum SubjectType
{
    student,
    staff
}
