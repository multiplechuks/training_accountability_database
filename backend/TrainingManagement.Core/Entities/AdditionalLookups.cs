using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Qualification : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Level { get; set; } // Certificate, Diploma, Degree, Masters, PhD

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Nomination> Nominations { get; set; } = new List<Nomination>();
}

public class NominatedProgram : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public int Year { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Nomination> Nominations { get; set; } = new List<Nomination>();
}

public class AdmissionProgram : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Country { get; set; }

    [MaxLength(200)]
    public string? Institution { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Admission> Admissions { get; set; } = new List<Admission>();
}

public class ModeOfStudy : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Admission> Admissions { get; set; } = new List<Admission>();
}
