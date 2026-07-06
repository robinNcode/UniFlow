namespace Uniflow.Entities;

public class AdmitCard
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public string PdfPath { get; set; } = null!;
    public string RollNumber { get; set; } = null!;
    public DateOnly? ExamDate { get; set; }
    public string? ExamCenter { get; set; }
    public DateTime GeneratedAt { get; set; }

    public Application Application { get; set; } = null!;
}
