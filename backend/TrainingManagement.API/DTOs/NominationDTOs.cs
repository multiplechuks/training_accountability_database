using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.API.DTOs;

/// <summary>
/// DTO for creating/updating a nomination (Form 2)
/// </summary>
public class NominationDto
{
    public int ParticipantFK { get; set; }

    [MaxLength(1000)]
    public string CurrentQualifications { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string NominatedProgram { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Specialty { get; set; }

    [Required]
    [MaxLength(50)]
    public string SponsorType { get; set; } = string.Empty;

    public int? SponsorFK { get; set; }

    public int YearOfNomination { get; set; }

    public decimal EstimatedBudget { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = "MWK";

    [MaxLength(200)]
    public string? ProfessionalBody { get; set; }

    [Required]
    [MaxLength(50)]
    public string NominationStatus { get; set; } = "Pending";

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
}

/// <summary>
/// DTO for nomination response with related entities
/// </summary>
public class NominationResponseDto : NominationDto
{
    public int PK { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;

    public ParticipantSummaryDto? Participant { get; set; }
    public LookupDto? Sponsor { get; set; }
}

/// <summary>
/// DTO for Form 2 specifically (wizard context)
/// </summary>
public class SaveNominationFormDto
{
    public int ProgressId { get; set; }
    public NominationDto Nomination { get; set; } = new();
}
