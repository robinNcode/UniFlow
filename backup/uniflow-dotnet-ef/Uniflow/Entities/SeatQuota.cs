using Uniflow.Enums;

namespace Uniflow.Entities;

public class SeatQuota
{
    public Guid Id { get; set; }
    public Guid CycleId { get; set; }
    public QuotaType QuotaType { get; set; }
    public int TotalSeats { get; set; }
    public int FilledSeats { get; set; } = 0;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public AdmissionCycle Cycle { get; set; } = null!;
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
