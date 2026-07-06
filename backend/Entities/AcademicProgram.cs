namespace Uniflow.Entities;

/// <summary>
/// Maps to the "programs" table. Named AcademicProgram (not "Program")
/// to avoid colliding with the implicit top-level Program class in .NET.
/// </summary>
public class AcademicProgram
{
    public Guid Id { get; set; }
    public Guid UniversityId { get; set; }
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public short DurationYears { get; set; } = 4;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public University University { get; set; } = null!;
    public ICollection<AdmissionCycle> AdmissionCycles { get; set; } = new List<AdmissionCycle>();
}
