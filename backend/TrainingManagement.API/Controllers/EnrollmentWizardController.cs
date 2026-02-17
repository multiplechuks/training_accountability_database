using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

/// <summary>
/// Enrollment Wizard Controller
/// Manages the 6-form enrollment workflow with "save and continue" functionality
/// </summary>
[Route("api/enrollment-wizard")]
[ApiController]
[Authorize]
public class EnrollmentWizardController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<EnrollmentWizardController> _logger;

    public EnrollmentWizardController(
        IUnitOfWork unitOfWork,
        ILogger<EnrollmentWizardController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Start a new enrollment process
    /// Creates an EnrollmentProgress record and optionally creates the participant
    /// </summary>
    [HttpPost("start")]
    public async Task<IActionResult> StartEnrollment([FromBody] StartEnrollmentDto? dto = null)
    {
        try
        {
            int? participantId = dto?.ParticipantId;

            // Check if there's an existing in-progress enrollment for this participant
            if (participantId.HasValue && participantId.Value > 0)
            {
                var allProgress = await _unitOfWork.EnrollmentProgress.GetAllAsync();
                var existingProgress = allProgress
                    .FirstOrDefault(p => p.ParticipantFK == participantId.Value
                                      && p.EnrollmentStatus == "In Progress");

                if (existingProgress != null)
                {
                    return Ok(new
                    {
                        progressId = existingProgress.PK,
                        participantId = existingProgress.ParticipantFK,
                        message = "Existing enrollment in progress",
                        currentStep = existingProgress.CurrentStep,
                        alreadyExists = true
                    });
                }
            }

            // If participant data is provided, create the participant
            if (dto?.ParticipantData != null && !participantId.HasValue)
            {
                var participantDto = dto.ParticipantData;

                // Check if participant with this ID number already exists
                var allParticipants = await _unitOfWork.Participants.GetAllAsync();
                var existingParticipant = allParticipants.FirstOrDefault(p => p.IdNo == participantDto.IdNo);

                if (existingParticipant != null)
                {
                    participantId = existingParticipant.PK;
                }
                else
                {
                    // Create new participant
                    var participant = new Participant
                    {
                        Title = participantDto.Title,
                        Firstname = participantDto.Firstname,
                        Lastname = participantDto.Lastname,
                        Middlename = participantDto.Middlename,
                        IdNo = participantDto.IdNo,
                        Sex = participantDto.Sex,
                        Dob = participantDto.Dob,
                        IdType = participantDto.IdType,
                        Phone = participantDto.Phone,
                        Email = participantDto.Email,
                        WorkTelephone = participantDto.WorkTelephone,
                        DesignationFK = participantDto.DesignationFK,
                        DepartmentOrFacility = participantDto.DepartmentOrFacility,
                        DutyStation = participantDto.DutyStation,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = User.Identity?.Name ?? "System",
                        UpdatedAt = DateTime.UtcNow,
                        UpdatedBy = User.Identity?.Name ?? "System"
                    };

                    await _unitOfWork.Participants.AddAsync(participant);
                    await _unitOfWork.SaveChangesAsync();
                    participantId = participant.PK;
                }
            }

            var progress = new EnrollmentProgress
            {
                ParticipantFK = participantId, // Can be null if no participant yet
                CurrentStep = participantId.HasValue && participantId.Value > 0 ? 2 : 1,
                EnrollmentStatus = "In Progress",
                Form1_ParticipantProfile = participantId.HasValue && participantId.Value > 0,
                Form2_Nomination = false,
                Form3_Admission = false,
                Form4_TrainingCosts = false,
                Form5_Extension = false,
                Form6_Completion = false,
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = User.Identity?.Name ?? "System"
            };

            await _unitOfWork.EnrollmentProgress.AddAsync(progress);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                progressId = progress.PK,
                participantId = participantId,
                message = participantId.HasValue && participantId.Value > 0
                    ? "Enrollment process started with existing participant"
                    : "Enrollment process started",
                currentStep = progress.CurrentStep,
                nextAction = participantId.HasValue && participantId.Value > 0
                    ? "Complete Stage 2: Next of Kin"
                    : "Complete Stage 1: Participant Profile"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting enrollment");
            return StatusCode(500, new { message = "An error occurred while starting enrollment" });
        }
    }

    /// <summary>
    /// Get enrollment progress for a participant
    /// </summary>
    [HttpGet("progress/{participantId}")]
    public async Task<IActionResult> GetEnrollmentProgress(int participantId)
    {
        try
        {
            var allProgress = await _unitOfWork.EnrollmentProgress.GetAllAsync();
            var progressRecords = allProgress
                .Where(p => p.ParticipantFK == participantId)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();

            var latestProgress = progressRecords.FirstOrDefault();

            if (latestProgress == null)
            {
                return NotFound(new { message = "No enrollment progress found for this participant" });
            }

            // Fetch participant data if available
            ParticipantSummaryDto? participantDto = null;
            if (latestProgress.ParticipantFK.HasValue && latestProgress.ParticipantFK.Value > 0)
            {
                var participant = await _unitOfWork.Participants.GetByIdAsync(latestProgress.ParticipantFK.Value);
                if (participant != null)
                {
                    participantDto = new ParticipantSummaryDto
                    {
                        PK = participant.PK,
                        Title = participant.Title ?? string.Empty,
                        Firstname = participant.Firstname ?? string.Empty,
                        Lastname = participant.Lastname ?? string.Empty,
                        Middlename = participant.Middlename,
                        IdNo = participant.IdNo ?? string.Empty,
                        Email = participant.Email ?? string.Empty,
                        Phone = participant.Phone ?? string.Empty,
                        FullName = participant.FullName ?? string.Empty
                    };
                }
            }

            var response = new EnrollmentProgressDto
            {
                Id = latestProgress.PK,
                ParticipantId = latestProgress.ParticipantFK,
                CurrentStep = latestProgress.CurrentStep,
                EnrollmentStatus = latestProgress.EnrollmentStatus,
                Form1Complete = latestProgress.Form1_ParticipantProfile,
                Form2Complete = latestProgress.Form2_Nomination,
                Form3Complete = latestProgress.Form3_Admission,
                Form4Complete = latestProgress.Form4_TrainingCosts,
                Form5Complete = latestProgress.Form5_Extension,
                Form6Complete = latestProgress.Form6_Completion,
                LastUpdated = latestProgress.LastUpdated,
                CompletedDate = latestProgress.CompletedDate,
                NominationId = latestProgress.NominationFK,
                EnrollmentId = latestProgress.ParticipantEnrollmentFK,
                Notes = latestProgress.Notes,
                Stage2_NextOfKinData = latestProgress.Stage2_NextOfKinData,
                Stage3_NominationData = latestProgress.Stage3_NominationData,
                Stage4_AdmissionData = latestProgress.Stage4_AdmissionData,
                Stage5_BondingData = latestProgress.Stage5_BondingData,
                Stage6_TrainingCostsData = latestProgress.Stage6_TrainingCostsData,
                Participant = participantDto
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollment progress for participant {ParticipantId}", participantId);
            return StatusCode(500, new { message = "An error occurred while retrieving enrollment progress" });
        }
    }

    /// <summary>
    /// Get enrollment progress by progress ID
    /// </summary>
    [HttpGet("progress/id/{progressId}")]
    public async Task<IActionResult> GetEnrollmentProgressById(int progressId)
    {
        try
        {
            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            // Fetch participant data if available
            ParticipantSummaryDto? participantDto = null;
            if (progress.ParticipantFK.HasValue && progress.ParticipantFK.Value > 0)
            {
                var participant = await _unitOfWork.Participants.GetByIdAsync(progress.ParticipantFK.Value);
                if (participant != null)
                {
                    participantDto = new ParticipantSummaryDto
                    {
                        PK = participant.PK,
                        Title = participant.Title ?? string.Empty,
                        Firstname = participant.Firstname ?? string.Empty,
                        Lastname = participant.Lastname ?? string.Empty,
                        Middlename = participant.Middlename,
                        IdNo = participant.IdNo ?? string.Empty,
                        Email = participant.Email ?? string.Empty,
                        Phone = participant.Phone ?? string.Empty,
                        FullName = participant.FullName ?? string.Empty
                    };
                }
            }

            var response = new EnrollmentProgressDto
            {
                Id = progress.PK,
                ParticipantId = progress.ParticipantFK,
                CurrentStep = progress.CurrentStep,
                EnrollmentStatus = progress.EnrollmentStatus,
                Form1Complete = progress.Form1_ParticipantProfile,
                Form2Complete = progress.Form2_Nomination,
                Form3Complete = progress.Form3_Admission,
                Form4Complete = progress.Form4_TrainingCosts,
                Form5Complete = progress.Form5_Extension,
                Form6Complete = progress.Form6_Completion,
                LastUpdated = progress.LastUpdated,
                CompletedDate = progress.CompletedDate,
                NominationId = progress.NominationFK,
                EnrollmentId = progress.ParticipantEnrollmentFK,
                Notes = progress.Notes,
                Stage2_NextOfKinData = progress.Stage2_NextOfKinData,
                Stage3_NominationData = progress.Stage3_NominationData,
                Stage4_AdmissionData = progress.Stage4_AdmissionData,
                Stage5_BondingData = progress.Stage5_BondingData,
                Stage6_TrainingCostsData = progress.Stage6_TrainingCostsData,
                Participant = participantDto
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollment progress {ProgressId}", progressId);
            return StatusCode(500, new { message = "An error occurred while retrieving enrollment progress" });
        }
    }

    /// <summary>
    /// Update enrollment progress (mark a form as complete and move to next step)
    /// </summary>
    [HttpPut("progress/{progressId}/step/{step}")]
    public async Task<IActionResult> UpdateProgress(int progressId, int step, [FromBody] UpdateProgressDto dto)
    {
        try
        {
            _logger.LogInformation($"UpdateProgress called - ProgressId: {progressId}, Step: {step}, Notes length: {dto.Notes?.Length ?? 0}");

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            // Mark the completed step
            switch (step)
            {
                case 1:
                    progress.Form1_ParticipantProfile = true;
                    if (dto.ParticipantId.HasValue)
                    {
                        progress.ParticipantFK = dto.ParticipantId.Value;
                    }
                    break;
                case 2:
                    progress.Form2_Nomination = true; // Stage 2: Next of Kin
                    if (dto.Notes != null)
                    {
                        progress.Stage2_NextOfKinData = dto.Notes;
                    }
                    break;
                case 3:
                    progress.Form3_Admission = true; // Stage 3: Nomination
                    if (dto.Notes != null)
                    {
                        progress.Stage3_NominationData = dto.Notes;
                    }
                    break;
                case 4:
                    progress.Form4_TrainingCosts = true; // Stage 4: Admission
                    if (dto.Notes != null)
                    {
                        progress.Stage4_AdmissionData = dto.Notes;
                    }
                    break;
                case 5:
                    progress.Form5_Extension = true; // Stage 5: Bonding
                    if (dto.Notes != null)
                    {
                        progress.Stage5_BondingData = dto.Notes;
                    }
                    break;
                case 6:
                    progress.Form6_Completion = true; // Stage 6: Training Costs
                    if (dto.Notes != null)
                    {
                        progress.Stage6_TrainingCostsData = dto.Notes;
                    }
                    break;
                case 7:
                    // All forms should already be marked complete at this point
                    // Just mark as completed status
                    progress.EnrollmentStatus = "Completed";
                    progress.CompletedDate = DateTime.UtcNow;
                    if (dto.Notes != null)
                    {
                        progress.Notes = dto.Notes;
                    }

                    // Transfer all data from JSON to actual tables
                    await TransferDataToMainTables(progress);
                    break;
                default:
                    return BadRequest(new { message = "Invalid step number. Must be between 1 and 7" });
            }

            // Move to next step if not completed
            if (step < 7)
            {
                progress.CurrentStep = step + 1;
            }

            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                message = $"Form {step} marked as complete",
                currentStep = progress.CurrentStep,
                completed = progress.EnrollmentStatus == "Completed",
                nextStep = step < 7 ? step + 1 : (int?)null,
                nextAction = GetNextActionMessage(step)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating enrollment progress");
            return StatusCode(500, new { message = "An error occurred while updating progress" });
        }
    }

    /// <summary>
    /// Save progress on current step without marking as complete
    /// </summary>
    [HttpPut("progress/{progressId}/save")]
    public async Task<IActionResult> SaveProgress(int progressId, [FromBody] SaveProgressDto dto)
    {
        try
        {
            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            if (dto.Notes != null)
            {
                progress.Notes = dto.Notes;
            }

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                message = "Progress saved successfully",
                currentStep = progress.CurrentStep
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving progress");
            return StatusCode(500, new { message = "An error occurred while saving progress" });
        }
    }

    /// <summary>
    /// Save Form 2 (Nomination) data
    /// </summary>
    [HttpPost("progress/{progressId}/form2/save")]
    public async Task<IActionResult> SaveNominationForm(int progressId, [FromBody] NominationDto dto)
    {
        try
        {
            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            Nomination nomination;

            // Check if nomination already exists
            if (progress.NominationFK.HasValue)
            {
                var existingNomination = await _unitOfWork.Nominations.GetByIdAsync(progress.NominationFK.Value);
                if (existingNomination == null)
                {
                    return NotFound(new { message = "Nomination record not found" });
                }

                nomination = existingNomination;

                // Update existing nomination
                nomination.CurrentQualifications = dto.CurrentQualifications;
                nomination.NominatedProgram = dto.NominatedProgram;
                nomination.Specialty = dto.Specialty;
                nomination.SponsorType = dto.SponsorType;
                nomination.SponsorFK = dto.SponsorFK;
                nomination.YearOfNomination = dto.YearOfNomination;
                nomination.EstimatedBudget = dto.EstimatedBudget;
                nomination.Currency = dto.Currency;
                nomination.ProfessionalBody = dto.ProfessionalBody;
                nomination.NominationStatus = dto.NominationStatus;
                nomination.StatusReason = dto.StatusReason;
                nomination.NominationDate = dto.NominationDate;
                nomination.ApprovalDate = dto.ApprovalDate;
                nomination.ApprovedBy = dto.ApprovedBy;
                nomination.Notes = dto.Notes;
                nomination.NextOfKinName = dto.NextOfKinName;
                nomination.NextOfKinRelationship = dto.NextOfKinRelationship;
                nomination.NextOfKinPhone = dto.NextOfKinPhone;
                nomination.NextOfKinEmail = dto.NextOfKinEmail;
                nomination.NextOfKinAddress = dto.NextOfKinAddress;
                nomination.NextOfKinOccupation = dto.NextOfKinOccupation;
                nomination.UpdatedAt = DateTime.UtcNow;
                nomination.UpdatedBy = User.Identity?.Name ?? "System";

                await _unitOfWork.Nominations.UpdateAsync(nomination);
            }
            else
            {
                // Create new nomination
                nomination = new Nomination
                {
                    ParticipantFK = progress.ParticipantFK ?? 0, // Should not happen as we validate above
                    CurrentQualifications = dto.CurrentQualifications,
                    NominatedProgram = dto.NominatedProgram,
                    Specialty = dto.Specialty,
                    SponsorType = dto.SponsorType,
                    SponsorFK = dto.SponsorFK,
                    YearOfNomination = dto.YearOfNomination,
                    EstimatedBudget = dto.EstimatedBudget,
                    Currency = dto.Currency,
                    ProfessionalBody = dto.ProfessionalBody,
                    NominationStatus = dto.NominationStatus,
                    StatusReason = dto.StatusReason,
                    NominationDate = dto.NominationDate,
                    ApprovalDate = dto.ApprovalDate,
                    ApprovedBy = dto.ApprovedBy,
                    Notes = dto.Notes,
                    NextOfKinName = dto.NextOfKinName,
                    NextOfKinRelationship = dto.NextOfKinRelationship,
                    NextOfKinPhone = dto.NextOfKinPhone,
                    NextOfKinEmail = dto.NextOfKinEmail,
                    NextOfKinAddress = dto.NextOfKinAddress,
                    NextOfKinOccupation = dto.NextOfKinOccupation,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = User.Identity?.Name ?? "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = User.Identity?.Name ?? "System"
                };

                await _unitOfWork.Nominations.AddAsync(nomination);
                await _unitOfWork.SaveChangesAsync();

                // Link nomination to progress
                progress.NominationFK = nomination.PK;
                await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            }

            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                message = "Nomination data saved successfully",
                nominationId = nomination.PK
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving nomination form");
            return StatusCode(500, new { message = "An error occurred while saving nomination data" });
        }
    }

    /// <summary>
    /// Get Form 2 (Nomination) data
    /// </summary>
    [HttpGet("progress/{progressId}/form2")]
    public async Task<IActionResult> GetNominationForm(int progressId)
    {
        try
        {
            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            if (!progress.NominationFK.HasValue)
            {
                return Ok(new { message = "No nomination data found for this progress", data = (object?)null });
            }

            var nomination = await _unitOfWork.Nominations.GetByIdAsync(progress.NominationFK.Value);

            if (nomination == null)
            {
                return NotFound(new { message = "Nomination record not found" });
            }

            var response = new NominationResponseDto
            {
                PK = nomination.PK,
                ParticipantFK = nomination.ParticipantFK,
                CurrentQualifications = nomination.CurrentQualifications,
                NominatedProgram = nomination.NominatedProgram,
                Specialty = nomination.Specialty,
                SponsorType = nomination.SponsorType,
                SponsorFK = nomination.SponsorFK,
                YearOfNomination = nomination.YearOfNomination,
                EstimatedBudget = nomination.EstimatedBudget,
                Currency = nomination.Currency,
                ProfessionalBody = nomination.ProfessionalBody,
                NominationStatus = nomination.NominationStatus,
                StatusReason = nomination.StatusReason,
                NominationDate = nomination.NominationDate,
                ApprovalDate = nomination.ApprovalDate,
                ApprovedBy = nomination.ApprovedBy,
                Notes = nomination.Notes,
                NextOfKinName = nomination.NextOfKinName,
                NextOfKinRelationship = nomination.NextOfKinRelationship,
                NextOfKinPhone = nomination.NextOfKinPhone,
                NextOfKinEmail = nomination.NextOfKinEmail,
                NextOfKinAddress = nomination.NextOfKinAddress,
                NextOfKinOccupation = nomination.NextOfKinOccupation,
                CreatedAt = nomination.CreatedAt,
                CreatedBy = nomination.CreatedBy ?? string.Empty,
                UpdatedAt = nomination.UpdatedAt,
                UpdatedBy = nomination.UpdatedBy ?? string.Empty
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving nomination form");
            return StatusCode(500, new { message = "An error occurred while retrieving nomination data" });
        }
    }

    /// <summary>
    /// Cancel an enrollment process
    /// </summary>
    [HttpPut("progress/{progressId}/cancel")]
    public async Task<IActionResult> CancelEnrollment(int progressId, [FromBody] CancelEnrollmentDto? dto = null)
    {
        try
        {
            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            progress.EnrollmentStatus = "Cancelled";
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            if (dto?.Reason != null)
            {
                progress.Notes = $"Cancelled: {dto.Reason}";
            }

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                message = "Enrollment cancelled successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling enrollment");
            return StatusCode(500, new { message = "An error occurred while cancelling enrollment" });
        }
    }

    /// <summary>
    /// Resume an enrollment from a specific step
    /// </summary>
    [HttpPut("progress/{progressId}/resume/{step}")]
    public async Task<IActionResult> ResumeEnrollment(int progressId, int step)
    {
        try
        {
            if (step < 1 || step > 7)
            {
                return BadRequest(new { message = "Invalid step number. Must be between 1 and 7" });
            }

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);

            if (progress == null)
            {
                return NotFound(new { message = "Enrollment progress not found" });
            }

            progress.CurrentStep = step;
            progress.EnrollmentStatus = "In Progress";
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                message = $"Enrollment resumed at step {step}",
                currentStep = progress.CurrentStep
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resuming enrollment");
            return StatusCode(500, new { message = "An error occurred while resuming enrollment" });
        }
    }

    /// <summary>
    /// Get summary of all in-progress enrollments
    /// </summary>
    [HttpGet("in-progress")]
    public async Task<IActionResult> GetInProgressEnrollments([FromQuery] string? status = null)
    {
        try
        {
            var allProgress = await _unitOfWork.EnrollmentProgress.GetAllAsync();
            var progressList = allProgress.ToList();

            // Filter by status
            if (!string.IsNullOrEmpty(status) && status != "All")
            {
                progressList = progressList.Where(p => p.EnrollmentStatus == status).ToList();
            }
            else if (string.IsNullOrEmpty(status))
            {
                progressList = progressList.Where(p => p.EnrollmentStatus == "In Progress").ToList();
            }
            // If status is "All", don't filter - return all enrollments

            // Load participants for each progress
            var inProgressEnrollments = new List<EnrollmentProgressSummaryDto>();
            foreach (var p in progressList.OrderByDescending(p => p.LastUpdated))
            {
                var participant = p.ParticipantFK.HasValue && p.ParticipantFK.Value > 0
                    ? await _unitOfWork.Participants.GetByIdAsync(p.ParticipantFK.Value)
                    : null;

                inProgressEnrollments.Add(new EnrollmentProgressSummaryDto
                {
                    ProgressId = p.PK,
                    ParticipantId = p.ParticipantFK,
                    ParticipantName = participant?.FullName ?? "Unknown",
                    CurrentStep = p.CurrentStep,
                    LastUpdated = p.LastUpdated,
                    PercentComplete = CalculatePercentComplete(p),
                    Status = p.EnrollmentStatus
                });
            }

            return Ok(new
            {
                total = inProgressEnrollments.Count,
                enrollments = inProgressEnrollments
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving in-progress enrollments");
            return StatusCode(500, new { message = "An error occurred while retrieving enrollments" });
        }
    }

    /// <summary>
    /// Get enrollment statistics
    /// </summary>
    [HttpGet("statistics")]
    public async Task<IActionResult> GetEnrollmentStatistics()
    {
        try
        {
            var allProgressEnum = await _unitOfWork.EnrollmentProgress.GetAllAsync();
            var allProgress = allProgressEnum.ToList();

            var stats = new
            {
                total = allProgress.Count,
                inProgress = allProgress.Count(p => p.EnrollmentStatus == "In Progress"),
                completed = allProgress.Count(p => p.EnrollmentStatus == "Completed"),
                cancelled = allProgress.Count(p => p.EnrollmentStatus == "Cancelled"),
                byStep = new
                {
                    step1 = allProgress.Count(p => p.CurrentStep == 1 && p.EnrollmentStatus == "In Progress"),
                    step2 = allProgress.Count(p => p.CurrentStep == 2 && p.EnrollmentStatus == "In Progress"),
                    step3 = allProgress.Count(p => p.CurrentStep == 3 && p.EnrollmentStatus == "In Progress"),
                    step4 = allProgress.Count(p => p.CurrentStep == 4 && p.EnrollmentStatus == "In Progress"),
                    step5 = allProgress.Count(p => p.CurrentStep == 5 && p.EnrollmentStatus == "In Progress"),
                    step6 = allProgress.Count(p => p.CurrentStep == 6 && p.EnrollmentStatus == "In Progress")
                },
                recentCompletions = allProgress
                    .Where(p => p.EnrollmentStatus == "Completed" && p.CompletedDate.HasValue)
                    .OrderByDescending(p => p.CompletedDate)
                    .Take(5)
                    .Select(p => new
                    {
                        participantId = p.ParticipantFK,
                        completedDate = p.CompletedDate
                    })
                    .ToList()
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollment statistics");
            return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
        }
    }

    private static int CalculatePercentComplete(EnrollmentProgress progress)
    {
        int completed = 0;
        if (progress.Form1_ParticipantProfile)
        {
            completed++;
        }
        if (progress.Form2_Nomination)
        {
            completed++;
        }
        if (progress.Form3_Admission)
        {
            completed++;
        }
        if (progress.Form4_TrainingCosts)
        {
            completed++;
        }
        if (progress.Form5_Extension)
        {
            completed++;
        }
        if (progress.Form6_Completion)
        {
            completed++;
        }

        return (int)((completed / 7.0) * 100);
    }

    private static string GetNextActionMessage(int currentStep)
    {
        return currentStep switch
        {
            1 => "Complete Stage 2: Next of Kin",
            2 => "Complete Stage 3: Nomination",
            3 => "Complete Stage 4: Admission",
            4 => "Complete Stage 5: Bonding",
            5 => "Complete Stage 6: Training Costs",
            6 => "Complete Stage 7: Completion",
            7 => "Enrollment Complete",
            _ => "Unknown step"
        };
    }

    /// <summary>
    /// Helper method to safely parse boolean from JsonElement (handles both boolean and string types)
    /// </summary>
    private static bool GetBooleanValue(System.Text.Json.JsonElement element)
    {
        if (element.ValueKind == System.Text.Json.JsonValueKind.True)
        {
            return true;
        }
        if (element.ValueKind == System.Text.Json.JsonValueKind.False)
        {
            return false;
        }
        if (element.ValueKind == System.Text.Json.JsonValueKind.String)
        {
            var stringValue = element.GetString()?.ToLowerInvariant();
            return stringValue == "true" || stringValue == "1" || stringValue == "yes";
        }
        return false;
    }

    /// <summary>
    /// Helper method to safely parse int from JsonElement (handles both number and string types)
    /// </summary>
    private static int GetIntValue(System.Text.Json.JsonElement element, int defaultValue = 0)
    {
        if (element.ValueKind == System.Text.Json.JsonValueKind.Number)
        {
            return element.GetInt32();
        }
        if (element.ValueKind == System.Text.Json.JsonValueKind.String)
        {
            var stringValue = element.GetString();
            if (int.TryParse(stringValue, out int result))
            {
                return result;
            }
        }
        return defaultValue;
    }

    /// <summary>
    /// Helper method to safely parse decimal from JsonElement (handles both number and string types)
    /// </summary>
    private static decimal GetDecimalValue(System.Text.Json.JsonElement element, decimal defaultValue = 0)
    {
        if (element.ValueKind == System.Text.Json.JsonValueKind.Number)
        {
            return element.GetDecimal();
        }
        if (element.ValueKind == System.Text.Json.JsonValueKind.String)
        {
            var stringValue = element.GetString();
            if (decimal.TryParse(stringValue, out decimal result))
            {
                return result;
            }
        }
        return defaultValue;
    }

    /// <summary>
    /// Transfer data from EnrollmentProgress JSON fields to actual database tables
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Maintainability", "CA1502:Avoid excessive complexity", Justification = "Complex data transfer logic required for multiple stages")]
    private async Task TransferDataToMainTables(EnrollmentProgress progress)
    {
        try
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "System";
            _logger.LogInformation($"Starting data transfer for ProgressId: {progress.PK} by user ID: {currentUserId}");

            // Stage 2: Create Next of Kin (if not already exists)
            if (!string.IsNullOrEmpty(progress.Stage2_NextOfKinData) && !progress.NextOfKinFK.HasValue)
            {
                var nextOfKinData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(progress.Stage2_NextOfKinData);
                if (nextOfKinData != null && progress.ParticipantFK.HasValue)
                {
                    var fullName = nextOfKinData.GetValueOrDefault("nextOfKinName", "");
                    var nameParts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                    var nextOfKin = new NextOfKin
                    {
                        Firstname = nameParts.Length > 0 ? nameParts[0] : "",
                        Lastname = nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : "",
                        Relationship = nextOfKinData.GetValueOrDefault("nextOfKinRelationship", ""),
                        Phone = nextOfKinData.GetValueOrDefault("nextOfKinContactNo", ""),
                        Email = "",
                        IdNo = "",
                        ParticipantFK = progress.ParticipantFK.Value,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = currentUserId,
                        UpdatedAt = DateTime.UtcNow,
                        UpdatedBy = currentUserId
                    };

                    await _unitOfWork.NextOfKins.AddAsync(nextOfKin);
                    await _unitOfWork.SaveChangesAsync();
                    progress.NextOfKinFK = nextOfKin.PK;
                    _logger.LogInformation($"Created NextOfKin with ID: {nextOfKin.PK}");
                }
            }

            // Stage 3: Create Nomination (if not already exists)
            if (!string.IsNullOrEmpty(progress.Stage3_NominationData) && !progress.NominationFK.HasValue)
            {
                var nominationData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(progress.Stage3_NominationData);
                if (nominationData != null && progress.ParticipantFK.HasValue)
                {
                    var nomination = new Nomination
                    {
                        ParticipantFK = progress.ParticipantFK.Value,
                        CurrentQualifications = nominationData.ContainsKey("currentQualifications")
                            ? System.Text.Json.JsonSerializer.Serialize(nominationData["currentQualifications"])
                            : "[]",
                        NominatedProgram = nominationData.GetValueOrDefault("nominatedProgram", "")?.ToString() ?? "",
                        SponsorType = nominationData.GetValueOrDefault("sponsorType", "")?.ToString() ?? "",
                        YearOfNomination = nominationData.ContainsKey("yearOfNomination") && nominationData["yearOfNomination"] is System.Text.Json.JsonElement yearElement
                            ? GetIntValue(yearElement, DateTime.UtcNow.Year)
                            : DateTime.UtcNow.Year,
                        EstimatedBudget = nominationData.ContainsKey("estimatedBudget") && nominationData["estimatedBudget"] is System.Text.Json.JsonElement budgetElement
                            ? GetDecimalValue(budgetElement, 0)
                            : 0,
                        ProfessionalBody = nominationData.GetValueOrDefault("professionalBody", "")?.ToString() ?? "",
                        NominationStatus = "Pending",
                        NominationDate = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = currentUserId,
                        UpdatedAt = DateTime.UtcNow,
                        UpdatedBy = currentUserId
                    };

                    await _unitOfWork.Nominations.AddAsync(nomination);
                    await _unitOfWork.SaveChangesAsync();
                    progress.NominationFK = nomination.PK;
                    _logger.LogInformation($"Created Nomination with ID: {nomination.PK}");
                }
            }

            // Stage 4: Create ParticipantEnrollment (Admission) (if not already exists)
            if (!string.IsNullOrEmpty(progress.Stage4_AdmissionData) && !progress.ParticipantEnrollmentFK.HasValue)
            {
                var admissionData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(progress.Stage4_AdmissionData);
                if (admissionData != null && progress.ParticipantFK.HasValue)
                {
                    // Get trainingFK - it must be provided
                    int trainingFK = 0;
                    if (admissionData.ContainsKey("trainingFK") && admissionData["trainingFK"] is System.Text.Json.JsonElement trainingElement)
                    {
                        trainingFK = GetIntValue(trainingElement, 0);
                    }
                    if (trainingFK == 0)
                    {
                        _logger.LogWarning($"TrainingFK is missing or 0 for ProgressId: {progress.PK}. Skipping ParticipantEnrollment creation.");
                    }
                    else
                    {
                        var enrollment = new ParticipantEnrollment
                        {
                            ParticipantFK = progress.ParticipantFK.Value,
                            TrainingFK = trainingFK,
                            NominationFK = progress.NominationFK,
                            StartDate = admissionData.ContainsKey("startDate") && admissionData["startDate"] is System.Text.Json.JsonElement startElement
                                ? startElement.GetDateTime()
                                : DateTime.UtcNow,
                            EndDate = admissionData.ContainsKey("endDate") && admissionData["endDate"] is System.Text.Json.JsonElement endElement
                                ? endElement.GetDateTime()
                                : DateTime.UtcNow.AddYears(1),
                            Duration = admissionData.ContainsKey("duration") && admissionData["duration"] is System.Text.Json.JsonElement durationElement
                                ? GetIntValue(durationElement, 12)
                                : 12,
                            ModeOfStudy = admissionData.GetValueOrDefault("modeOfStudy", "")?.ToString() ?? "",
                            RegistrationDate = admissionData.ContainsKey("registrationDate") && admissionData["registrationDate"] is System.Text.Json.JsonElement regElement
                                ? regElement.GetDateTime()
                                : DateTime.UtcNow,
                            TrainingStatus = "Active",
                            FinancialYear = admissionData.GetValueOrDefault("financialYear", "")?.ToString() ?? DateTime.UtcNow.Year.ToString(),
                            CampusType = admissionData.GetValueOrDefault("campusType", "")?.ToString() ?? "",
                            NeedingTravel = admissionData.ContainsKey("needingTravel") && admissionData["needingTravel"] is System.Text.Json.JsonElement travelElement && GetBooleanValue(travelElement),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = currentUserId,
                            UpdatedAt = DateTime.UtcNow,
                            UpdatedBy = currentUserId
                        };

                        await _unitOfWork.ParticipantEnrollments.AddAsync(enrollment);
                        await _unitOfWork.SaveChangesAsync();
                        progress.ParticipantEnrollmentFK = enrollment.PK;
                        _logger.LogInformation($"Created ParticipantEnrollment with ID: {enrollment.PK}");
                    }
                }
            }

            // Stage 5: Create Bond (Bonding) (if not already exists)
            // if (!string.IsNullOrEmpty(progress.Stage5_BondingData) && progress.ParticipantEnrollmentFK.HasValue)
            // {
            //     var bondingData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(progress.Stage5_BondingData);
            //     if (bondingData != null)
            //     {
            //         // Check if bond already exists for this enrollment
            //         var allBonds = await _unitOfWork.Bonds.GetAllAsync();
            //         var existingBond = allBonds.FirstOrDefault(b => b.ParticipantEnrollmentFK == progress.ParticipantEnrollmentFK.Value);

            //         if (existingBond == null)
            //         {
            //             var bond = new Bond
            //             {
            //                 ParticipantEnrollmentFK = progress.ParticipantEnrollmentFK.Value,
            //                 BondStartDate = bondingData.ContainsKey("bondStartDate") && bondingData["bondStartDate"] is System.Text.Json.JsonElement startElement
            //                     ? startElement.GetDateTime()
            //                     : DateTime.UtcNow,
            //                 BondEndDate = bondingData.ContainsKey("bondEndDate") && bondingData["bondEndDate"] is System.Text.Json.JsonElement endElement
            //                     ? endElement.GetDateTime()
            //                     : DateTime.UtcNow.AddYears(2),
            //                 BondPeriodMonths = bondingData.ContainsKey("bondPeriodMonths") && bondingData["bondPeriodMonths"] is System.Text.Json.JsonElement periodElement
            //                     ? periodElement.GetInt32()
            //                     : 24,
            //                 BondAmount = bondingData.ContainsKey("bondAmount") && bondingData["bondAmount"] is System.Text.Json.JsonElement amountElement
            //                     ? amountElement.GetDecimal()
            //                     : 0,
            //                 BondSigned = bondingData.ContainsKey("bondSigned") && bondingData["bondSigned"] is System.Text.Json.JsonElement signedElement && GetBooleanValue(signedElement),
            //                 DateSigned = bondingData.ContainsKey("dateSigned") && bondingData["dateSigned"] is System.Text.Json.JsonElement dateSignedElement
            //                     ? dateSignedElement.GetDateTime()
            //                     : null,
            //                 BondStatus = bondingData.GetValueOrDefault("bondStatus", "")?.ToString() ?? "Pending",
            //                 BondConditions = bondingData.GetValueOrDefault("bondConditions", "")?.ToString(),
            //                 CreatedAt = DateTime.UtcNow,
            //                 CreatedBy = currentUserId,
            //                 UpdatedAt = DateTime.UtcNow,
            //                 UpdatedBy = currentUserId
            //             };

            //             await _unitOfWork.Bonds.AddAsync(bond);
            //             await _unitOfWork.SaveChangesAsync();
            //             _logger.LogInformation($"Created Bond with ID: {bond.PK}");
            //         }
            //     }
            // }

            // Stage 6: Create Allowances (Training Costs) (if not already exists)
            if (!string.IsNullOrEmpty(progress.Stage6_TrainingCostsData) && progress.ParticipantEnrollmentFK.HasValue)
            {
                var costsData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(progress.Stage6_TrainingCostsData);
                if (costsData != null && progress.ParticipantFK.HasValue)
                {
                    // Get the trainingFK from ParticipantEnrollment
                    var enrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(progress.ParticipantEnrollmentFK.Value);
                    int trainingFK = enrollment?.TrainingFK ?? 0;

                    if (trainingFK == 0)
                    {
                        _logger.LogWarning($"Cannot create allowances without trainingFK for ProgressId: {progress.PK}");
                    }
                    else
                    {
                        // Check if this is an array of allowances
                        if (costsData.ContainsKey("allowances") && costsData["allowances"] is System.Text.Json.JsonElement allowancesElement)
                        {
                            var allowancesArray = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(allowancesElement.GetRawText());
                            if (allowancesArray != null)
                            {
                                foreach (var allowanceData in allowancesArray)
                                {
                                    var allowance = new Allowance
                                    {
                                        ParticipantFK = progress.ParticipantFK.Value,
                                        TrainingFK = trainingFK, // Use trainingFK from enrollment
                                        AllowanceTypeFK = allowanceData.ContainsKey("allowanceTypeFK") && allowanceData["allowanceTypeFK"] is System.Text.Json.JsonElement typeElement
                                            ? GetIntValue(typeElement, 1)
                                            : 1,
                                        StatusFK = allowanceData.ContainsKey("statusFK") && allowanceData["statusFK"] is System.Text.Json.JsonElement statusElement
                                            ? GetIntValue(statusElement, 1)
                                            : 1,
                                        Amount = allowanceData.ContainsKey("amount") && allowanceData["amount"] is System.Text.Json.JsonElement amountElement
                                            ? GetDecimalValue(amountElement, 0)
                                            : 0,
                                        StartDate = allowanceData.ContainsKey("startDate") && allowanceData["startDate"] is System.Text.Json.JsonElement startElement
                                            ? startElement.GetDateTime()
                                            : DateTime.UtcNow,
                                        EndDate = allowanceData.ContainsKey("endDate") && allowanceData["endDate"] is System.Text.Json.JsonElement endElement
                                            ? endElement.GetDateTime()
                                            : DateTime.UtcNow.AddYears(1),
                                        Frequency = allowanceData.GetValueOrDefault("frequency", "")?.ToString() ?? "Monthly",
                                        Comments = allowanceData.GetValueOrDefault("comments", "")?.ToString(),
                                        CreatedAt = DateTime.UtcNow,
                                        CreatedBy = currentUserId,
                                        UpdatedAt = DateTime.UtcNow,
                                        UpdatedBy = currentUserId
                                    };

                                    await _unitOfWork.Allowances.AddAsync(allowance);
                                }
                                await _unitOfWork.SaveChangesAsync();
                                _logger.LogInformation($"Created {allowancesArray.Count} allowances for ParticipantEnrollment");
                            }
                        }
                    }
                }
            }

            _logger.LogInformation($"Data transfer completed for ProgressId: {progress.PK} by user ID: {currentUserId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error transferring data to main tables for ProgressId: {progress.PK}");
            throw;
        }
    }
}
