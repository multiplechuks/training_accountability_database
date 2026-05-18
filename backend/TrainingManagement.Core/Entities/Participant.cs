using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Participant : BaseEntity
{
    // Personal Information
    public int? TitleFK { get; set; }

    [Required]
    [MaxLength(100)]
    public string Firstname { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Middlename { get; set; }

    [Required]
    [MaxLength(100)]
    public string Lastname { get; set; } = string.Empty;

    [Required]
    public string Sex { get; set; } = string.Empty; // Male | Female

    public DateTime Dob { get; set; }

    public int? IdTypeFK { get; set; }

    [Required]
    [MaxLength(50)]
    public string IdNumber { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Address { get; set; }

    // Employment Information
    public int? SalaryScaleFK { get; set; }

    public int? DepartmentFK { get; set; }

    public int? DutyStationFK { get; set; }

    [MaxLength(500)]
    public string? PostalAddress { get; set; }

    // Navigation properties
    public virtual Title? Title { get; set; }
    public virtual IdType? IdType { get; set; }
    public virtual SalaryScale? SalaryScale { get; set; }
    public virtual Department? Department { get; set; }
    public virtual DutyStation? DutyStation { get; set; }
    public virtual NextOfKin? NextOfKin { get; set; }
    public virtual ICollection<Nomination> Nominations { get; set; } = new List<Nomination>();
    public virtual ICollection<Allowance> Allowances { get; set; } = new List<Allowance>();

    public string FullName => $"{Firstname} {(Middlename != null ? Middlename + " " : "")}{Lastname}".Trim();
}
