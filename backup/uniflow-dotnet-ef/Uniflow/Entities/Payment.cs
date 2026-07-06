using Uniflow.Enums;

namespace Uniflow.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public PaymentProvider Provider { get; set; }
    public string? ProviderTxnId { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.initiated;
    public DateTime InitiatedAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string? RawCallbackPayload { get; set; } // stored as JSON
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Application Application { get; set; } = null!;
}
