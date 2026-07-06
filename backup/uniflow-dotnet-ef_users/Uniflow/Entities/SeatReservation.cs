namespace Uniflow.Entities;

public class SeatReservation
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public DateTime ReservedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? ReleasedAt { get; set; }

    public Application Application { get; set; } = null!;
}
