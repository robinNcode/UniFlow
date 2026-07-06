namespace Uniflow.Entities;

public class Student
{
    public Guid Id { get; set; }
    public string Phone { get; set; } = null!;
    public string? Email { get; set; }
    public string FullName { get; set; } = null!;
    public string? FatherName { get; set; }
    public string? MotherName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? NidOrBirthReg { get; set; }
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Application> Applications { get; set; } = new List<Application>();
    public ICollection<NotificationLog> NotificationLogs { get; set; } = new List<NotificationLog>();
}
