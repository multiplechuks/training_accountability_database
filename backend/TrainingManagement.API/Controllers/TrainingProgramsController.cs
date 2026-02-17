using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

/// <summary>
/// Simplified Training Programs Controller
/// Manages training programs (institutions, programs, specialties)
/// For use with 6-form enrollment workflow
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TrainingProgramsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TrainingProgramsController> _logger;

    public TrainingProgramsController(IUnitOfWork unitOfWork, ILogger<TrainingProgramsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all training programs with optional pagination and filtering
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllPrograms(
        [FromQuery] string? search = null,
        [FromQuery] string? country = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var trainings = await _unitOfWork.Trainings.GetAllAsync();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                trainings = trainings.Where(t =>
                    t.Institution.ToLower().Contains(search) ||
                    t.Program.ToLower().Contains(search) ||
                    (t.Specialty != null && t.Specialty.ToLower().Contains(search)));
            }

            if (!string.IsNullOrEmpty(country))
            {
                trainings = trainings.Where(t => t.CountryOfStudy.Equals(country, StringComparison.OrdinalIgnoreCase));
            }

            var totalCount = trainings.Count();
            var pagedTrainings = trainings
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TrainingProgramDto
                {
                    Id = t.PK,
                    Institution = t.Institution,
                    Program = t.Program,
                    Specialty = t.Specialty,
                    CountryOfStudy = t.CountryOfStudy,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Duration = t.Duration,
                    ModeOfStudy = t.ModeOfStudy,
                    CampusType = t.CampusType
                }).ToList();

            return Ok(new
            {
                data = pagedTrainings,
                total = totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving training programs");
            return StatusCode(500, new { message = "An error occurred while retrieving training programs" });
        }
    }

    /// <summary>
    /// Get a specific training program by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProgram(int id)
    {
        try
        {
            var training = await _unitOfWork.Trainings.GetByIdAsync(id);

            if (training == null)
            {
                return NotFound(new { message = "Training program not found" });
            }

            var response = new TrainingProgramDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                Specialty = training.Specialty,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                ModeOfStudy = training.ModeOfStudy,
                CampusType = training.CampusType
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving training program {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the training program" });
        }
    }

    /// <summary>
    /// Create a new training program
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateProgram([FromBody] CreateTrainingProgramDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var training = new Training
            {
                Institution = dto.Institution,
                Program = dto.Program,
                Specialty = dto.Specialty,
                CountryOfStudy = dto.CountryOfStudy,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Duration = dto.Duration,
                ModeOfStudy = dto.ModeOfStudy,
                CampusType = dto.CampusType
            };

            await _unitOfWork.Trainings.AddAsync(training);
            await _unitOfWork.SaveChangesAsync();

            var response = new TrainingProgramDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                Specialty = training.Specialty,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                ModeOfStudy = training.ModeOfStudy,
                CampusType = training.CampusType
            };

            return CreatedAtAction(nameof(GetProgram), new { id = training.PK }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating training program");
            return StatusCode(500, new { message = "An error occurred while creating the training program" });
        }
    }

    /// <summary>
    /// Update an existing training program
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProgram(int id, [FromBody] UpdateTrainingProgramDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var training = await _unitOfWork.Trainings.GetByIdAsync(id);
            if (training == null)
            {
                return NotFound(new { message = "Training program not found" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(dto.Institution))
            {
                training.Institution = dto.Institution;
            }

            if (!string.IsNullOrEmpty(dto.Program))
            {
                training.Program = dto.Program;
            }

            if (dto.Specialty != null)
            {
                training.Specialty = dto.Specialty;
            }

            if (!string.IsNullOrEmpty(dto.CountryOfStudy))
            {
                training.CountryOfStudy = dto.CountryOfStudy;
            }

            if (dto.StartDate.HasValue)
            {
                training.StartDate = dto.StartDate.Value;
            }

            if (dto.EndDate.HasValue)
            {
                training.EndDate = dto.EndDate.Value;
            }

            if (dto.Duration.HasValue)
            {
                training.Duration = dto.Duration.Value;
            }

            if (!string.IsNullOrEmpty(dto.ModeOfStudy))
            {
                training.ModeOfStudy = dto.ModeOfStudy;
            }

            if (!string.IsNullOrEmpty(dto.CampusType))
            {
                training.CampusType = dto.CampusType;
            }

            await _unitOfWork.Trainings.UpdateAsync(training);
            await _unitOfWork.SaveChangesAsync();

            var response = new TrainingProgramDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                Specialty = training.Specialty,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                ModeOfStudy = training.ModeOfStudy,
                CampusType = training.CampusType
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating training program {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the training program" });
        }
    }

    /// <summary>
    /// Delete a training program
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProgram(int id)
    {
        try
        {
            var training = await _unitOfWork.Trainings.GetByIdAsync(id);
            if (training == null)
            {
                return NotFound(new { message = "Training program not found" });
            }

            await _unitOfWork.Trainings.DeleteAsync(training);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting training program {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the training program" });
        }
    }

    /// <summary>
    /// Get list of unique countries offering training programs
    /// </summary>
    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        try
        {
            var trainings = await _unitOfWork.Trainings.GetAllAsync();
            var countries = trainings
                .Select(t => t.CountryOfStudy)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(countries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving countries");
            return StatusCode(500, new { message = "An error occurred while retrieving countries" });
        }
    }

    /// <summary>
    /// Get list of unique institutions
    /// </summary>
    [HttpGet("institutions")]
    public async Task<IActionResult> GetInstitutions([FromQuery] string? country = null)
    {
        try
        {
            var trainings = await _unitOfWork.Trainings.GetAllAsync();

            if (!string.IsNullOrEmpty(country))
            {
                trainings = trainings.Where(t => t.CountryOfStudy.Equals(country, StringComparison.OrdinalIgnoreCase));
            }

            var institutions = trainings
                .Select(t => t.Institution)
                .Distinct()
                .OrderBy(i => i)
                .ToList();

            return Ok(institutions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving institutions");
            return StatusCode(500, new { message = "An error occurred while retrieving institutions" });
        }
    }
}

// DTOs for Training Programs
public class TrainingProgramDto
{
    public int Id { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string? Specialty { get; set; }
    public string CountryOfStudy { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Duration { get; set; }
    public string ModeOfStudy { get; set; } = string.Empty;
    public string CampusType { get; set; } = string.Empty;
}

public class CreateTrainingProgramDto
{
    public string Institution { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string? Specialty { get; set; }
    public string CountryOfStudy { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Duration { get; set; }
    public string ModeOfStudy { get; set; } = string.Empty;
    public string CampusType { get; set; } = string.Empty;
}

public class UpdateTrainingProgramDto
{
    public string? Institution { get; set; }
    public string? Program { get; set; }
    public string? Specialty { get; set; }
    public string? CountryOfStudy { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Duration { get; set; }
    public string? ModeOfStudy { get; set; }
    public string? CampusType { get; set; }
}
