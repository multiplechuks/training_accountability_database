using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class NextOfKin : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Firstname { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Lastname { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string IdNo { get; set; } = string.Empty;

    // Foreign Key
    public int ParticipantFK { get; set; }

    // Navigation property
    public virtual Participant Participant { get; set; } = null!;

    public string FullName => $"{Firstname} {Lastname}";
}

public class ParticipantTraining : BaseEntity
{
    // Foreign Keys
    public int ParticipantFK { get; set; }
    public int TrainingFK { get; set; }

    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string Status { get; set; } = string.Empty; // Active, Completed, Withdrawn, etc.

    public DateTime? CompletionDate { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Training Training { get; set; } = null!;
    public virtual ICollection<TrainingTransfer> TrainingTransfers { get; set; } = new List<TrainingTransfer>();
}

public class TrainingTransfer : BaseEntity
{
    // Foreign Keys
    public int ParticipantFK { get; set; }
    public int TrainingFK { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? TransferReason { get; set; }

    [MaxLength(50)]
    public string TransferStatus { get; set; } = string.Empty;

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Training Training { get; set; } = null!;
}

public class Bond : BaseEntity
{
    public DateTime BondStartDate { get; set; }

    public DateTime BondEndDate { get; set; }

    public int BondPeriodMonths { get; set; }

    [MaxLength(50)]
    public string BondStatus { get; set; } = string.Empty;

    public decimal BondAmount { get; set; }

    [MaxLength(1000)]
    public string? BondConditions { get; set; }

    public DateTime? CompletionDate { get; set; }

    // Foreign Key
    public int ParticipantEnrollmentFK { get; set; }

    // Navigation property
    public virtual ParticipantEnrollment ParticipantEnrollment { get; set; } = null!;
}

public class TrainingBudget : BaseEntity
{
    public decimal AllocatedAmount { get; set; }

    public decimal SpentAmount { get; set; }

    public decimal RemainingAmount => AllocatedAmount - SpentAmount;

    [MaxLength(20)]
    public string FinancialYear { get; set; } = string.Empty;

    [MaxLength(100)]
    public string BudgetCategory { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Foreign Key
    public int TrainingFK { get; set; }

    // Navigation property
    public virtual Training Training { get; set; } = null!;
}

public class TrainingReport : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string ReportTitle { get; set; } = string.Empty;

    [MaxLength(50)]
    public string ReportType { get; set; } = string.Empty;

    public DateTime ReportDate { get; set; }

    [MaxLength(2000)]
    public string ReportContent { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? FilePath { get; set; }

    [MaxLength(50)]
    public string ReportStatus { get; set; } = string.Empty;

    // Foreign Key
    public int TrainingFK { get; set; }

    // Navigation property
    public virtual Training Training { get; set; } = null!;
}
