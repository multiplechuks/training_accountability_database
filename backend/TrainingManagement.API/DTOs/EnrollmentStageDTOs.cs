using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.API.DTOs;

/// <summary>
/// Stage 1: Participant Basic Information
/// </summary>
public class Stage1ParticipantDto
{
    [MaxLength(10)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Firstname { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Lastname { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Middlename { get; set; }

    [Required]
    [MaxLength(20)]
    public string IdNo { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Sex { get; set; } = string.Empty;

    [Required]
    public DateTime Dob { get; set; }

    [MaxLength(20)]
    public string IdType { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(15)]
    public string? WorkTelephone { get; set; }

    public int? DesignationFK { get; set; }

    [MaxLength(200)]
    public string? DepartmentOrFacility { get; set; }

    [MaxLength(200)]
    public string? DutyStation { get; set; }
}

/// <summary>
/// Stage 2: Next of Kin Information
/// </summary>
public class Stage2NextOfKinDto
{
    [Required]
    [MaxLength(100)]
    public string Firstname { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Lastname { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Relationship { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string IdNo { get; set; } = string.Empty;
}

/// <summary>
/// Stage 3: Training Nomination
/// </summary>
public class Stage3NominationDto
{
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
}

/// <summary>
/// Stage 4: Admission and Training Details
/// </summary>
public class Stage4AdmissionDto
{
    // Training Information
    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Program { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Specialty { get; set; }

    [Required]
    [MaxLength(100)]
    public string CountryOfStudy { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Duration { get; set; }

    [MaxLength(50)]
    public string ModeOfStudy { get; set; } = string.Empty;

    [MaxLength(50)]
    public string CampusType { get; set; } = string.Empty;

    // Enrollment Information
    public int? DesignationFK { get; set; }
    public int? SalaryScaleFK { get; set; }
    public int? DepartmentFK { get; set; }
    public int? FacilityFK { get; set; }

    public DateTime? PayrollDate { get; set; }
    public DateTime? StudyLeaveDate { get; set; }
    public DateTime? AllowanceStoppageDate { get; set; }

    public bool NeedingTravel { get; set; } = false;
    public DateTime? DepartureDate { get; set; }
    public DateTime? ArrivalDate { get; set; }

    public int? SponsorFK { get; set; }

    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string TrainingStatus { get; set; } = "Active";

    [MaxLength(20)]
    public string FinancialYear { get; set; } = string.Empty;
}

/// <summary>
/// Stage 5: Bonding Information
/// </summary>
public class Stage5BondDto
{
    public DateTime BondStartDate { get; set; }

    public DateTime BondEndDate { get; set; }

    public int BondPeriodMonths { get; set; }

    public bool BondSigned { get; set; } = false;

    public DateTime? DateSigned { get; set; }

    [MaxLength(50)]
    public string BondStatus { get; set; } = "Pending";

    public decimal BondAmount { get; set; }

    [MaxLength(1000)]
    public string? BondConditions { get; set; }

    public bool InductionCompleted { get; set; } = false;

    public DateTime? InductionDate { get; set; }
}

/// <summary>
/// Stage 6: Training Costs (Allowances)
/// </summary>
public class Stage6TrainingCostDto
{
    public List<AllowanceItemDto> Allowances { get; set; } = new();
}

public class AllowanceItemDto
{
    public int AllowanceTypeFK { get; set; }

    [Required]
    [MaxLength(100)]
    public string AllowanceTypeName { get; set; } = string.Empty; // For display/reference

    public decimal Amount { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [MaxLength(50)]
    public string Frequency { get; set; } = "Monthly";

    public DateTime? AllowanceStoppageDate { get; set; }

    [MaxLength(1000)]
    public string? Comments { get; set; }

    public int StatusFK { get; set; } = 1; // Default to Active/Pending
}

/// <summary>
/// Complete enrollment submission (all 6 stages)
/// </summary>
public class CompleteEnrollmentDto
{
    public Stage1ParticipantDto Stage1_Participant { get; set; } = new();
    public Stage2NextOfKinDto Stage2_NextOfKin { get; set; } = new();
    public Stage3NominationDto Stage3_Nomination { get; set; } = new();
    public Stage4AdmissionDto Stage4_Admission { get; set; } = new();
    public Stage5BondDto? Stage5_Bond { get; set; } // Optional
    public Stage6TrainingCostDto Stage6_TrainingCosts { get; set; } = new();
}
