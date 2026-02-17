using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

/// <summary>
/// Represents Form 2: Nomination & Training Details
/// </summary>
public class Nomination : BaseEntity
{
    // Foreign Keys
    public int ParticipantFK { get; set; }

    // Current Qualifications (stored as JSON or separate table)
    [MaxLength(1000)]
    public string CurrentQualifications { get; set; } = string.Empty; // Can be JSON array for multi-select

    // Nominated Program
    [Required]
    [MaxLength(200)]
    public string NominatedProgram { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Specialty { get; set; }

    // Sponsor Type
    [Required]
    [MaxLength(50)]
    public string SponsorType { get; set; } = string.Empty; // Government, Donor, Self-Funded

    public int? SponsorFK { get; set; } // Link to Sponsor lookup if applicable

    // Year of Nomination
    public int YearOfNomination { get; set; }

    // Budget
    public decimal EstimatedBudget { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = "MWK";

    // Professional Body
    [MaxLength(200)]
    public string? ProfessionalBody { get; set; }

    // Nomination Status
    [Required]
    [MaxLength(50)]
    public string NominationStatus { get; set; } = string.Empty; // Accepted, Deferred, Rejected, Pending

    [MaxLength(500)]
    public string? StatusReason { get; set; }

    public DateTime NominationDate { get; set; } = DateTime.UtcNow;

    public DateTime? ApprovalDate { get; set; }

    [MaxLength(100)]
    public string? ApprovedBy { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Next of Kin Information
    [MaxLength(100)]
    public string? NextOfKinName { get; set; }

    [MaxLength(100)]
    public string? NextOfKinRelationship { get; set; }

    [MaxLength(20)]
    public string? NextOfKinPhone { get; set; }

    [MaxLength(100)]
    public string? NextOfKinEmail { get; set; }

    [MaxLength(500)]
    public string? NextOfKinAddress { get; set; }

    [MaxLength(100)]
    public string? NextOfKinOccupation { get; set; }

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Sponsor? Sponsor { get; set; }
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
}
