using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

/// <summary>
/// Represents Form 5: Extension Report
/// </summary>
public class TrainingExtension : BaseEntity
{
    // Foreign Key
    public int ParticipantEnrollmentFK { get; set; }

    // Extension Dates
    public DateTime ExtensionStartDate { get; set; }

    public DateTime ExtensionEndDate { get; set; }

    public int ExtensionDurationMonths { get; set; }

    // Reason for Extension
    [Required]
    [MaxLength(100)]
    public string ExtensionReasonCategory { get; set; } = string.Empty; // Dropdown value

    [MaxLength(2000)]
    public string ExtensionReasonDetails { get; set; } = string.Empty; // Textbox for detailed explanation

    // Financial Impact
    public decimal EstimatedExtensionCost { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = "MWK";

    // Updated Bond Period
    public int UpdatedBondPeriodMonths { get; set; }

    public DateTime? UpdatedBondEndDate { get; set; }

    // Approval
    [MaxLength(50)]
    public string ApprovalStatus { get; set; } = string.Empty; // Pending, Approved, Rejected

    public DateTime? ApprovalDate { get; set; }

    [MaxLength(100)]
    public string? ApprovedBy { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Navigation property
    public virtual ParticipantEnrollment ParticipantEnrollment { get; set; } = null!;
}
