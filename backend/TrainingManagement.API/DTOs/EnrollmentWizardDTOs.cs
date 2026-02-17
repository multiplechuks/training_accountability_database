namespace TrainingManagement.API.DTOs;

/// <summary>
/// DTO for starting a new enrollment process
/// </summary>
public class StartEnrollmentDto
{
    public int? ParticipantId { get; set; }

    // Optional: Include participant data for new participants
    public Stage1ParticipantDto? ParticipantData { get; set; }
}

/// <summary>
/// DTO for updating progress and marking a step as complete
/// </summary>
public class UpdateProgressDto
{
    public int? ParticipantId { get; set; }
    public int? NominationId { get; set; }
    public int? EnrollmentId { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for saving progress without marking as complete
/// </summary>
public class SaveProgressDto
{
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for cancelling an enrollment
/// </summary>
public class CancelEnrollmentDto
{
    public string? Reason { get; set; }
}

/// <summary>
/// Summary DTO for displaying in-progress enrollments list
/// </summary>
public class EnrollmentProgressSummaryDto
{
    public int ProgressId { get; set; }
    public int? ParticipantId { get; set; } // Nullable - may not have participant yet
    public string ParticipantName { get; set; } = string.Empty;
    public int CurrentStep { get; set; }
    public DateTime LastUpdated { get; set; }
    public int PercentComplete { get; set; }
    public string Status { get; set; } = string.Empty;
}

