using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.API.DTOs;

public class CreateTrainingDto
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

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    [Range(1, 240)]
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

    public int? SponsorFK { get; set; }

    [Required]
    [MaxLength(50)]
    public string ModeOfStudy { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string TrainingStatus { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string FinancialYear { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string CampusType { get; set; } = string.Empty;
}

public class UpdateTrainingDto
{
    [MaxLength(200)]
    public string? Institution { get; set; }

    [MaxLength(200)]
    public string? Program { get; set; }

    [MaxLength(100)]
    public string? CountryOfStudy { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Range(1, 240)]
    public int? Duration { get; set; } // in months

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

    public int? SponsorFK { get; set; }

    [MaxLength(50)]
    public string? ModeOfStudy { get; set; }

    [MaxLength(50)]
    public string? TrainingStatus { get; set; }

    [MaxLength(20)]
    public string? FinancialYear { get; set; }

    [MaxLength(50)]
    public string? CampusType { get; set; }
}

public class TrainingResponseDto
{
    public int Id { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string CountryOfStudy { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Duration { get; set; }
    public DateTime? DepartureDate { get; set; }
    public DateTime? ArrivalDate { get; set; }
    public string? VacationEmploymentPeriod { get; set; }
    public DateTime? ResumptionDate { get; set; }
    public string? ExtensionPeriod { get; set; }
    public DateTime? DateBondSigned { get; set; }
    public string? BondServingPeriod { get; set; }
    public int? SponsorFK { get; set; }
    public string ModeOfStudy { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public string TrainingStatus { get; set; } = string.Empty;
    public string FinancialYear { get; set; } = string.Empty;
    public string CampusType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class TrainingWithParticipantsDto : TrainingResponseDto
{
    public List<TrainingParticipantSummaryDto> Participants { get; set; } = new();
}

public class TrainingParticipantSummaryDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string IdNo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
}
