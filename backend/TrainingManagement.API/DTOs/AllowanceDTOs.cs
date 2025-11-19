using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.API.DTOs;

// Allowance Type DTOs
public class CreateAllowanceTypeDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class UpdateAllowanceTypeDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class AllowanceTypeResponseDto
{
    public int PK { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
}

// Allowance Status DTOs
public class CreateAllowanceStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class UpdateAllowanceStatusDto
{
    [MaxLength(50)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class AllowanceStatusResponseDto
{
    public int PK { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
}

// Main Allowance DTOs (if not already existing)
public class CreateAllowanceDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [MaxLength(1000)]
    public string? Comments { get; set; }

    [Required]
    public int TrainingFK { get; set; }

    [Required]
    public int StatusFK { get; set; }

    [Required]
    public int ParticipantFK { get; set; }

    [Required]
    public int AllowanceTypeFK { get; set; }
}

public class UpdateAllowanceDto
{
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal? Amount { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [MaxLength(1000)]
    public string? Comments { get; set; }

    public int? TrainingFK { get; set; }

    public int? StatusFK { get; set; }

    public int? ParticipantFK { get; set; }

    public int? AllowanceTypeFK { get; set; }
}

public class AllowanceResponseDto
{
    public int PK { get; set; }
    public decimal Amount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Comments { get; set; }
    public int TrainingFK { get; set; }
    public int StatusFK { get; set; }
    public int ParticipantFK { get; set; }
    public int AllowanceTypeFK { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;

    // Navigation properties
    public ParticipantLookupDto? Participant { get; set; }
    public TrainingLookupDto? Training { get; set; }
    public AllowanceTypeLookupDto? AllowanceType { get; set; }
    public AllowanceStatusLookupDto? AllowanceStatus { get; set; }
}

// Lookup DTOs for navigation properties
public class ParticipantLookupDto
{
    public int PK { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Email { get; set; }
}

public class TrainingLookupDto
{
    public int PK { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Program { get; set; }
    public string? Venue { get; set; }
}

public class AllowanceTypeLookupDto
{
    public int PK { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class AllowanceStatusLookupDto
{
    public int PK { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

// Paginated response wrapper
public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}
