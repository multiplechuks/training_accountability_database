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
