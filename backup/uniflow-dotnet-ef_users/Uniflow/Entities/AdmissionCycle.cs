namespace Uniflow.Entities;

public class AdmissionCycle
{
    public Guid Id { get; set; }
    public Guid ProgramId { get; set; }
    public string Title { get; set; } = null!;
    public DateTime OpensAt { get; set; }
    public DateTime ClosesAt { get; set; }
    public DateTime? MeritResultAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public AcademicProgram Program { get; set; } = null!;
    public ICollection<SeatQuota> SeatQuotas { get; set; } = new List<SeatQuota>();
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
