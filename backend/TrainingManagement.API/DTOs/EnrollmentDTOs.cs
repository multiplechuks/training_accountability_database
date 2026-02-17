using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.API.DTOs;

// Enrollment Form DTOs
public class ParticipantEnrollmentDto
{
    // Section 1 - Participant and Training Selection
    public int ParticipantFK { get; set; }
    public int TrainingFK { get; set; }

    // Section 2 - Employment Information
    public int? DesignationFK { get; set; }
    public int? SalaryScaleFK { get; set; }
    public int? DepartmentFK { get; set; }
    public int? FacilityFK { get; set; }

    public DateTime? PayrollDate { get; set; }
    public DateTime? StudyLeaveDate { get; set; }
    public DateTime? AllowanceStoppageDate { get; set; }

    // Section 3 - Study Information
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public int Duration { get; set; }

    public bool NeedingTravel { get; set; } = false;
    public DateTime? DepartureDate { get; set; }
    public DateTime? ArrivalDate { get; set; }

    // Section 4 - Bond Information
    public DateTime? DateBondSigned { get; set; }
    public string? BondServingPeriod { get; set; }

    // Section 5 - Others
    public int? SponsorFK { get; set; }
    public string ModeOfStudy { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public string TrainingStatus { get; set; } = string.Empty;
    public string FinancialYear { get; set; } = string.Empty;
    public string CampusType { get; set; } = string.Empty;
}

public class ParticipantEnrollmentResponseDto : ParticipantEnrollmentDto
{
    public int PK { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;

    // Related entities
    public ParticipantSummaryDto? Participant { get; set; }
    public TrainingSummaryDto? Training { get; set; }
    public LookupDto? Designation { get; set; }
    public LookupDto? SalaryScale { get; set; }
    public LookupDto? Department { get; set; }
    public LookupDto? Facility { get; set; }
    public LookupDto? Sponsor { get; set; }
}

// Supporting DTOs
public class LookupDto
{
    public int PK { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? Title { get; set; } // For Designation
    public string? Level { get; set; } // For Designation
    public string? Scale { get; set; } // For SalaryScale
    public string? Grade { get; set; } // For SalaryScale
    public decimal? MinSalary { get; set; } // For SalaryScale
    public decimal? MaxSalary { get; set; } // For SalaryScale
    public string? Type { get; set; } // For Sponsor
    public string? Location { get; set; } // For Facility
}

public class ParticipantSummaryDto
{
    public int PK { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? Middlename { get; set; }
    public string IdNo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}

public class TrainingSummaryDto
{
    public int PK { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string CountryOfStudy { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Duration { get; set; }
    public string FinancialYear { get; set; } = string.Empty;
}

// Search/Filter DTOs
public class ParticipantSearchDto
{
    public string? SearchTerm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class TrainingSearchDto
{
    public string? SearchTerm { get; set; }
    public string? Institution { get; set; }
    public string? CountryOfStudy { get; set; }
    public string? FinancialYear { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

// Nomination Wizard DTOs (7 Stages)
public class EnrollmentProgressDto
{
    public int PK { get; set; }
    public int? ParticipantFK { get; set; }
    public int CurrentStep { get; set; }
    public string EnrollmentStatus { get; set; } = "In Progress";

    // Stage completion tracking (using Form* naming for backward compatibility)
    public bool Form1_ParticipantProfile { get; set; }
    public bool Form2_Nomination { get; set; }
    public bool Form3_Admission { get; set; }
    public bool Form4_TrainingCosts { get; set; }
    public bool Form5_Extension { get; set; }
    public bool Form6_Completion { get; set; }

    // Stage data
    public string? Stage2_NextOfKinData { get; set; }
    public string? Stage3_NominationData { get; set; }
    public string? Stage4_AdmissionData { get; set; }
    public string? Stage5_BondingData { get; set; }
    public string? Stage6_TrainingCostsData { get; set; }

    public DateTime LastUpdated { get; set; }
    public DateTime? CompletedDate { get; set; }

    public ParticipantSummaryDto? Participant { get; set; }

    // Legacy properties for backward compatibility with existing controllers
    public int Id { get => PK; set => PK = value; }
    public int? ParticipantId { get => ParticipantFK; set => ParticipantFK = value; }
    public int? NominationId { get; set; }
    public int? EnrollmentId { get; set; }
    public string? Notes { get; set; }

    public bool Form1Complete { get => Form1_ParticipantProfile; set => Form1_ParticipantProfile = value; }
    public bool Form2Complete { get => Form2_Nomination; set => Form2_Nomination = value; }
    public bool Form3Complete { get => Form3_Admission; set => Form3_Admission = value; }
    public bool Form4Complete { get => Form4_TrainingCosts; set => Form4_TrainingCosts = value; }
    public bool Form5Complete { get => Form5_Extension; set => Form5_Extension = value; }
    public bool Form6Complete { get => Form6_Completion; set => Form6_Completion = value; }
}

public class UpdateEnrollmentStepDto
{
    public int? ParticipantId { get; set; }
    public string? Notes { get; set; }
}

public class SaveEnrollmentProgressDto
{
    public string? Notes { get; set; }
}
