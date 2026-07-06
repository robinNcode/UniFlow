using Uniflow.Enums;

namespace Uniflow.Entities;

public class NotificationLog
{
    public Guid Id { get; set; }
    public Guid? ApplicationId { get; set; }
    public Guid StudentId { get; set; }
    public NotificationChannel Channel { get; set; }
    public string TemplateKey { get; set; } = null!;
    public string? Payload { get; set; } // stored as JSON
    public NotificationStatus Status { get; set; } = NotificationStatus.pending;
    public short AttemptCount { get; set; } = 0;
    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; }

    public Application? Application { get; set; }
    public Student Student { get; set; } = null!;
}
