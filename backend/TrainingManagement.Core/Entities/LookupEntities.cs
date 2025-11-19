using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Department : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
}

public class Facility : BaseEntity
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
}

public class Designation : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Level { get; set; } = string.Empty; // Junior, Senior, Principal, etc.

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
}

public class SalaryScale : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string Scale { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Grade { get; set; } = string.Empty;

    public decimal MinSalary { get; set; }

    public decimal MaxSalary { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
}

public class Sponsor : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Type { get; set; } = string.Empty; // Government, Private, International, etc.

    [MaxLength(100)]
    public string ContactPerson { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<Training> Trainings { get; set; } = new List<Training>();
}
