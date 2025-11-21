using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TrainingEnrollmentController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TrainingEnrollmentController> _logger;

    public TrainingEnrollmentController(IUnitOfWork unitOfWork, ILogger<TrainingEnrollmentController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all enrollments with optional pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetEnrollments([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var enrollments = await _unitOfWork.ParticipantEnrollments.GetAllAsync();

            var totalCount = enrollments.Count();
            var pagedEnrollments = enrollments
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new ParticipantEnrollmentResponseDto
                {
                    PK = e.PK,
                    ParticipantFK = e.ParticipantFK,
                    TrainingFK = e.TrainingFK,
                    DesignationFK = e.DesignationFK,
                    SalaryScaleFK = e.SalaryScaleFK,
                    DepartmentFK = e.DepartmentFK,
                    FacilityFK = e.FacilityFK,
                    PayrollDate = e.PayrollDate,
                    StudyLeaveDate = e.StudyLeaveDate,
                    AllowanceStoppageDate = e.AllowanceStoppageDate,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Duration = e.Duration,
                    NeedingTravel = e.NeedingTravel,
                    DepartureDate = e.DepartureDate,
                    ArrivalDate = e.ArrivalDate,
                    DateBondSigned = e.DateBondSigned,
                    BondServingPeriod = e.BondServingPeriod,
                    SponsorFK = e.SponsorFK,
                    ModeOfStudy = e.ModeOfStudy,
                    RegistrationDate = e.RegistrationDate,
                    TrainingStatus = e.TrainingStatus,
                    FinancialYear = e.FinancialYear,
                    CampusType = e.CampusType,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                    Participant = e.Participant != null ? new ParticipantSummaryDto
                    {
                        PK = e.Participant.PK,
                        Title = e.Participant.Title ?? string.Empty,
                        Firstname = e.Participant.Firstname,
                        Lastname = e.Participant.Lastname,
                        Middlename = e.Participant.Middlename,
                        IdNo = e.Participant.IdNo,
                        Email = e.Participant.Email,
                        Phone = e.Participant.Phone,
                        FullName = e.Participant.FullName
                    } : null,
                    Training = e.Training != null ? new TrainingSummaryDto
                    {
                        PK = e.Training.PK,
                        Institution = e.Training.Institution,
                        Program = e.Training.Program,
                        CountryOfStudy = e.Training.CountryOfStudy,
                        StartDate = e.Training.StartDate,
                        EndDate = e.Training.EndDate,
                        Duration = e.Training.Duration,
                        FinancialYear = e.Training.FinancialYear
                    } : null
                }).ToList();

            return Ok(new
            {
                data = pagedEnrollments,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollments");
            return StatusCode(500, new { message = "An error occurred while retrieving enrollments" });
        }
    }

    /// <summary>
    /// Get an enrollment by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEnrollment(int id)
    {
        try
        {
            var enrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(id);

            if (enrollment == null)
            {
                return NotFound(new { message = "Enrollment not found" });
            }

            var response = new ParticipantEnrollmentResponseDto
            {
                PK = enrollment.PK,
                ParticipantFK = enrollment.ParticipantFK,
                TrainingFK = enrollment.TrainingFK,
                DesignationFK = enrollment.DesignationFK,
                SalaryScaleFK = enrollment.SalaryScaleFK,
                DepartmentFK = enrollment.DepartmentFK,
                FacilityFK = enrollment.FacilityFK,
                PayrollDate = enrollment.PayrollDate,
                StudyLeaveDate = enrollment.StudyLeaveDate,
                AllowanceStoppageDate = enrollment.AllowanceStoppageDate,
                StartDate = enrollment.StartDate,
                EndDate = enrollment.EndDate,
                Duration = enrollment.Duration,
                NeedingTravel = enrollment.NeedingTravel,
                DepartureDate = enrollment.DepartureDate,
                ArrivalDate = enrollment.ArrivalDate,
                DateBondSigned = enrollment.DateBondSigned,
                BondServingPeriod = enrollment.BondServingPeriod,
                SponsorFK = enrollment.SponsorFK,
                ModeOfStudy = enrollment.ModeOfStudy,
                RegistrationDate = enrollment.RegistrationDate,
                TrainingStatus = enrollment.TrainingStatus,
                FinancialYear = enrollment.FinancialYear,
                CampusType = enrollment.CampusType,
                CreatedAt = enrollment.CreatedAt,
                UpdatedAt = enrollment.UpdatedAt,
                Participant = enrollment.Participant != null ? new ParticipantSummaryDto
                {
                    PK = enrollment.Participant.PK,
                    Title = enrollment.Participant.Title ?? string.Empty,
                    Firstname = enrollment.Participant.Firstname,
                    Lastname = enrollment.Participant.Lastname,
                    Middlename = enrollment.Participant.Middlename,
                    IdNo = enrollment.Participant.IdNo,
                    Email = enrollment.Participant.Email,
                    Phone = enrollment.Participant.Phone,
                    FullName = enrollment.Participant.FullName
                } : null,
                Training = enrollment.Training != null ? new TrainingSummaryDto
                {
                    PK = enrollment.Training.PK,
                    Institution = enrollment.Training.Institution,
                    Program = enrollment.Training.Program,
                    CountryOfStudy = enrollment.Training.CountryOfStudy,
                    StartDate = enrollment.Training.StartDate,
                    EndDate = enrollment.Training.EndDate,
                    Duration = enrollment.Training.Duration,
                    FinancialYear = enrollment.Training.FinancialYear
                } : null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollment with ID {EnrollmentId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the enrollment" });
        }
    }

    /// <summary>
    /// Get enrollments by participant ID
    /// </summary>
    [HttpGet("participant/{participantId}")]
    public async Task<IActionResult> GetEnrollmentsByParticipant(int participantId)
    {
        try
        {
            var enrollments = await _unitOfWork.ParticipantEnrollments.GetByParticipantAsync(participantId);

            var response = enrollments.Select(e => new ParticipantEnrollmentResponseDto
            {
                PK = e.PK,
                ParticipantFK = e.ParticipantFK,
                TrainingFK = e.TrainingFK,
                DesignationFK = e.DesignationFK,
                SalaryScaleFK = e.SalaryScaleFK,
                DepartmentFK = e.DepartmentFK,
                FacilityFK = e.FacilityFK,
                PayrollDate = e.PayrollDate,
                StudyLeaveDate = e.StudyLeaveDate,
                AllowanceStoppageDate = e.AllowanceStoppageDate,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Duration = e.Duration,
                NeedingTravel = e.NeedingTravel,
                DepartureDate = e.DepartureDate,
                ArrivalDate = e.ArrivalDate,
                DateBondSigned = e.DateBondSigned,
                BondServingPeriod = e.BondServingPeriod,
                SponsorFK = e.SponsorFK,
                ModeOfStudy = e.ModeOfStudy,
                RegistrationDate = e.RegistrationDate,
                TrainingStatus = e.TrainingStatus,
                FinancialYear = e.FinancialYear,
                CampusType = e.CampusType,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
                Participant = e.Participant != null ? new ParticipantSummaryDto
                {
                    PK = e.Participant.PK,
                    Title = e.Participant.Title ?? string.Empty,
                    Firstname = e.Participant.Firstname,
                    Lastname = e.Participant.Lastname,
                    Middlename = e.Participant.Middlename,
                    IdNo = e.Participant.IdNo,
                    Email = e.Participant.Email,
                    Phone = e.Participant.Phone,
                    FullName = e.Participant.FullName
                } : null,
                Training = e.Training != null ? new TrainingSummaryDto
                {
                    PK = e.Training.PK,
                    Institution = e.Training.Institution,
                    Program = e.Training.Program,
                    CountryOfStudy = e.Training.CountryOfStudy,
                    StartDate = e.Training.StartDate,
                    EndDate = e.Training.EndDate,
                    Duration = e.Training.Duration,
                    FinancialYear = e.Training.FinancialYear
                } : null
            }).ToList();

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollments for participant {ParticipantId}", participantId);
            return StatusCode(500, new { message = "An error occurred while retrieving enrollments for the participant" });
        }
    }

    /// <summary>
    /// Get enrollments by training ID
    /// </summary>
    [HttpGet("training/{trainingId}")]
    public async Task<IActionResult> GetEnrollmentsByTraining(int trainingId)
    {
        try
        {
            var enrollments = await _unitOfWork.ParticipantEnrollments.GetByTrainingAsync(trainingId);

            var response = enrollments.Select(e => new ParticipantEnrollmentResponseDto
            {
                PK = e.PK,
                ParticipantFK = e.ParticipantFK,
                TrainingFK = e.TrainingFK,
                DesignationFK = e.DesignationFK,
                SalaryScaleFK = e.SalaryScaleFK,
                DepartmentFK = e.DepartmentFK,
                FacilityFK = e.FacilityFK,
                PayrollDate = e.PayrollDate,
                StudyLeaveDate = e.StudyLeaveDate,
                AllowanceStoppageDate = e.AllowanceStoppageDate,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Duration = e.Duration,
                NeedingTravel = e.NeedingTravel,
                DepartureDate = e.DepartureDate,
                ArrivalDate = e.ArrivalDate,
                DateBondSigned = e.DateBondSigned,
                BondServingPeriod = e.BondServingPeriod,
                SponsorFK = e.SponsorFK,
                ModeOfStudy = e.ModeOfStudy,
                RegistrationDate = e.RegistrationDate,
                TrainingStatus = e.TrainingStatus,
                FinancialYear = e.FinancialYear,
                CampusType = e.CampusType,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
                Participant = e.Participant != null ? new ParticipantSummaryDto
                {
                    PK = e.Participant.PK,
                    Title = e.Participant.Title ?? string.Empty,
                    Firstname = e.Participant.Firstname,
                    Lastname = e.Participant.Lastname,
                    Middlename = e.Participant.Middlename,
                    IdNo = e.Participant.IdNo,
                    Email = e.Participant.Email,
                    Phone = e.Participant.Phone,
                    FullName = e.Participant.FullName
                } : null,
                Training = e.Training != null ? new TrainingSummaryDto
                {
                    PK = e.Training.PK,
                    Institution = e.Training.Institution,
                    Program = e.Training.Program,
                    CountryOfStudy = e.Training.CountryOfStudy,
                    StartDate = e.Training.StartDate,
                    EndDate = e.Training.EndDate,
                    Duration = e.Training.Duration,
                    FinancialYear = e.Training.FinancialYear
                } : null
            }).ToList();

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving enrollments for training {TrainingId}", trainingId);
            return StatusCode(500, new { message = "An error occurred while retrieving enrollments for the training" });
        }
    }

    /// <summary>
    /// Create a new enrollment
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateEnrollment([FromBody] ParticipantEnrollmentDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if participant exists
            var participant = await _unitOfWork.Participants.GetByIdAsync(dto.ParticipantFK);
            if (participant == null)
            {
                return BadRequest(new { message = "Participant not found" });
            }

            // Check if training exists
            var training = await _unitOfWork.Trainings.GetByIdAsync(dto.TrainingFK);
            if (training == null)
            {
                return BadRequest(new { message = "Training not found" });
            }

            // Check if participant is already enrolled in this training
            var existingEnrollment = await _unitOfWork.ParticipantEnrollments
                .GetByParticipantAndTrainingAsync(dto.ParticipantFK, dto.TrainingFK);
            if (existingEnrollment != null)
            {
                return Conflict(new { message = "Participant is already enrolled in this training" });
            }

            var enrollment = new ParticipantEnrollment
            {
                ParticipantFK = dto.ParticipantFK,
                TrainingFK = dto.TrainingFK,
                DesignationFK = dto.DesignationFK,
                SalaryScaleFK = dto.SalaryScaleFK,
                DepartmentFK = dto.DepartmentFK,
                FacilityFK = dto.FacilityFK,
                PayrollDate = dto.PayrollDate,
                StudyLeaveDate = dto.StudyLeaveDate,
                AllowanceStoppageDate = dto.AllowanceStoppageDate,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Duration = dto.Duration,
                NeedingTravel = dto.NeedingTravel,
                DepartureDate = dto.DepartureDate,
                ArrivalDate = dto.ArrivalDate,
                DateBondSigned = dto.DateBondSigned,
                BondServingPeriod = dto.BondServingPeriod,
                SponsorFK = dto.SponsorFK,
                ModeOfStudy = dto.ModeOfStudy,
                RegistrationDate = dto.RegistrationDate,
                TrainingStatus = dto.TrainingStatus,
                FinancialYear = dto.FinancialYear,
                CampusType = dto.CampusType
            };

            await _unitOfWork.ParticipantEnrollments.AddAsync(enrollment);
            await _unitOfWork.SaveChangesAsync();

            // Reload enrollment with navigation properties
            var createdEnrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(enrollment.PK);
            if (createdEnrollment == null)
            {
                // Fallback to original enrollment if reload fails
                createdEnrollment = enrollment;
            }

            var response = new ParticipantEnrollmentResponseDto
            {
                PK = createdEnrollment.PK,
                ParticipantFK = createdEnrollment.ParticipantFK,
                TrainingFK = createdEnrollment.TrainingFK,
                DesignationFK = createdEnrollment.DesignationFK,
                SalaryScaleFK = createdEnrollment.SalaryScaleFK,
                DepartmentFK = createdEnrollment.DepartmentFK,
                FacilityFK = createdEnrollment.FacilityFK,
                PayrollDate = createdEnrollment.PayrollDate,
                StudyLeaveDate = createdEnrollment.StudyLeaveDate,
                AllowanceStoppageDate = createdEnrollment.AllowanceStoppageDate,
                StartDate = createdEnrollment.StartDate,
                EndDate = createdEnrollment.EndDate,
                Duration = createdEnrollment.Duration,
                NeedingTravel = createdEnrollment.NeedingTravel,
                DepartureDate = createdEnrollment.DepartureDate,
                ArrivalDate = createdEnrollment.ArrivalDate,
                DateBondSigned = createdEnrollment.DateBondSigned,
                BondServingPeriod = createdEnrollment.BondServingPeriod,
                SponsorFK = createdEnrollment.SponsorFK,
                ModeOfStudy = createdEnrollment.ModeOfStudy,
                RegistrationDate = createdEnrollment.RegistrationDate,
                TrainingStatus = createdEnrollment.TrainingStatus,
                FinancialYear = createdEnrollment.FinancialYear,
                CampusType = createdEnrollment.CampusType,
                CreatedAt = createdEnrollment.CreatedAt,
                UpdatedAt = createdEnrollment.UpdatedAt,
                Participant = createdEnrollment.Participant != null ? new ParticipantSummaryDto
                {
                    PK = createdEnrollment.Participant.PK,
                    Title = createdEnrollment.Participant.Title ?? string.Empty,
                    Firstname = createdEnrollment.Participant.Firstname,
                    Lastname = createdEnrollment.Participant.Lastname,
                    Middlename = createdEnrollment.Participant.Middlename,
                    IdNo = createdEnrollment.Participant.IdNo,
                    Email = createdEnrollment.Participant.Email,
                    Phone = createdEnrollment.Participant.Phone,
                    FullName = createdEnrollment.Participant.FullName
                } : null,
                Training = createdEnrollment.Training != null ? new TrainingSummaryDto
                {
                    PK = createdEnrollment.Training.PK,
                    Institution = createdEnrollment.Training.Institution,
                    Program = createdEnrollment.Training.Program,
                    CountryOfStudy = createdEnrollment.Training.CountryOfStudy,
                    StartDate = createdEnrollment.Training.StartDate,
                    EndDate = createdEnrollment.Training.EndDate,
                    Duration = createdEnrollment.Training.Duration,
                    FinancialYear = createdEnrollment.Training.FinancialYear
                } : null
            };

            return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.PK }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating enrollment");
            return StatusCode(500, new { message = "An error occurred while creating the enrollment" });
        }
    }

    /// <summary>
    /// Update an existing enrollment
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] ParticipantEnrollmentDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var enrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(id);
            if (enrollment == null)
            {
                return NotFound(new { message = "Enrollment not found" });
            }

            // Update enrollment properties
            enrollment.DesignationFK = dto.DesignationFK;
            enrollment.SalaryScaleFK = dto.SalaryScaleFK;
            enrollment.DepartmentFK = dto.DepartmentFK;
            enrollment.FacilityFK = dto.FacilityFK;
            enrollment.PayrollDate = dto.PayrollDate;
            enrollment.StudyLeaveDate = dto.StudyLeaveDate;
            enrollment.AllowanceStoppageDate = dto.AllowanceStoppageDate;
            enrollment.StartDate = dto.StartDate;
            enrollment.EndDate = dto.EndDate;
            enrollment.Duration = dto.Duration;
            enrollment.NeedingTravel = dto.NeedingTravel;
            enrollment.DepartureDate = dto.DepartureDate;
            enrollment.ArrivalDate = dto.ArrivalDate;
            enrollment.DateBondSigned = dto.DateBondSigned;
            enrollment.BondServingPeriod = dto.BondServingPeriod;
            enrollment.SponsorFK = dto.SponsorFK;
            enrollment.ModeOfStudy = dto.ModeOfStudy;
            enrollment.RegistrationDate = dto.RegistrationDate;
            enrollment.TrainingStatus = dto.TrainingStatus;
            enrollment.FinancialYear = dto.FinancialYear;
            enrollment.CampusType = dto.CampusType;

            await _unitOfWork.ParticipantEnrollments.UpdateAsync(enrollment);
            await _unitOfWork.SaveChangesAsync();

            var response = new ParticipantEnrollmentResponseDto
            {
                PK = enrollment.PK,
                ParticipantFK = enrollment.ParticipantFK,
                TrainingFK = enrollment.TrainingFK,
                DesignationFK = enrollment.DesignationFK,
                SalaryScaleFK = enrollment.SalaryScaleFK,
                DepartmentFK = enrollment.DepartmentFK,
                FacilityFK = enrollment.FacilityFK,
                PayrollDate = enrollment.PayrollDate,
                StudyLeaveDate = enrollment.StudyLeaveDate,
                AllowanceStoppageDate = enrollment.AllowanceStoppageDate,
                StartDate = enrollment.StartDate,
                EndDate = enrollment.EndDate,
                Duration = enrollment.Duration,
                NeedingTravel = enrollment.NeedingTravel,
                DepartureDate = enrollment.DepartureDate,
                ArrivalDate = enrollment.ArrivalDate,
                DateBondSigned = enrollment.DateBondSigned,
                BondServingPeriod = enrollment.BondServingPeriod,
                SponsorFK = enrollment.SponsorFK,
                ModeOfStudy = enrollment.ModeOfStudy,
                RegistrationDate = enrollment.RegistrationDate,
                TrainingStatus = enrollment.TrainingStatus,
                FinancialYear = enrollment.FinancialYear,
                CampusType = enrollment.CampusType,
                CreatedAt = enrollment.CreatedAt,
                UpdatedAt = enrollment.UpdatedAt,
                Participant = enrollment.Participant != null ? new ParticipantSummaryDto
                {
                    PK = enrollment.Participant.PK,
                    Title = enrollment.Participant.Title ?? string.Empty,
                    Firstname = enrollment.Participant.Firstname,
                    Lastname = enrollment.Participant.Lastname,
                    Middlename = enrollment.Participant.Middlename,
                    IdNo = enrollment.Participant.IdNo,
                    Email = enrollment.Participant.Email,
                    Phone = enrollment.Participant.Phone,
                    FullName = enrollment.Participant.FullName
                } : null,
                Training = enrollment.Training != null ? new TrainingSummaryDto
                {
                    PK = enrollment.Training.PK,
                    Institution = enrollment.Training.Institution,
                    Program = enrollment.Training.Program,
                    CountryOfStudy = enrollment.Training.CountryOfStudy,
                    StartDate = enrollment.Training.StartDate,
                    EndDate = enrollment.Training.EndDate,
                    Duration = enrollment.Training.Duration,
                    FinancialYear = enrollment.Training.FinancialYear
                } : null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating enrollment with ID {EnrollmentId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the enrollment" });
        }
    }

    /// <summary>
    /// Delete an enrollment
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        try
        {
            var enrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(id);
            if (enrollment == null)
            {
                return NotFound(new { message = "Enrollment not found" });
            }

            await _unitOfWork.ParticipantEnrollments.DeleteAsync(enrollment);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "Enrollment deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting enrollment with ID {EnrollmentId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the enrollment" });
        }
    }
}
