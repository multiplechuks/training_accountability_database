namespace TrainingManagement.API.DTOs;

// ────────────────────────────────────────────────────────────
// Shared
// ────────────────────────────────────────────────────────────
public class PaginatedResponse<T>
{
    public IEnumerable<T> Data { get; init; }
    public int TotalCount { get; init; }
    public int Total => TotalCount;
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalCount / PageSize) : 0;
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;

    public PaginatedResponse(IEnumerable<T> data, int totalCount, int page, int pageSize)
    {
        Data = data;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }
}

public record LookupItemDto(int Pk, string Name, string? Description = null);

// ────────────────────────────────────────────────────────────
// Participant
// ────────────────────────────────────────────────────────────
public record CreateParticipantDto(
    int? TitleId,
    string Firstname,
    string? Middlename,
    string Lastname,
    string Sex,
    DateTime Dob,
    int? IdTypeId,
    string IdNumber,
    string Phone,
    string Email,
    string? Address,
    int? SalaryScaleId,
    int? DepartmentId,
    int? DutyStationId,
    string? PostalAddress
);

public record UpdateParticipantDto(
    int? TitleId,
    string? Firstname,
    string? Middlename,
    string? Lastname,
    string? Sex,
    DateTime? Dob,
    int? IdTypeId,
    string? IdNumber,
    string? Phone,
    string? Email,
    string? Address,
    int? SalaryScaleId,
    int? DepartmentId,
    int? DutyStationId,
    string? PostalAddress
);

public record ParticipantResponseDto(
    int Pk,
    string? Title,
    string Firstname,
    string? Middlename,
    string Lastname,
    string FullName,
    string Sex,
    DateTime Dob,
    string? IdType,
    string IdNumber,
    string Phone,
    string Email,
    string? Address,
    string? SalaryScale,
    string? Department,
    string? DutyStation,
    string? PostalAddress,
    NextOfKinResponseDto? NextOfKin,
    DateTime CreatedAt
);

// ────────────────────────────────────────────────────────────
// Next of Kin
// ────────────────────────────────────────────────────────────
public record UpsertNextOfKinDto(
    string FullName,
    int? RelationshipTypeId,
    string? Phone,
    string? Email,
    string? IdNumber
);

public record NextOfKinResponseDto(
    int Id,
    string FullName,
    int? RelationshipTypeId,
    string? RelationshipType,
    string? Phone,
    string? Email,
    string? IdNumber
);

// ────────────────────────────────────────────────────────────
// Nomination
// ────────────────────────────────────────────────────────────
public record CreateNominationDto(
    int ParticipantId,
    int? QualificationId,
    int? NominatedProgramId,
    int? SponsorTypeId,
    int YearOfNomination,
    decimal? EstimatedBudget,
    string Currency,
    string? ProfessionalBody,
    string? Notes
);

public record UpdateNominationDto(
    int? QualificationId,
    int? NominatedProgramId,
    int? SponsorTypeId,
    int? YearOfNomination,
    decimal? EstimatedBudget,
    string? Currency,
    string? ProfessionalBody,
    string? NominationStatus,
    string? StatusReason,
    DateTime? ApprovalDate,
    string? ApprovedBy,
    string? Notes
);

public record UpdateNominationStatusDto(
    string Status,
    string? StatusReason,
    string? ApprovedBy,
    DateTime? ApprovalDate
);

public record NominationResponseDto(
    int Pk,
    int ParticipantFK,
    string ParticipantName,
    int? QualificationFK,
    string? QualificationName,
    int? NominatedProgramFK,
    string? NominatedProgramName,
    int? NominatedProgramYear,
    int? SponsorTypeFK,
    string? SponsorTypeName,
    int YearOfNomination,
    decimal? EstimatedBudget,
    string Currency,
    string? ProfessionalBody,
    string NominationStatus,
    string? StatusReason,
    DateTime NominationDate,
    DateTime? ApprovalDate,
    string? ApprovedBy,
    string? Notes,
    bool HasAdmission,
    DateTime CreatedAt
);

// ────────────────────────────────────────────────────────────
// Admission
// ────────────────────────────────────────────────────────────
public record CreateAdmissionDto(
    int NominationId,
    DateTime AdmissionDate,
    int? AdmissionProgramId,
    int? ModeOfStudyId,
    DateTime? ReleaseStartDate,
    DateTime? ReleaseEndDate,
    string? Notes
);

public record UpdateAdmissionDto(
    DateTime? AdmissionDate,
    int? AdmissionProgramId,
    int? ModeOfStudyId,
    DateTime? ReleaseStartDate,
    DateTime? ReleaseEndDate,
    string? Notes
);

public record AdmissionResponseDto(
    int Pk,
    int NominationFK,
    string ParticipantName,
    DateTime AdmissionDate,
    int? AdmissionProgramFK,
    string? AdmissionProgramName,
    int? ModeOfStudyFK,
    string? ModeOfStudyName,
    DateTime? ReleaseStartDate,
    DateTime? ReleaseEndDate,
    string? ReleaseLetterPath,
    string? ReleaseLetterOriginalName,
    string? Notes,
    DateTime CreatedAt
);

// ────────────────────────────────────────────────────────────
// Allowance
// ────────────────────────────────────────────────────────────
public record CreateAllowanceDto(
    int ParticipantId,
    int? AdmissionId,
    int AllowanceTypeId,
    int StatusId,
    decimal Amount,
    string Frequency,
    DateTime StartDate,
    DateTime EndDate,
    DateTime? AllowanceStoppageDate,
    string? Comments
);

public record UpdateAllowanceDto(
    int? ParticipantId,
    int? AdmissionId,
    int? AllowanceTypeId,
    int? StatusId,
    decimal? Amount,
    string? Frequency,
    DateTime? StartDate,
    DateTime? EndDate,
    DateTime? AllowanceStoppageDate,
    string? Comments
);

public record AllowanceResponseDto(
    int Pk,
    int ParticipantFK,
    string ParticipantName,
    int? AdmissionFK,
    string AllowanceType,
    string AllowanceStatus,
    decimal Amount,
    string Frequency,
    DateTime StartDate,
    DateTime EndDate,
    DateTime? AllowanceStoppageDate,
    string? Comments,
    DateTime CreatedAt
);

public record CreateAllowanceTypeDto(string Name, string? Description, string? Frequency);
public record UpdateAllowanceTypeDto(string? Name, string? Description, string? Frequency);
public record AllowanceTypeResponseDto(int Pk, string Name, string? Description, string? Frequency);

public record CreateAllowanceStatusDto(string Name, string? Description);
public record UpdateAllowanceStatusDto(string? Name, string? Description);
public record AllowanceStatusResponseDto(int Id, string Name, string? Description);

// ────────────────────────────────────────────────────────────
// Lookup CRUD (shared shape for all configurable lookups)
// ────────────────────────────────────────────────────────────
public record CreateLookupDto(string Name, string? Description);
public record UpdateLookupDto(string? Name, string? Description, bool? IsActive);
public record CreateSalaryScaleDto(string Scale, string? Grade, string? Description);
public record UpdateSalaryScaleDto(string? Scale, string? Grade, string? Description, bool? IsActive);
public record CreateYearlyProgramDto(string Name, string? Description, int Year);
public record UpdateYearlyProgramDto(string? Name, string? Description, int? Year, bool? IsActive);
public record CreateQualificationDto(string Name, string? Level, string? Description);
public record UpdateQualificationDto(string? Name, string? Level, string? Description, bool? IsActive);
public record AdmissionProgramResponseDto(int Pk, string Name, string? Country, string? Institution, string? Description);
public record CreateAdmissionProgramDto(string Name, string? Country, string? Institution, string? Description);
public record UpdateAdmissionProgramDto(string? Name, string? Country, string? Institution, string? Description, bool? IsActive);
