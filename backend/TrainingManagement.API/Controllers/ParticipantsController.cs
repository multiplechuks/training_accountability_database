using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ParticipantsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ParticipantsController> _logger;

    public ParticipantsController(IUnitOfWork unitOfWork, ILogger<ParticipantsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all participants with optional pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetParticipants([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            // Ensure valid pagination parameters
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 10 : pageSize > 100 ? 100 : pageSize;

            IEnumerable<Participant> participants = null!;
            participants = await _unitOfWork.Participants.GetAllAsync();

            var totalCount = participants.Count();
            var pagedParticipants = participants
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ParticipantResponseDto
                {
                    Id = p.PK,
                    Title = p.Title,
                    Firstname = p.Firstname,
                    Lastname = p.Lastname,
                    Middlename = p.Middlename,
                    IdNo = p.IdNo,
                    Sex = p.Sex,
                    Dob = p.Dob,
                    IdType = p.IdType,
                    Phone = p.Phone,
                    Email = p.Email,
                    FullName = p.FullName,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                }).ToList();

            return Ok(new
            {
                data = pagedParticipants,
                total = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving participants");
            return StatusCode(500, new { message = "An error occurred while retrieving participants" });
        }
    }

    /// <summary>
    /// Get a participant by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetParticipant(int id)
    {
        try
        {
            var participant = await _unitOfWork.Participants.GetByIdAsync(id);

            if (participant == null)
            {
                return NotFound(new { message = "Participant not found" });
            }

            var response = new ParticipantResponseDto
            {
                Id = participant.PK,
                Title = participant.Title,
                Firstname = participant.Firstname,
                Lastname = participant.Lastname,
                Middlename = participant.Middlename,
                IdNo = participant.IdNo,
                Sex = participant.Sex,
                Dob = participant.Dob,
                IdType = participant.IdType,
                Phone = participant.Phone,
                Email = participant.Email,
                FullName = participant.FullName,
                CreatedAt = participant.CreatedAt,
                UpdatedAt = participant.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving participant with ID {ParticipantId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the participant" });
        }
    }

    /// <summary>
    /// Get a participant with their enrollments
    /// </summary>
    [HttpGet("{id}/enrollments")]
    public async Task<IActionResult> GetParticipantWithEnrollments(int id)
    {
        try
        {
            var participant = await _unitOfWork.Participants.GetWithEnrollmentsAsync(id);

            if (participant == null)
            {
                return NotFound(new { message = "Participant not found" });
            }

            var response = new ParticipantWithEnrollmentsDto
            {
                Id = participant.PK,
                Title = participant.Title,
                Firstname = participant.Firstname,
                Lastname = participant.Lastname,
                Middlename = participant.Middlename,
                IdNo = participant.IdNo,
                Sex = participant.Sex,
                Dob = participant.Dob,
                IdType = participant.IdType,
                Phone = participant.Phone,
                Email = participant.Email,
                FullName = participant.FullName,
                CreatedAt = participant.CreatedAt,
                UpdatedAt = participant.UpdatedAt,
                Enrollments = participant.ParticipantEnrollments.Select(e => new EnrollmentSummaryDto
                {
                    Id = e.PK,
                    TrainingId = e.TrainingFK,
                    // Assuming we have navigation properties loaded
                    TrainingProgram = e.Training?.Program ?? "N/A",
                    Institution = e.Training?.Institution ?? "N/A",
                    TrainingStatus = e.TrainingStatus, // Now in ParticipantEnrollment
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving participant with enrollments for ID {ParticipantId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the participant with enrollments" });
        }
    }

    /// <summary>
    /// Search participants by name or ID number
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchParticipants([FromQuery] SearchQuery query)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 10 : query.PageSize > 100 ? 100 : query.PageSize;
        var searchTerm = query.SearchTerm;
        try
        {
            IEnumerable<Participant> participants = null!;
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                participants = await _unitOfWork.Participants.SearchParticipantsAsync(searchTerm);
            }
            else
            {
                participants = await _unitOfWork.Participants.GetAllAsync();
            }

            var totalCount = participants.Count();
            var response = participants
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ParticipantResponseDto
            {
                Id = p.PK,
                Title = p.Title,
                Firstname = p.Firstname,
                Lastname = p.Lastname,
                Middlename = p.Middlename,
                IdNo = p.IdNo,
                Sex = p.Sex,
                Dob = p.Dob,
                IdType = p.IdType,
                Phone = p.Phone,
                Email = p.Email,
                FullName = p.FullName,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList();

            return Ok(new
            {
                data = response,
                total = totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching participants with term {SearchTerm}", searchTerm);
            return StatusCode(500, new { message = "An error occurred while searching participants" });
        }
    }

    /// <summary>
    /// Create a new participant
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateParticipant([FromBody] CreateParticipantDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if ID number is unique
            var existingParticipant = await _unitOfWork.Participants.GetByIdNumberAsync(dto.IdNo);
            if (existingParticipant != null)
            {
                return Conflict(new { message = "A participant with this ID number already exists", participantId = existingParticipant.PK });
            }

            var participant = new Participant
            {
                Title = dto.Title,
                Firstname = dto.Firstname,
                Lastname = dto.Lastname,
                Middlename = dto.Middlename,
                IdNo = dto.IdNo,
                Sex = dto.Sex,
                Dob = dto.Dob,
                IdType = dto.IdType,
                Phone = dto.Phone,
                Email = dto.Email,
                WorkTelephone = dto.WorkTelephone,
                DesignationFK = dto.DesignationFK,
                DepartmentOrFacility = dto.DepartmentOrFacility,
                DutyStation = dto.DutyStation,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = User.Identity?.Name ?? "System",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = User.Identity?.Name ?? "System"
            };

            await _unitOfWork.Participants.AddAsync(participant);
            await _unitOfWork.SaveChangesAsync();

            var response = new ParticipantResponseDto
            {
                Id = participant.PK,
                Title = participant.Title,
                Firstname = participant.Firstname,
                Lastname = participant.Lastname,
                Middlename = participant.Middlename,
                IdNo = participant.IdNo,
                Sex = participant.Sex,
                Dob = participant.Dob,
                IdType = participant.IdType,
                Phone = participant.Phone,
                Email = participant.Email,
                // WorkTelephone = participant.WorkTelephone,
                // DesignationFK = participant.DesignationFK,
                // DepartmentOrFacility = participant.DepartmentOrFacility,
                // DutyStation = participant.DutyStation,
                FullName = participant.FullName,
                CreatedAt = participant.CreatedAt,
                UpdatedAt = participant.UpdatedAt
            };

            return CreatedAtAction(nameof(GetParticipant), new { id = participant.PK }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating participant");
            return StatusCode(500, new { message = "An error occurred while creating the participant" });
        }
    }

    /// <summary>
    /// Create a new participant and start enrollment immediately
    /// Accepts full Stage1ParticipantDto with all employment fields
    /// </summary>
    [HttpPost("create-and-enroll")]
    public async Task<IActionResult> CreateParticipantAndStartEnrollment([FromBody] Stage1ParticipantDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _unitOfWork.BeginTransactionAsync();

            // Check if ID number is unique
            var existingParticipant = await _unitOfWork.Participants.GetByIdNumberAsync(dto.IdNo);

            int participantId;
            bool isNewParticipant = false;

            if (existingParticipant != null)
            {
                // Update existing participant with all fields
                existingParticipant.Title = dto.Title;
                existingParticipant.Firstname = dto.Firstname;
                existingParticipant.Lastname = dto.Lastname;
                existingParticipant.Middlename = dto.Middlename;
                existingParticipant.Sex = dto.Sex;
                existingParticipant.Dob = dto.Dob;
                existingParticipant.IdType = dto.IdType;
                existingParticipant.Phone = dto.Phone;
                existingParticipant.Email = dto.Email;
                existingParticipant.WorkTelephone = dto.WorkTelephone;
                existingParticipant.DesignationFK = dto.DesignationFK;
                existingParticipant.DepartmentOrFacility = dto.DepartmentOrFacility;
                existingParticipant.DutyStation = dto.DutyStation;
                existingParticipant.UpdatedAt = DateTime.UtcNow;
                existingParticipant.UpdatedBy = User.Identity?.Name ?? "System";

                await _unitOfWork.Participants.UpdateAsync(existingParticipant);
                await _unitOfWork.SaveChangesAsync();
                participantId = existingParticipant.PK;
            }
            else
            {
                var participant = new Participant
                {
                    Title = dto.Title,
                    Firstname = dto.Firstname,
                    Lastname = dto.Lastname,
                    Middlename = dto.Middlename,
                    IdNo = dto.IdNo,
                    Sex = dto.Sex,
                    Dob = dto.Dob,
                    IdType = dto.IdType,
                    Phone = dto.Phone,
                    Email = dto.Email,
                    WorkTelephone = dto.WorkTelephone,
                    DesignationFK = dto.DesignationFK,
                    DepartmentOrFacility = dto.DepartmentOrFacility,
                    DutyStation = dto.DutyStation,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = User.Identity?.Name ?? "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = User.Identity?.Name ?? "System"
                };

                await _unitOfWork.Participants.AddAsync(participant);
                await _unitOfWork.SaveChangesAsync();
                participantId = participant.PK;
                isNewParticipant = true;
            }

            // Check if there's already an in-progress enrollment
            var allProgress = await _unitOfWork.EnrollmentProgress.GetAllAsync();
            var existingProgress = allProgress
                .FirstOrDefault(p => p.ParticipantFK == participantId && p.EnrollmentStatus == "In Progress");

            if (existingProgress != null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return Ok(new
                {
                    participantId,
                    progressId = existingProgress.PK,
                    message = "Participant exists with enrollment in progress",
                    currentStep = existingProgress.CurrentStep,
                    alreadyExists = true
                });
            }

            // Create enrollment progress starting at Stage 2 (Stage 1 is complete with participant creation)
            var progress = new EnrollmentProgress
            {
                ParticipantFK = participantId,
                CurrentStep = 2, // Skip to Stage 2 (Next of Kin)
                EnrollmentStatus = "In Progress",
                Form1_ParticipantProfile = true, // Mark Stage 1 complete
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
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                participantId,
                progressId = progress.PK,
                message = isNewParticipant
                    ? "Participant created and enrollment started"
                    : "Enrollment started for existing participant",
                currentStep = 2,
                nextAction = "Complete Stage 2: Next of Kin",
                isNewParticipant
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error creating participant and starting enrollment");
            return StatusCode(500, new { message = "An error occurred while creating participant and starting enrollment" });
        }
    }

    /// <summary>
    /// Update an existing participant
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateParticipant(int id, [FromBody] UpdateParticipantDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var participant = await _unitOfWork.Participants.GetByIdAsync(id);
            if (participant == null)
            {
                return NotFound(new { message = "Participant not found" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(dto.Title))
            {
                participant.Title = dto.Title;
            }

            if (!string.IsNullOrEmpty(dto.Firstname))
            {
                participant.Firstname = dto.Firstname;
            }

            if (!string.IsNullOrEmpty(dto.Lastname))
            {
                participant.Lastname = dto.Lastname;
            }

            if (dto.Middlename != null)
            {
                participant.Middlename = dto.Middlename;
            }

            if (!string.IsNullOrEmpty(dto.Sex))
            {
                participant.Sex = dto.Sex;
            }

            if (dto.Dob.HasValue)
            {
                participant.Dob = dto.Dob.Value;
            }

            if (!string.IsNullOrEmpty(dto.IdType))
            {
                participant.IdType = dto.IdType;
            }

            if (!string.IsNullOrEmpty(dto.Phone))
            {
                participant.Phone = dto.Phone;
            }

            if (!string.IsNullOrEmpty(dto.Email))
            {
                participant.Email = dto.Email;
            }

            if (dto.WorkTelephone != null)
            {
                participant.WorkTelephone = dto.WorkTelephone;
            }

            if (dto.DesignationFK.HasValue)
            {
                participant.DesignationFK = dto.DesignationFK;
            }

            if (dto.DepartmentOrFacility != null)
            {
                participant.DepartmentOrFacility = dto.DepartmentOrFacility;
            }

            if (dto.DutyStation != null)
            {
                participant.DutyStation = dto.DutyStation;
            }

            await _unitOfWork.Participants.UpdateAsync(participant);
            await _unitOfWork.SaveChangesAsync();

            var response = new ParticipantResponseDto
            {
                Id = participant.PK,
                Title = participant.Title,
                Firstname = participant.Firstname,
                Lastname = participant.Lastname,
                Middlename = participant.Middlename,
                IdNo = participant.IdNo,
                Sex = participant.Sex,
                Dob = participant.Dob,
                IdType = participant.IdType,
                Phone = participant.Phone,
                Email = participant.Email,
                FullName = participant.FullName,
                CreatedAt = participant.CreatedAt,
                UpdatedAt = participant.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating participant with ID {ParticipantId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the participant" });
        }
    }

    /// <summary>
    /// Delete a participant
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteParticipant(int id)
    {
        try
        {
            var participant = await _unitOfWork.Participants.GetByIdAsync(id);
            if (participant == null)
            {
                return NotFound(new { message = "Participant not found" });
            }

            // Check if participant has enrollments
            var hasEnrollments = await _unitOfWork.ParticipantEnrollments.GetByParticipantAsync(id);
            if (hasEnrollments.Any())
            {
                return BadRequest(new { message = "Cannot delete participant with existing enrollments" });
            }

            await _unitOfWork.Participants.DeleteAsync(participant);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Participant deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting participant with ID {ParticipantId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the participant" });
        }
    }
}
