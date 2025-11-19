using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AllowanceTypesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AllowanceTypesController> _logger;

    public AllowanceTypesController(IUnitOfWork unitOfWork, ILogger<AllowanceTypesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // GET: api/allowancetypes
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<AllowanceTypeResponseDto>>> GetAllowanceTypes(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var allowanceTypes = string.IsNullOrEmpty(searchTerm)
                ? await _unitOfWork.AllowanceTypes.GetAllAsync()
                : await _unitOfWork.AllowanceTypes.SearchAllowanceTypesAsync(searchTerm);

            var filteredTypes = allowanceTypes.Where(at => !at.Deleted);
            var totalCount = filteredTypes.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var pagedTypes = filteredTypes
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(at => new AllowanceTypeResponseDto
                {
                    PK = at.PK,
                    Name = at.Name,
                    Description = at.Description,
                    CreatedAt = at.CreatedAt,
                    UpdatedAt = at.UpdatedAt,
                    CreatedBy = at.CreatedBy,
                    UpdatedBy = at.UpdatedBy
                })
                .OrderBy(at => at.Name)
                .ToList();

            var response = new PaginatedResponse<AllowanceTypeResponseDto>
            {
                Data = pagedTypes,
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
            _logger.LogError(ex, "Error retrieving allowance types");
            return StatusCode(500, "An error occurred while retrieving allowance types");
        }
    }

    // GET: api/allowancetypes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<AllowanceTypeResponseDto>> GetAllowanceType(int id)
    {
        try
        {
            var allowanceType = await _unitOfWork.AllowanceTypes.GetByIdAsync(id);

            if (allowanceType == null || allowanceType.Deleted)
            {
                return NotFound($"Allowance type with ID {id} not found");
            }

            var responseDto = new AllowanceTypeResponseDto
            {
                PK = allowanceType.PK,
                Name = allowanceType.Name,
                Description = allowanceType.Description,
                CreatedAt = allowanceType.CreatedAt,
                UpdatedAt = allowanceType.UpdatedAt,
                CreatedBy = allowanceType.CreatedBy,
                UpdatedBy = allowanceType.UpdatedBy
            };

            return Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance type with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the allowance type");
        }
    }

    // POST: api/allowancetypes
    [HttpPost]
    public async Task<ActionResult<AllowanceTypeResponseDto>> CreateAllowanceType(CreateAllowanceTypeDto createDto)
    {
        try
        {
            // Check if allowance type with same name already exists
            var isUnique = await _unitOfWork.AllowanceTypes.IsNameUniqueAsync(createDto.Name);

            if (!isUnique)
            {
                return BadRequest($"Allowance type with name '{createDto.Name}' already exists");
            }

            var allowanceType = new AllowanceType
            {
                Name = createDto.Name,
                Description = createDto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = "System", // TODO: Get from authenticated user
                UpdatedBy = "System"  // TODO: Get from authenticated user
            };

            await _unitOfWork.AllowanceTypes.AddAsync(allowanceType);
            await _unitOfWork.SaveChangesAsync();

            var responseDto = new AllowanceTypeResponseDto
            {
                PK = allowanceType.PK,
                Name = allowanceType.Name,
                Description = allowanceType.Description,
                CreatedAt = allowanceType.CreatedAt,
                UpdatedAt = allowanceType.UpdatedAt,
                CreatedBy = allowanceType.CreatedBy,
                UpdatedBy = allowanceType.UpdatedBy
            };

            return CreatedAtAction(nameof(GetAllowanceType), new { id = allowanceType.PK }, responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating allowance type");
            return StatusCode(500, "An error occurred while creating the allowance type");
        }
    }

    // PUT: api/allowancetypes/5
    [HttpPut("{id}")]
    public async Task<ActionResult<AllowanceTypeResponseDto>> UpdateAllowanceType(int id, UpdateAllowanceTypeDto updateDto)
    {
        try
        {
            var allowanceType = await _unitOfWork.AllowanceTypes.GetByIdAsync(id);

            if (allowanceType == null || allowanceType.Deleted)
            {
                return NotFound($"Allowance type with ID {id} not found");
            }

            // Check if another allowance type with the same name exists (if name is being updated)
            if (!string.IsNullOrEmpty(updateDto.Name) && updateDto.Name != allowanceType.Name)
            {
                var isUnique = await _unitOfWork.AllowanceTypes.IsNameUniqueAsync(updateDto.Name, id);

                if (!isUnique)
                {
                    return BadRequest($"Allowance type with name '{updateDto.Name}' already exists");
                }
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateDto.Name))
            {
                allowanceType.Name = updateDto.Name;
            }

            if (updateDto.Description != null)
            {
                allowanceType.Description = updateDto.Description;
            }

            allowanceType.UpdatedAt = DateTime.UtcNow;
            allowanceType.UpdatedBy = "System"; // TODO: Get from authenticated user

            await _unitOfWork.SaveChangesAsync();

            var responseDto = new AllowanceTypeResponseDto
            {
                PK = allowanceType.PK,
                Name = allowanceType.Name,
                Description = allowanceType.Description,
                CreatedAt = allowanceType.CreatedAt,
                UpdatedAt = allowanceType.UpdatedAt,
                CreatedBy = allowanceType.CreatedBy,
                UpdatedBy = allowanceType.UpdatedBy
            };

            return Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating allowance type with ID {Id}", id);
            return StatusCode(500, "An error occurred while updating the allowance type");
        }
    }

    // DELETE: api/allowancetypes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAllowanceType(int id)
    {
        try
        {
            var allowanceType = await _unitOfWork.AllowanceTypes.GetByIdAsync(id);

            if (allowanceType == null || allowanceType.Deleted)
            {
                return NotFound($"Allowance type with ID {id} not found");
            }

            // Check if any allowances are using this type
            var hasAllowances = await _unitOfWork.AllowanceTypes.HasAllowancesAsync(id);

            if (hasAllowances)
            {
                return BadRequest("Cannot delete allowance type as it is being used by existing allowances");
            }

            // Soft delete
            allowanceType.Deleted = true;
            allowanceType.UpdatedAt = DateTime.UtcNow;
            allowanceType.UpdatedBy = "System"; // TODO: Get from authenticated user

            await _unitOfWork.AllowanceTypes.UpdateAsync(allowanceType);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting allowance type with ID {Id}", id);
            return StatusCode(500, "An error occurred while deleting the allowance type");
        }
    }

    // GET: api/allowancetypes/lookup
    [HttpGet("lookup")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetAllowanceTypesLookup([FromQuery] string? searchTerm = null)
    {
        try
        {
            var allowanceTypes = string.IsNullOrEmpty(searchTerm)
                ? await _unitOfWork.AllowanceTypes.GetAllAsync()
                : await _unitOfWork.AllowanceTypes.SearchAllowanceTypesAsync(searchTerm);

            var lookupData = allowanceTypes
                .Where(at => !at.Deleted)
                .Select(at => new LookupDto
                {
                    PK = at.PK,
                    Name = at.Name,
                    Description = at.Description
                })
                .OrderBy(at => at.Name)
                .ToList();

            return Ok(allowanceTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance types for lookup");
            return StatusCode(500, "An error occurred while retrieving allowance types");
        }
    }
}
