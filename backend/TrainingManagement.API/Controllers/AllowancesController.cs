using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AllowancesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AllowancesController> _logger;

    public AllowancesController(IUnitOfWork unitOfWork, ILogger<AllowancesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/allowances
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<AllowanceResponseDto>>> GetAllowances(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var allowances = await _unitOfWork.Allowances.GetAllAsync();
            var filteredAllowances = allowances.Where(a => !a.Deleted);

            // Apply search filter if provided
            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                filteredAllowances = filteredAllowances.Where(a =>
                    a.Comments != null && a.Comments.ToLower().Contains(searchTerm) ||
                    a.Participant.Firstname.ToLower().Contains(searchTerm) ||
                    a.Participant.Lastname.ToLower().Contains(searchTerm) ||
                    a.Training.Program.ToLower().Contains(searchTerm) ||
                    a.AllowanceType.Name.ToLower().Contains(searchTerm) ||
                    a.AllowanceStatus.Name.ToLower().Contains(searchTerm)
                );
            }

            var totalCount = filteredAllowances.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var pagedAllowances = filteredAllowances
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => MapToResponseDto(a))
                .ToList();

            var response = new PaginatedResponse<AllowanceResponseDto>
            {
                Data = pagedAllowances,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowances");
            return StatusCode(500, "An error occurred while retrieving allowances");
        }
    }

    // GET: api/allowances/5
    [HttpGet("{id}")]
    public async Task<ActionResult<AllowanceResponseDto>> GetAllowance(int id)
    {
        try
        {
            var allowance = await _unitOfWork.Allowances.GetByIdAsync(id);

            if (allowance == null || allowance.Deleted)
            {
                return NotFound($"Allowance with ID {id} not found");
            }

            var responseDto = MapToResponseDto(allowance);
            return Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the allowance");
        }
    }

    // GET: api/allowances/participant/5
    [HttpGet("participant/{participantId}")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetAllowancesByParticipant(int participantId)
    {
        try
        {
            var allowances = await _unitOfWork.Allowances.GetAllowancesByParticipantAsync(participantId);
            var filteredAllowances = allowances
                .Where(a => !a.Deleted)
                .Select(a => MapToResponseDto(a))
                .ToList();

            return Ok(filteredAllowances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowances for participant {ParticipantId}", participantId);
            return StatusCode(500, "An error occurred while retrieving allowances");
        }
    }

    // GET: api/allowances/training/5
    [HttpGet("training/{trainingId}")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetAllowancesByTraining(int trainingId)
    {
        try
        {
            var allowances = await _unitOfWork.Allowances.GetAllowancesByTrainingAsync(trainingId);
            var filteredAllowances = allowances
                .Where(a => !a.Deleted)
                .Select(a => MapToResponseDto(a))
                .ToList();

            return Ok(filteredAllowances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowances for training {TrainingId}", trainingId);
            return StatusCode(500, "An error occurred while retrieving allowances");
        }
    }

    // GET: api/allowances/status/2
    [HttpGet("status/{statusId}")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetAllowancesByStatus(int statusId)
    {
        try
        {
            var allowances = await _unitOfWork.Allowances.GetAllowancesByStatusAsync(statusId);
            var filteredAllowances = allowances
                .Where(a => !a.Deleted)
                .Select(a => MapToResponseDto(a))
                .ToList();

            return Ok(filteredAllowances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowances for status {StatusId}", statusId);
            return StatusCode(500, "An error occurred while retrieving allowances");
        }
    }

    // GET: api/allowances/type/1
    [HttpGet("type/{typeId}")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetAllowancesByType(int typeId)
    {
        try
        {
            var allowances = await _unitOfWork.Allowances.GetAllowancesByTypeAsync(typeId);
            var filteredAllowances = allowances
                .Where(a => !a.Deleted)
                .Select(a => MapToResponseDto(a))
                .ToList();

            return Ok(filteredAllowances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowances for type {TypeId}", typeId);
            return StatusCode(500, "An error occurred while retrieving allowances");
        }
    }

    // GET: api/allowances/date-range?startDate=2024-01-01&endDate=2024-12-31
    [HttpGet("date-range")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetAllowancesInDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            if (endDate < startDate)
            {
                return BadRequest("End date must be after start date");
            }

            var allowances = await _unitOfWork.Allowances.GetAllowancesInDateRangeAsync(startDate, endDate);
            var filteredAllowances = allowances
                .Where(a => !a.Deleted)
                .Select(a => MapToResponseDto(a))
                .ToList();

            return Ok(filteredAllowances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowances in date range");
            return StatusCode(500, "An error occurred while retrieving allowances");
        }
    }

    // GET: api/allowances/participant/5/total
    [HttpGet("participant/{participantId}/total")]
    public async Task<ActionResult<object>> GetTotalAllowancesByParticipant(int participantId)
    {
        try
        {
            var total = await _unitOfWork.Allowances.GetTotalAllowancesByParticipantAsync(participantId);
            return Ok(new { participantId, total });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving total allowances for participant {ParticipantId}", participantId);
            return StatusCode(500, "An error occurred while calculating total allowances");
        }
    }

    // POST: api/allowances
    [HttpPost]
    public async Task<ActionResult<AllowanceResponseDto>> CreateAllowance(CreateAllowanceDto createDto)
    {
        try
        {
            // Validate dates
            if (createDto.EndDate < createDto.StartDate)
            {
                return BadRequest("End date must be after start date");
            }

            // Verify participant exists
            var participant = await _unitOfWork.Participants.GetByIdAsync(createDto.ParticipantFK);
            if (participant == null || participant.Deleted)
            {
                return BadRequest($"Participant with ID {createDto.ParticipantFK} not found");
            }

            // Verify training exists
            var training = await _unitOfWork.Trainings.GetByIdAsync(createDto.TrainingFK);
            if (training == null || training.Deleted)
            {
                return BadRequest($"Training with ID {createDto.TrainingFK} not found");
            }

            // Verify allowance type exists
            var allowanceType = await _unitOfWork.AllowanceTypes.GetByIdAsync(createDto.AllowanceTypeFK);
            if (allowanceType == null || allowanceType.Deleted)
            {
                return BadRequest($"Allowance type with ID {createDto.AllowanceTypeFK} not found");
            }

            // Verify allowance status exists
            var allowanceStatus = await _unitOfWork.AllowanceStatuses.GetByIdAsync(createDto.StatusFK);
            if (allowanceStatus == null || allowanceStatus.Deleted)
            {
                return BadRequest($"Allowance status with ID {createDto.StatusFK} not found");
            }

            var allowance = new Allowance
            {
                Amount = createDto.Amount,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                Comments = createDto.Comments,
                TrainingFK = createDto.TrainingFK,
                StatusFK = createDto.StatusFK,
                ParticipantFK = createDto.ParticipantFK,
                AllowanceTypeFK = createDto.AllowanceTypeFK,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = "System", // TODO: Get from authenticated user
                UpdatedBy = "System"  // TODO: Get from authenticated user
            };

            await _unitOfWork.Allowances.AddAsync(allowance);
            await _unitOfWork.SaveChangesAsync();

            // Reload to get navigation properties
            var createdAllowance = await _unitOfWork.Allowances.GetByIdAsync(allowance.PK);
            var responseDto = MapToResponseDto(createdAllowance!);

            return CreatedAtAction(nameof(GetAllowance), new { id = allowance.PK }, responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating allowance");
            return StatusCode(500, "An error occurred while creating the allowance");
        }
    }

    // PUT: api/allowances/5
    [HttpPut("{id}")]
    public async Task<ActionResult<AllowanceResponseDto>> UpdateAllowance(int id, UpdateAllowanceDto updateDto)
    {
        try
        {
            var allowance = await _unitOfWork.Allowances.GetByIdAsync(id);

            if (allowance == null || allowance.Deleted)
            {
                return NotFound($"Allowance with ID {id} not found");
            }

            // Validate dates if both are being updated
            var startDate = updateDto.StartDate ?? allowance.StartDate;
            var endDate = updateDto.EndDate ?? allowance.EndDate;

            if (endDate < startDate)
            {
                return BadRequest("End date must be after start date");
            }

            // Update fields if provided
            if (updateDto.Amount.HasValue)
            {
                allowance.Amount = updateDto.Amount.Value;
            }

            if (updateDto.StartDate.HasValue)
            {
                allowance.StartDate = updateDto.StartDate.Value;
            }

            if (updateDto.EndDate.HasValue)
            {
                allowance.EndDate = updateDto.EndDate.Value;
            }

            if (updateDto.Comments != null)
            {
                allowance.Comments = updateDto.Comments;
            }

            if (updateDto.TrainingFK.HasValue)
            {
                var training = await _unitOfWork.Trainings.GetByIdAsync(updateDto.TrainingFK.Value);
                if (training == null || training.Deleted)
                {
                    return BadRequest($"Training with ID {updateDto.TrainingFK.Value} not found");
                }
                allowance.TrainingFK = updateDto.TrainingFK.Value;
            }

            if (updateDto.StatusFK.HasValue)
            {
                var status = await _unitOfWork.AllowanceStatuses.GetByIdAsync(updateDto.StatusFK.Value);
                if (status == null || status.Deleted)
                {
                    return BadRequest($"Allowance status with ID {updateDto.StatusFK.Value} not found");
                }
                allowance.StatusFK = updateDto.StatusFK.Value;
            }

            if (updateDto.ParticipantFK.HasValue)
            {
                var participant = await _unitOfWork.Participants.GetByIdAsync(updateDto.ParticipantFK.Value);
                if (participant == null || participant.Deleted)
                {
                    return BadRequest($"Participant with ID {updateDto.ParticipantFK.Value} not found");
                }
                allowance.ParticipantFK = updateDto.ParticipantFK.Value;
            }

            if (updateDto.AllowanceTypeFK.HasValue)
            {
                var allowanceType = await _unitOfWork.AllowanceTypes.GetByIdAsync(updateDto.AllowanceTypeFK.Value);
                if (allowanceType == null || allowanceType.Deleted)
                {
                    return BadRequest($"Allowance type with ID {updateDto.AllowanceTypeFK.Value} not found");
                }
                allowance.AllowanceTypeFK = updateDto.AllowanceTypeFK.Value;
            }

            allowance.UpdatedAt = DateTime.UtcNow;
            allowance.UpdatedBy = "System"; // TODO: Get from authenticated user

            await _unitOfWork.SaveChangesAsync();

            // Reload to get updated navigation properties
            var updatedAllowance = await _unitOfWork.Allowances.GetByIdAsync(id);
            var responseDto = MapToResponseDto(updatedAllowance!);

            return Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating allowance with ID {Id}", id);
            return StatusCode(500, "An error occurred while updating the allowance");
        }
    }

    // DELETE: api/allowances/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAllowance(int id)
    {
        try
        {
            var allowance = await _unitOfWork.Allowances.GetByIdAsync(id);

            if (allowance == null || allowance.Deleted)
            {
                return NotFound($"Allowance with ID {id} not found");
            }

            // Soft delete
            allowance.Deleted = true;
            allowance.UpdatedAt = DateTime.UtcNow;
            allowance.UpdatedBy = "System"; // TODO: Get from authenticated user

            await _unitOfWork.Allowances.UpdateAsync(allowance);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting allowance with ID {Id}", id);
            return StatusCode(500, "An error occurred while deleting the allowance");
        }
    }

    // Helper method to map entity to DTO
    private static AllowanceResponseDto MapToResponseDto(Allowance allowance)
    {
        return new AllowanceResponseDto
        {
            PK = allowance.PK,
            Amount = allowance.Amount,
            StartDate = allowance.StartDate,
            EndDate = allowance.EndDate,
            Comments = allowance.Comments,
            TrainingFK = allowance.TrainingFK,
            StatusFK = allowance.StatusFK,
            ParticipantFK = allowance.ParticipantFK,
            AllowanceTypeFK = allowance.AllowanceTypeFK,
            CreatedAt = allowance.CreatedAt,
            UpdatedAt = allowance.UpdatedAt,
            CreatedBy = allowance.CreatedBy,
            UpdatedBy = allowance.UpdatedBy,
            Participant = allowance.Participant != null ? new ParticipantLookupDto
            {
                PK = allowance.Participant.PK,
                FirstName = allowance.Participant.Firstname,
                LastName = allowance.Participant.Lastname,
                Email = allowance.Participant.Email
            } : null,
            Training = allowance.Training != null ? new TrainingLookupDto
            {
                PK = allowance.Training.PK,
                Title = allowance.Training.Program,
                Program = allowance.Training.Program,
                Venue = allowance.Training.Institution
            } : null,
            AllowanceType = allowance.AllowanceType != null ? new AllowanceTypeLookupDto
            {
                PK = allowance.AllowanceType.PK,
                Name = allowance.AllowanceType.Name,
                Description = allowance.AllowanceType.Description
            } : null,
            AllowanceStatus = allowance.AllowanceStatus != null ? new AllowanceStatusLookupDto
            {
                PK = allowance.AllowanceStatus.PK,
                Name = allowance.AllowanceStatus.Name,
                Description = allowance.AllowanceStatus.Description
            } : null
        };
    }
}
