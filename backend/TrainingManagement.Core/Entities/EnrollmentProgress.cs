using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

/// <summary>
/// Tracks the "Save and Continue" progress for multi-stage nomination enrollment
/// 7 Stages: Participant Profile, Next of Kin, Nomination, Admission, Bonding, Training Costs, Completion
/// </summary>
public class EnrollmentProgress : BaseEntity
{
    // Foreign Key - nullable to allow starting enrollment before participant is created
    public int? ParticipantFK { get; set; }

    // Progress Tracking (which stages are completed) - Using original naming for backward compatibility
    public bool Form1_ParticipantProfile { get; set; } = false; // Stage 1
    public bool Form2_Nomination { get; set; } = false;         // Stage 2: NextOfKin + Stage 3: Nomination
    public bool Form3_Admission { get; set; } = false;          // Stage 4: Admission
    public bool Form4_TrainingCosts { get; set; } = false;      // Stage 5: Bonding + Stage 6: Training Costs
    public bool Form5_Extension { get; set; } = false;          // Reserved for future use
    public bool Form6_Completion { get; set; } = false;         // Stage 7: Completion

    // Overall Status
    [MaxLength(50)]
    public string EnrollmentStatus { get; set; } = "In Progress"; // In Progress, Completed, Cancelled

    // Current Step (1-7)
    public int CurrentStep { get; set; } = 1;

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedDate { get; set; }

    // Foreign Key IDs for related entities (helps track what's been created)
    public int? NextOfKinFK { get; set; }
    public int? NominationFK { get; set; }
    public int? ParticipantEnrollmentFK { get; set; }
    public int? BondFK { get; set; }

    // Stage Data (stored as JSON for flexibility)
    [MaxLength(4000)]
    public string? Stage2_NextOfKinData { get; set; } // JSON: Next of Kin info

    [MaxLength(4000)]
    public string? Stage3_NominationData { get; set; } // JSON: Current qualifications array, nomination details

    [MaxLength(4000)]
    public string? Stage4_AdmissionData { get; set; } // JSON: Admission dates and program details

    [MaxLength(4000)]
    public string? Stage5_BondingData { get; set; } // JSON: Bond and travel information

    [MaxLength(4000)]
    public string? Stage6_TrainingCostsData { get; set; } // JSON: Training costs and allowances

    [MaxLength(1000)]
    public string? Notes { get; set; } // General notes / Stage 7 completion notes

    // Navigation properties
    public virtual Participant? Participant { get; set; }
    public virtual NextOfKin? NextOfKin { get; set; }
    public virtual Nomination? Nomination { get; set; }
    public virtual ParticipantEnrollment? ParticipantEnrollment { get; set; }
    public virtual Bond? Bond { get; set; }
}
