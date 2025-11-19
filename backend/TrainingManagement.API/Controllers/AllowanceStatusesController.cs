using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AllowanceStatusesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AllowanceStatusesController> _logger;

    public AllowanceStatusesController(IUnitOfWork unitOfWork, ILogger<AllowanceStatusesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/allowancestatuses
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<AllowanceStatusResponseDto>>> GetAllowanceStatuses(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var allowanceStatuses = string.IsNullOrEmpty(searchTerm)
                ? await _unitOfWork.AllowanceStatuses.GetAllAsync()
                : await _unitOfWork.AllowanceStatuses.SearchAllowanceStatusesAsync(searchTerm);

            var filteredStatuses = allowanceStatuses.Where(asts => !asts.Deleted);
            var totalCount = filteredStatuses.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var pagedStatuses = filteredStatuses
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(asts => new AllowanceStatusResponseDto
                {
                    PK = asts.PK,
                    Name = asts.Name,
                    Description = asts.Description,
                    CreatedAt = asts.CreatedAt,
                    UpdatedAt = asts.UpdatedAt,
                    CreatedBy = asts.CreatedBy,
                    UpdatedBy = asts.UpdatedBy
                })
                .OrderBy(asts => asts.Name)
                .ToList();

            var response = new PaginatedResponse<AllowanceStatusResponseDto>
            {
                Data = pagedStatuses,
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
            _logger.LogError(ex, "Error retrieving allowance statuses");
            return StatusCode(500, "An error occurred while retrieving allowance statuses");
        }
    }

    // GET: api/allowancestatuses/5
    [HttpGet("{id}")]
    public async Task<ActionResult<AllowanceStatusResponseDto>> GetAllowanceStatus(int id)
    {
        try
        {
            var allowanceStatus = await _unitOfWork.AllowanceStatuses.GetByIdAsync(id);

            if (allowanceStatus == null || allowanceStatus.Deleted)
            {
                return NotFound($"Allowance status with ID {id} not found");
            }

            var responseDto = new AllowanceStatusResponseDto
            {
                PK = allowanceStatus.PK,
                Name = allowanceStatus.Name,
                Description = allowanceStatus.Description,
                CreatedAt = allowanceStatus.CreatedAt,
                UpdatedAt = allowanceStatus.UpdatedAt,
                CreatedBy = allowanceStatus.CreatedBy,
                UpdatedBy = allowanceStatus.UpdatedBy
            };

            return Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance status with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the allowance status");
        }
    }

    // POST: api/allowancestatuses
    [HttpPost]
    public async Task<ActionResult<AllowanceStatusResponseDto>> CreateAllowanceStatus(CreateAllowanceStatusDto createDto)
    {
        try
        {
            // Check if allowance status with same name already exists
            var isUnique = await _unitOfWork.AllowanceStatuses.IsNameUniqueAsync(createDto.Name);
            
            if (!isUnique)
            {
                return BadRequest($"Allowance status with name '{createDto.Name}' already exists");
            }

            var allowanceStatus = new AllowanceStatus
            {
                Name = createDto.Name,
                Description = createDto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = "System", // TODO: Get from authenticated user
                UpdatedBy = "System"  // TODO: Get from authenticated user
            };

            await _unitOfWork.AllowanceStatuses.AddAsync(allowanceStatus);
            await _unitOfWork.SaveChangesAsync();

            var responseDto = new AllowanceStatusResponseDto
            {
                PK = allowanceStatus.PK,
                Name = allowanceStatus.Name,
                Description = allowanceStatus.Description,
                CreatedAt = allowanceStatus.CreatedAt,
                UpdatedAt = allowanceStatus.UpdatedAt,
                CreatedBy = allowanceStatus.CreatedBy,
                UpdatedBy = allowanceStatus.UpdatedBy
            };

            return CreatedAtAction(nameof(GetAllowanceStatus), new { id = allowanceStatus.PK }, responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating allowance status");
            return StatusCode(500, "An error occurred while creating the allowance status");
        }
    }

    // PUT: api/allowancestatuses/5
    [HttpPut("{id}")]
    public async Task<ActionResult<AllowanceStatusResponseDto>> UpdateAllowanceStatus(int id, UpdateAllowanceStatusDto updateDto)
    {
        try
        {
            var allowanceStatus = await _unitOfWork.AllowanceStatuses.GetByIdAsync(id);

            if (allowanceStatus == null || allowanceStatus.Deleted)
            {
                return NotFound($"Allowance status with ID {id} not found");
            }

            // Check if another allowance status with the same name exists (if name is being updated)
            if (!string.IsNullOrEmpty(updateDto.Name) && updateDto.Name != allowanceStatus.Name)
            {
                var isUnique = await _unitOfWork.AllowanceStatuses.IsNameUniqueAsync(updateDto.Name, id);
                
                if (!isUnique)
                {
                    return BadRequest($"Allowance status with name '{updateDto.Name}' already exists");
                }
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateDto.Name))
            {
                allowanceStatus.Name = updateDto.Name;
            }

            if (updateDto.Description != null)
            {
                allowanceStatus.Description = updateDto.Description;
            }

            allowanceStatus.UpdatedAt = DateTime.UtcNow;
            allowanceStatus.UpdatedBy = "System"; // TODO: Get from authenticated user

            await _unitOfWork.AllowanceStatuses.UpdateAsync(allowanceStatus);
            await _unitOfWork.SaveChangesAsync();

            var responseDto = new AllowanceStatusResponseDto
            {
                PK = allowanceStatus.PK,
                Name = allowanceStatus.Name,
                Description = allowanceStatus.Description,
                CreatedAt = allowanceStatus.CreatedAt,
                UpdatedAt = allowanceStatus.UpdatedAt,
                CreatedBy = allowanceStatus.CreatedBy,
                UpdatedBy = allowanceStatus.UpdatedBy
            };

            return Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating allowance status with ID {Id}", id);
            return StatusCode(500, "An error occurred while updating the allowance status");
        }
    }

    // DELETE: api/allowancestatuses/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAllowanceStatus(int id)
    {
        try
        {
            var allowanceStatus = await _unitOfWork.AllowanceStatuses.GetByIdAsync(id);

            if (allowanceStatus == null || allowanceStatus.Deleted)
            {
                return NotFound($"Allowance status with ID {id} not found");
            }

            // Check if any allowances are using this status
            var hasAllowances = await _unitOfWork.AllowanceStatuses.HasAllowancesAsync(id);

            if (hasAllowances)
            {
                return BadRequest("Cannot delete allowance status as it is being used by existing allowances");
            }

            // Soft delete
            allowanceStatus.Deleted = true;
            allowanceStatus.UpdatedAt = DateTime.UtcNow;
            allowanceStatus.UpdatedBy = "System"; // TODO: Get from authenticated user

            await _unitOfWork.AllowanceStatuses.UpdateAsync(allowanceStatus);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting allowance status with ID {Id}", id);
            return StatusCode(500, "An error occurred while deleting the allowance status");
        }
    }

    // GET: api/allowancestatuses/lookup
    [HttpGet("lookup")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetAllowanceStatusesLookup([FromQuery] string? searchTerm = null)
    {
        try
        {
            var allowanceStatuses = string.IsNullOrEmpty(searchTerm)
                ? await _unitOfWork.AllowanceStatuses.GetAllAsync()
                : await _unitOfWork.AllowanceStatuses.SearchAllowanceStatusesAsync(searchTerm);

            var lookupData = allowanceStatuses
                .Where(asts => !asts.Deleted)
                .Select(asts => new LookupDto
                {
                    PK = asts.PK,
                    Name = asts.Name,
                    Description = asts.Description
                })
                .OrderBy(asts => asts.Name)
                .ToList();

            return Ok(lookupData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance statuses for lookup");
            return StatusCode(500, "An error occurred while retrieving allowance statuses");
        }
    }
}