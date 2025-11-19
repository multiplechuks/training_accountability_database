using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Training : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Program { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string CountryOfStudy { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Duration { get; set; } // in months

    public DateTime? DepartureDate { get; set; }

    public DateTime? ArrivalDate { get; set; }

    [MaxLength(100)]
    public string? VacationEmploymentPeriod { get; set; }

    public DateTime? ResumptionDate { get; set; }

    [MaxLength(100)]
    public string? ExtensionPeriod { get; set; }

    public DateTime? DateBondSigned { get; set; }

    [MaxLength(100)]
    public string? BondServingPeriod { get; set; }

    // Foreign Key for Sponsor
    public int? SponsorFK { get; set; }

    [MaxLength(50)]
    public string ModeOfStudy { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string TrainingStatus { get; set; } = string.Empty;

    [MaxLength(20)]
    public string FinancialYear { get; set; } = string.Empty;

    [MaxLength(50)]
    public string CampusType { get; set; } = string.Empty;

    // Navigation properties
    public virtual Sponsor? Sponsor { get; set; }
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
    public virtual ICollection<TrainingBudget> TrainingBudgets { get; set; } = new List<TrainingBudget>();
    public virtual ICollection<TrainingReport> TrainingReports { get; set; } = new List<TrainingReport>();
    public virtual ICollection<ParticipantTraining> ParticipantTrainings { get; set; } = new List<ParticipantTraining>();
    public virtual ICollection<TrainingTransfer> TrainingTransfers { get; set; } = new List<TrainingTransfer>();
    public virtual ICollection<Allowance> Allowances { get; set; } = new List<Allowance>();
}
