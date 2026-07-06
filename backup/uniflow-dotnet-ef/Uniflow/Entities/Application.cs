using Uniflow.Enums;

namespace Uniflow.Entities;

public class Application
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid CycleId { get; set; }
    public Guid QuotaId { get; set; }
    public decimal MeritScore { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.pending;
    public DateTime AppliedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Student Student { get; set; } = null!;
    public AdmissionCycle Cycle { get; set; } = null!;
    public SeatQuota Quota { get; set; } = null!;

    public SeatReservation? SeatReservation { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public AdmitCard? AdmitCard { get; set; }
    public ICollection<NotificationLog> NotificationLogs { get; set; } = new List<NotificationLog>();
}
