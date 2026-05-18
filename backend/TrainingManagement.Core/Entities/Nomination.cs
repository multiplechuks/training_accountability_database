using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Nomination : BaseEntity
{
    public int ParticipantFK { get; set; }

    // Qualification
    public int? QualificationFK { get; set; }

    // Nominated Program (configurable per year)
    public int? NominatedProgramFK { get; set; }

    // Sponsor
    public int? SponsorTypeFK { get; set; }

    public int YearOfNomination { get; set; }

    public decimal? EstimatedBudget { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = "MWK";

    [MaxLength(200)]
    public string? ProfessionalBody { get; set; }

    [MaxLength(50)]
    public string NominationStatus { get; set; } = "Pending"; // Pending, Approved, Rejected, Deferred

    [MaxLength(500)]
    public string? StatusReason { get; set; }

    public DateTime NominationDate { get; set; } = DateTime.UtcNow;

    public DateTime? ApprovalDate { get; set; }

    [MaxLength(100)]
    public string? ApprovedBy { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Qualification? Qualification { get; set; }
    public virtual NominatedProgram? NominatedProgram { get; set; }
    public virtual SponsorType? SponsorType { get; set; }
    public virtual Admission? Admission { get; set; }
}
