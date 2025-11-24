using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.API.DTOs;

public class CreateParticipantDto
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
}

public class UpdateParticipantDto
{
    [MaxLength(10)]
    public string? Title { get; set; }

    [MaxLength(100)]
    public string? Firstname { get; set; }

    [MaxLength(100)]
    public string? Lastname { get; set; }

    [MaxLength(100)]
    public string? Middlename { get; set; }

    [MaxLength(10)]
    public string? Sex { get; set; }

    public DateTime? Dob { get; set; }

    [MaxLength(20)]
    public string? IdType { get; set; }

    [MaxLength(15)]
    public string? Phone { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }
}

public class ParticipantResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? Middlename { get; set; }
    public string IdNo { get; set; } = string.Empty;
    public string Sex { get; set; } = string.Empty;
    public DateTime Dob { get; set; }
    public string IdType { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ParticipantWithEnrollmentsDto : ParticipantResponseDto
{
    public List<EnrollmentSummaryDto> Enrollments { get; set; } = new();
}

public class EnrollmentSummaryDto
{
    public int Id { get; set; }
    public int TrainingId { get; set; }
    public string TrainingProgram { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string TrainingStatus { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
