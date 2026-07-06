namespace Uniflow.Entities;

public class OutboxEvent
{
    public Guid Id { get; set; }
    public string EventType { get; set; } = null!;
    public Guid AggregateId { get; set; }
    public string Payload { get; set; } = null!; // stored as JSON
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
}
