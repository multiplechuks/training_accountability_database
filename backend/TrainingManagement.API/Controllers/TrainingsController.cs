using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TrainingsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TrainingsController> _logger;

    public TrainingsController(IUnitOfWork unitOfWork, ILogger<TrainingsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all trainings with optional pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTrainings([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var trainings = await _unitOfWork.Trainings.GetAllAsync();
            var totalCount = trainings.Count();
            var pagedTrainings = trainings
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TrainingResponseDto
                {
                    Id = t.PK,
                    Institution = t.Institution,
                    Program = t.Program,
                    CountryOfStudy = t.CountryOfStudy,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Duration = t.Duration,
                    DepartureDate = t.DepartureDate,
                    ArrivalDate = t.ArrivalDate,
                    VacationEmploymentPeriod = t.VacationEmploymentPeriod,
                    ResumptionDate = t.ResumptionDate,
                    ExtensionPeriod = t.ExtensionPeriod,
                    DateBondSigned = t.DateBondSigned,
                    BondServingPeriod = t.BondServingPeriod,
                    SponsorFK = t.SponsorFK,
                    ModeOfStudy = t.ModeOfStudy,
                    RegistrationDate = t.RegistrationDate,
                    TrainingStatus = t.TrainingStatus,
                    FinancialYear = t.FinancialYear,
                    CampusType = t.CampusType,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
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
            _logger.LogError(ex, "Error retrieving trainings");
            return StatusCode(500, new { message = "An error occurred while retrieving trainings" });
        }
    }

    /// <summary>
    /// Get a training by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTraining(int id)
    {
        try
        {
            var training = await _unitOfWork.Trainings.GetByIdAsync(id);

            if (training == null)
            {
                return NotFound(new { message = "Training not found" });
            }

            var response = new TrainingResponseDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                DepartureDate = training.DepartureDate,
                ArrivalDate = training.ArrivalDate,
                VacationEmploymentPeriod = training.VacationEmploymentPeriod,
                ResumptionDate = training.ResumptionDate,
                ExtensionPeriod = training.ExtensionPeriod,
                DateBondSigned = training.DateBondSigned,
                BondServingPeriod = training.BondServingPeriod,
                SponsorFK = training.SponsorFK,
                ModeOfStudy = training.ModeOfStudy,
                RegistrationDate = training.RegistrationDate,
                TrainingStatus = training.TrainingStatus,
                FinancialYear = training.FinancialYear,
                CampusType = training.CampusType,
                CreatedAt = training.CreatedAt,
                UpdatedAt = training.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving training with ID {TrainingId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the training" });
        }
    }

    /// <summary>
    /// Get a training with its participants
    /// </summary>
    [HttpGet("{id}/participants")]
    public async Task<IActionResult> GetTrainingWithParticipants(int id)
    {
        try
        {
            var training = await _unitOfWork.Trainings.GetWithParticipantsAsync(id);

            if (training == null)
            {
                return NotFound(new { message = "Training not found" });
            }

            var response = new TrainingWithParticipantsDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                DepartureDate = training.DepartureDate,
                ArrivalDate = training.ArrivalDate,
                VacationEmploymentPeriod = training.VacationEmploymentPeriod,
                ResumptionDate = training.ResumptionDate,
                ExtensionPeriod = training.ExtensionPeriod,
                DateBondSigned = training.DateBondSigned,
                BondServingPeriod = training.BondServingPeriod,
                SponsorFK = training.SponsorFK,
                ModeOfStudy = training.ModeOfStudy,
                RegistrationDate = training.RegistrationDate,
                TrainingStatus = training.TrainingStatus,
                FinancialYear = training.FinancialYear,
                CampusType = training.CampusType,
                CreatedAt = training.CreatedAt,
                UpdatedAt = training.UpdatedAt,
                Participants = training.ParticipantEnrollments.Select(e => new TrainingParticipantSummaryDto
                {
                    Id = e.Participant?.PK ?? 0,
                    FullName = e.Participant?.FullName ?? "N/A",
                    IdNo = e.Participant?.IdNo ?? "N/A",
                    Email = e.Participant?.Email ?? "N/A",
                    Phone = e.Participant?.Phone ?? "N/A",
                    EnrollmentDate = e.CreatedAt
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving training with participants for ID {TrainingId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the training with participants" });
        }
    }

    /// <summary>
    /// Search trainings by program, institution, or country
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchTrainings([FromQuery] SearchQuery query)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 10 : query.PageSize > 100 ? 100 : query.PageSize;
        var searchTerm = query.SearchTerm;
        try
        {
            IEnumerable<Training> trainings = null!;
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                trainings = await _unitOfWork.Trainings.SearchTrainingsAsync(searchTerm);
            }
            else
            {
                trainings = await _unitOfWork.Trainings.GetAllAsync();
            }
            var totalCount = trainings.Count();
            var response = trainings
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TrainingResponseDto
            {
                Id = t.PK,
                Institution = t.Institution,
                Program = t.Program,
                CountryOfStudy = t.CountryOfStudy,
                StartDate = t.StartDate,
                EndDate = t.EndDate,
                Duration = t.Duration,
                DepartureDate = t.DepartureDate,
                ArrivalDate = t.ArrivalDate,
                VacationEmploymentPeriod = t.VacationEmploymentPeriod,
                ResumptionDate = t.ResumptionDate,
                ExtensionPeriod = t.ExtensionPeriod,
                DateBondSigned = t.DateBondSigned,
                BondServingPeriod = t.BondServingPeriod,
                SponsorFK = t.SponsorFK,
                ModeOfStudy = t.ModeOfStudy,
                RegistrationDate = t.RegistrationDate,
                TrainingStatus = t.TrainingStatus,
                FinancialYear = t.FinancialYear,
                CampusType = t.CampusType,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
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
            _logger.LogError(ex, "Error searching trainings with term {SearchTerm}", searchTerm);
            return StatusCode(500, new { message = "An error occurred while searching trainings" });
        }
    }

    /// <summary>
    /// Get active trainings
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveTrainings()
    {
        try
        {
            var trainings = await _unitOfWork.Trainings.GetActiveTrainingsAsync();

            var response = trainings.Select(t => new TrainingResponseDto
            {
                Id = t.PK,
                Institution = t.Institution,
                Program = t.Program,
                CountryOfStudy = t.CountryOfStudy,
                StartDate = t.StartDate,
                EndDate = t.EndDate,
                Duration = t.Duration,
                DepartureDate = t.DepartureDate,
                ArrivalDate = t.ArrivalDate,
                VacationEmploymentPeriod = t.VacationEmploymentPeriod,
                ResumptionDate = t.ResumptionDate,
                ExtensionPeriod = t.ExtensionPeriod,
                DateBondSigned = t.DateBondSigned,
                BondServingPeriod = t.BondServingPeriod,
                SponsorFK = t.SponsorFK,
                ModeOfStudy = t.ModeOfStudy,
                RegistrationDate = t.RegistrationDate,
                TrainingStatus = t.TrainingStatus,
                FinancialYear = t.FinancialYear,
                CampusType = t.CampusType,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            }).ToList();

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active trainings");
            return StatusCode(500, new { message = "An error occurred while retrieving active trainings" });
        }
    }

    /// <summary>
    /// Get trainings by financial year
    /// </summary>
    [HttpGet("financial-year/{financialYear}")]
    public async Task<IActionResult> GetTrainingsByFinancialYear(string financialYear)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(financialYear))
            {
                return BadRequest(new { message = "Financial year cannot be empty" });
            }

            var trainings = await _unitOfWork.Trainings.GetTrainingsByFinancialYearAsync(financialYear);

            var response = trainings.Select(t => new TrainingResponseDto
            {
                Id = t.PK,
                Institution = t.Institution,
                Program = t.Program,
                CountryOfStudy = t.CountryOfStudy,
                StartDate = t.StartDate,
                EndDate = t.EndDate,
                Duration = t.Duration,
                DepartureDate = t.DepartureDate,
                ArrivalDate = t.ArrivalDate,
                VacationEmploymentPeriod = t.VacationEmploymentPeriod,
                ResumptionDate = t.ResumptionDate,
                ExtensionPeriod = t.ExtensionPeriod,
                DateBondSigned = t.DateBondSigned,
                BondServingPeriod = t.BondServingPeriod,
                SponsorFK = t.SponsorFK,
                ModeOfStudy = t.ModeOfStudy,
                RegistrationDate = t.RegistrationDate,
                TrainingStatus = t.TrainingStatus,
                FinancialYear = t.FinancialYear,
                CampusType = t.CampusType,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            }).ToList();

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving trainings for financial year {FinancialYear}", financialYear);
            return StatusCode(500, new { message = "An error occurred while retrieving trainings for the specified financial year" });
        }
    }

    /// <summary>
    /// Create a new training
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTraining([FromBody] CreateTrainingDto dto)
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
                CountryOfStudy = dto.CountryOfStudy,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Duration = dto.Duration,
                DepartureDate = dto.DepartureDate,
                ArrivalDate = dto.ArrivalDate,
                VacationEmploymentPeriod = dto.VacationEmploymentPeriod,
                ResumptionDate = dto.ResumptionDate,
                ExtensionPeriod = dto.ExtensionPeriod,
                DateBondSigned = dto.DateBondSigned,
                BondServingPeriod = dto.BondServingPeriod,
                SponsorFK = dto.SponsorFK,
                ModeOfStudy = dto.ModeOfStudy,
                TrainingStatus = dto.TrainingStatus,
                FinancialYear = dto.FinancialYear,
                CampusType = dto.CampusType,
                RegistrationDate = DateTime.UtcNow
            };

            await _unitOfWork.Trainings.AddAsync(training);
            await _unitOfWork.SaveChangesAsync();

            var response = new TrainingResponseDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                DepartureDate = training.DepartureDate,
                ArrivalDate = training.ArrivalDate,
                VacationEmploymentPeriod = training.VacationEmploymentPeriod,
                ResumptionDate = training.ResumptionDate,
                ExtensionPeriod = training.ExtensionPeriod,
                DateBondSigned = training.DateBondSigned,
                BondServingPeriod = training.BondServingPeriod,
                SponsorFK = training.SponsorFK,
                ModeOfStudy = training.ModeOfStudy,
                RegistrationDate = training.RegistrationDate,
                TrainingStatus = training.TrainingStatus,
                FinancialYear = training.FinancialYear,
                CampusType = training.CampusType,
                CreatedAt = training.CreatedAt,
                UpdatedAt = training.UpdatedAt
            };

            return CreatedAtAction(nameof(GetTraining), new { id = training.PK }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating training");
            return StatusCode(500, new { message = "An error occurred while creating the training" });
        }
    }

    /// <summary>
    /// Update an existing training
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTraining(int id, [FromBody] UpdateTrainingDto dto)
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
                return NotFound(new { message = "Training not found" });
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

            if (dto.DepartureDate.HasValue)
            {
                training.DepartureDate = dto.DepartureDate;
            }

            if (dto.ArrivalDate.HasValue)
            {
                training.ArrivalDate = dto.ArrivalDate;
            }

            if (dto.VacationEmploymentPeriod != null)
            {
                training.VacationEmploymentPeriod = dto.VacationEmploymentPeriod;
            }

            if (dto.ResumptionDate.HasValue)
            {
                training.ResumptionDate = dto.ResumptionDate;
            }

            if (dto.ExtensionPeriod != null)
            {
                training.ExtensionPeriod = dto.ExtensionPeriod;
            }

            if (dto.DateBondSigned.HasValue)
            {
                training.DateBondSigned = dto.DateBondSigned;
            }

            if (dto.BondServingPeriod != null)
            {
                training.BondServingPeriod = dto.BondServingPeriod;
            }

            if (dto.SponsorFK.HasValue)
            {
                training.SponsorFK = dto.SponsorFK;
            }

            if (!string.IsNullOrEmpty(dto.ModeOfStudy))
            {
                training.ModeOfStudy = dto.ModeOfStudy;
            }

            if (!string.IsNullOrEmpty(dto.TrainingStatus))
            {
                training.TrainingStatus = dto.TrainingStatus;
            }

            if (!string.IsNullOrEmpty(dto.FinancialYear))
            {
                training.FinancialYear = dto.FinancialYear;
            }

            if (!string.IsNullOrEmpty(dto.CampusType))
            {
                training.CampusType = dto.CampusType;
            }

            await _unitOfWork.Trainings.UpdateAsync(training);
            await _unitOfWork.SaveChangesAsync();

            var response = new TrainingResponseDto
            {
                Id = training.PK,
                Institution = training.Institution,
                Program = training.Program,
                CountryOfStudy = training.CountryOfStudy,
                StartDate = training.StartDate,
                EndDate = training.EndDate,
                Duration = training.Duration,
                DepartureDate = training.DepartureDate,
                ArrivalDate = training.ArrivalDate,
                VacationEmploymentPeriod = training.VacationEmploymentPeriod,
                ResumptionDate = training.ResumptionDate,
                ExtensionPeriod = training.ExtensionPeriod,
                DateBondSigned = training.DateBondSigned,
                BondServingPeriod = training.BondServingPeriod,
                SponsorFK = training.SponsorFK,
                ModeOfStudy = training.ModeOfStudy,
                RegistrationDate = training.RegistrationDate,
                TrainingStatus = training.TrainingStatus,
                FinancialYear = training.FinancialYear,
                CampusType = training.CampusType,
                CreatedAt = training.CreatedAt,
                UpdatedAt = training.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating training with ID {TrainingId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the training" });
        }
    }

    /// <summary>
    /// Delete a training
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTraining(int id)
    {
        try
        {
            var training = await _unitOfWork.Trainings.GetByIdAsync(id);
            if (training == null)
            {
                return NotFound(new { message = "Training not found" });
            }

            // Check if training has participants
            var hasParticipants = await _unitOfWork.ParticipantEnrollments.GetByTrainingAsync(id);
            if (hasParticipants.Any())
            {
                return BadRequest(new { message = "Cannot delete training with existing participants" });
            }

            await _unitOfWork.Trainings.DeleteAsync(training);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Training deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting training with ID {TrainingId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the training" });
        }
    }
}
