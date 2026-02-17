using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

/// <summary>
/// Enrollment Stage Controller
/// Handles individual stage data saving for the 6-stage enrollment process
/// </summary>
[Route("api/enrollment-stages")]
[ApiController]
[Authorize]
public class EnrollmentStagesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<EnrollmentStagesController> _logger;

    public EnrollmentStagesController(
        IUnitOfWork unitOfWork,
        ILogger<EnrollmentStagesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Stage 1: Save Participant Basic Information
    /// </summary>
    [HttpPost("{progressId}/stage1")]
    public async Task<IActionResult> SaveStage1([FromRoute] int progressId, [FromBody] Stage1ParticipantDto dto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);
            if (progress == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment progress not found" });
            }

            Participant participant;

            // Check if participant already exists (by IdNo or if progress has ParticipantFK)
            var allParticipants = await _unitOfWork.Participants.GetAllAsync();
            var existingParticipant = allParticipants.FirstOrDefault(p => p.IdNo == dto.IdNo);

            if (existingParticipant != null)
            {
                // Update existing participant
                participant = existingParticipant;
                participant.Title = dto.Title;
                participant.Firstname = dto.Firstname;
                participant.Lastname = dto.Lastname;
                participant.Middlename = dto.Middlename;
                participant.Sex = dto.Sex;
                participant.Dob = dto.Dob;
                participant.IdType = dto.IdType;
                participant.Phone = dto.Phone;
                participant.Email = dto.Email;
                participant.WorkTelephone = dto.WorkTelephone;
                participant.DesignationFK = dto.DesignationFK;
                participant.DepartmentOrFacility = dto.DepartmentOrFacility;
                participant.DutyStation = dto.DutyStation;
                participant.UpdatedAt = DateTime.UtcNow;
                participant.UpdatedBy = User.Identity?.Name ?? "System";

                await _unitOfWork.Participants.UpdateAsync(participant);
            }
            else
            {
                // Create new participant
                participant = new Participant
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
                await _unitOfWork.SaveChangesAsync(); // Save to get PK
            }

            // Update progress
            progress.ParticipantFK = participant.PK;
            progress.Form1_ParticipantProfile = true;
            progress.CurrentStep = Math.Max(progress.CurrentStep, 2); // Move to stage 2
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                message = "Stage 1 saved successfully",
                participantId = participant.PK,
                nextStage = 2
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error saving Stage 1");
            return StatusCode(500, new { message = "An error occurred while saving Stage 1 data" });
        }
    }

    /// <summary>
    /// Stage 2: Save Next of Kin Information
    /// </summary>
    [HttpPost("{progressId}/stage2")]
    public async Task<IActionResult> SaveStage2([FromRoute] int progressId, [FromBody] Stage2NextOfKinDto dto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);
            if (progress == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment progress not found" });
            }

            if (!progress.ParticipantFK.HasValue || progress.ParticipantFK.Value == 0)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return BadRequest(new { message = "Stage 1 must be completed first" });
            }

            // Check if next of kin already exists for this participant
            var existingNextOfKins = await _unitOfWork.NextOfKins.GetByParticipantIdAsync(progress.ParticipantFK.Value);
            var existingNextOfKin = existingNextOfKins.FirstOrDefault(n => n.IdNo == dto.IdNo ||
                (n.Firstname == dto.Firstname && n.Lastname == dto.Lastname));

            NextOfKin nextOfKin;

            if (existingNextOfKin != null)
            {
                // Update existing next of kin
                nextOfKin = existingNextOfKin;
                nextOfKin.Firstname = dto.Firstname;
                nextOfKin.Lastname = dto.Lastname;
                nextOfKin.Relationship = dto.Relationship;
                nextOfKin.Phone = dto.Phone;
                nextOfKin.Email = dto.Email;
                nextOfKin.IdNo = dto.IdNo;
                nextOfKin.UpdatedAt = DateTime.UtcNow;
                nextOfKin.UpdatedBy = User.Identity?.Name ?? "System";

                await _unitOfWork.NextOfKins.UpdateAsync(nextOfKin);
            }
            else
            {
                // Create new next of kin
                nextOfKin = new NextOfKin
                {
                    ParticipantFK = progress.ParticipantFK.Value,
                    Firstname = dto.Firstname,
                    Lastname = dto.Lastname,
                    Relationship = dto.Relationship,
                    Phone = dto.Phone,
                    Email = dto.Email,
                    IdNo = dto.IdNo,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = User.Identity?.Name ?? "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = User.Identity?.Name ?? "System"
                };

                await _unitOfWork.NextOfKins.AddAsync(nextOfKin);
            }

            // Update progress
            progress.Form2_Nomination = true; // Note: Using Form2 flag for now
            progress.CurrentStep = Math.Max(progress.CurrentStep, 3); // Move to stage 3
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                message = "Stage 2 (Next of Kin) saved successfully",
                nextOfKinId = nextOfKin.PK,
                nextStage = 3
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error saving Stage 2");
            return StatusCode(500, new { message = "An error occurred while saving Stage 2 data" });
        }
    }

    /// <summary>
    /// Stage 3: Save Training Nomination
    /// </summary>
    [HttpPost("{progressId}/stage3")]
    public async Task<IActionResult> SaveStage3([FromRoute] int progressId, [FromBody] Stage3NominationDto dto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);
            if (progress == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment progress not found" });
            }

            if (!progress.ParticipantFK.HasValue || progress.ParticipantFK.Value == 0)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return BadRequest(new { message = "Stage 1 must be completed first" });
            }

            Nomination nomination;

            // Check if nomination already exists
            if (progress.NominationFK.HasValue)
            {
                var existingNomination = await _unitOfWork.Nominations.GetByIdAsync(progress.NominationFK.Value);
                if (existingNomination != null)
                {
                    nomination = existingNomination;
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
                    nomination.UpdatedAt = DateTime.UtcNow;
                    nomination.UpdatedBy = User.Identity?.Name ?? "System";

                    await _unitOfWork.Nominations.UpdateAsync(nomination);
                }
                else
                {
                    // Create new if not found
                    nomination = CreateNomination(progress.ParticipantFK.Value, dto);
                    await _unitOfWork.Nominations.AddAsync(nomination);
                    await _unitOfWork.SaveChangesAsync();
                    progress.NominationFK = nomination.PK;
                }
            }
            else
            {
                // Create new nomination
                nomination = CreateNomination(progress.ParticipantFK.Value, dto);
                await _unitOfWork.Nominations.AddAsync(nomination);
                await _unitOfWork.SaveChangesAsync();
                progress.NominationFK = nomination.PK;
            }

            // Update progress - Note: We're marking Form2 complete for nomination
            progress.Form2_Nomination = true;
            progress.CurrentStep = Math.Max(progress.CurrentStep, 4); // Move to stage 4
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                message = "Stage 3 (Nomination) saved successfully",
                nominationId = nomination.PK,
                nextStage = 4
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error saving Stage 3");
            return StatusCode(500, new { message = "An error occurred while saving Stage 3 data" });
        }
    }

    /// <summary>
    /// Stage 4: Save Admission and Training Details
    /// </summary>
    [HttpPost("{progressId}/stage4")]
    public async Task<IActionResult> SaveStage4([FromRoute] int progressId, [FromBody] Stage4AdmissionDto dto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);
            if (progress == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment progress not found" });
            }

            if (!progress.ParticipantFK.HasValue || progress.ParticipantFK.Value == 0)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return BadRequest(new { message = "Stage 1 must be completed first" });
            }

            // Create or update Training record
            Training training;
            var allTrainings = await _unitOfWork.Trainings.GetAllAsync();
            var existingTraining = allTrainings.FirstOrDefault(t =>
                t.Institution == dto.Institution &&
                t.Program == dto.Program &&
                t.CountryOfStudy == dto.CountryOfStudy);

            if (existingTraining != null)
            {
                training = existingTraining;
                training.Specialty = dto.Specialty;
                training.StartDate = dto.StartDate;
                training.EndDate = dto.EndDate;
                training.Duration = dto.Duration;
                training.ModeOfStudy = dto.ModeOfStudy;
                training.CampusType = dto.CampusType;
                training.UpdatedAt = DateTime.UtcNow;
                training.UpdatedBy = User.Identity?.Name ?? "System";

                await _unitOfWork.Trainings.UpdateAsync(training);
            }
            else
            {
                training = new Training
                {
                    Institution = dto.Institution,
                    Program = dto.Program,
                    Specialty = dto.Specialty,
                    CountryOfStudy = dto.CountryOfStudy,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Duration = dto.Duration,
                    ModeOfStudy = dto.ModeOfStudy,
                    CampusType = dto.CampusType,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = User.Identity?.Name ?? "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = User.Identity?.Name ?? "System"
                };

                await _unitOfWork.Trainings.AddAsync(training);
                await _unitOfWork.SaveChangesAsync(); // Save to get PK
            }

            // Create or update ParticipantEnrollment
            ParticipantEnrollment enrollment;

            if (progress.ParticipantEnrollmentFK.HasValue)
            {
                var existingEnrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(progress.ParticipantEnrollmentFK.Value);
                if (existingEnrollment != null)
                {
                    enrollment = existingEnrollment;
                    UpdateEnrollment(enrollment, training.PK, dto);
                    await _unitOfWork.ParticipantEnrollments.UpdateAsync(enrollment);
                }
                else
                {
                    enrollment = CreateEnrollment(progress.ParticipantFK.Value, training.PK, progress.NominationFK, dto);
                    await _unitOfWork.ParticipantEnrollments.AddAsync(enrollment);
                    await _unitOfWork.SaveChangesAsync();
                    progress.ParticipantEnrollmentFK = enrollment.PK;
                }
            }
            else
            {
                enrollment = CreateEnrollment(progress.ParticipantFK.Value, training.PK, progress.NominationFK, dto);
                await _unitOfWork.ParticipantEnrollments.AddAsync(enrollment);
                await _unitOfWork.SaveChangesAsync();
                progress.ParticipantEnrollmentFK = enrollment.PK;
            }

            // Update progress
            progress.Form3_Admission = true;
            progress.CurrentStep = Math.Max(progress.CurrentStep, 5); // Move to stage 5
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                message = "Stage 4 (Admission) saved successfully",
                trainingId = training.PK,
                enrollmentId = enrollment.PK,
                nextStage = 5
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error saving Stage 4");
            return StatusCode(500, new { message = "An error occurred while saving Stage 4 data" });
        }
    }

    /// <summary>
    /// Stage 5: Save Bonding Information
    /// </summary>
    [HttpPost("{progressId}/stage5")]
    public async Task<IActionResult> SaveStage5([FromRoute] int progressId, [FromBody] Stage5BondDto dto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);
            if (progress == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment progress not found" });
            }

            if (!progress.ParticipantEnrollmentFK.HasValue)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return BadRequest(new { message = "Stage 4 (Admission) must be completed first" });
            }

            // Create or update Bond
            var existingBond = await _unitOfWork.Bonds.GetByEnrollmentIdAsync(progress.ParticipantEnrollmentFK.Value);
            Bond bond;

            if (existingBond != null)
            {
                bond = existingBond;
                bond.BondStartDate = dto.BondStartDate;
                bond.BondEndDate = dto.BondEndDate;
                bond.BondPeriodMonths = dto.BondPeriodMonths;
                bond.BondSigned = dto.BondSigned;
                bond.DateSigned = dto.DateSigned;
                bond.BondStatus = dto.BondStatus;
                bond.BondAmount = dto.BondAmount;
                bond.BondConditions = dto.BondConditions;
                bond.InductionCompleted = dto.InductionCompleted;
                bond.InductionDate = dto.InductionDate;
                bond.UpdatedAt = DateTime.UtcNow;
                bond.UpdatedBy = User.Identity?.Name ?? "System";

                await _unitOfWork.Bonds.UpdateAsync(bond);
            }
            else
            {
                bond = new Bond
                {
                    ParticipantEnrollmentFK = progress.ParticipantEnrollmentFK.Value,
                    BondStartDate = dto.BondStartDate,
                    BondEndDate = dto.BondEndDate,
                    BondPeriodMonths = dto.BondPeriodMonths,
                    BondSigned = dto.BondSigned,
                    DateSigned = dto.DateSigned,
                    BondStatus = dto.BondStatus,
                    BondAmount = dto.BondAmount,
                    BondConditions = dto.BondConditions,
                    InductionCompleted = dto.InductionCompleted,
                    InductionDate = dto.InductionDate,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = User.Identity?.Name ?? "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = User.Identity?.Name ?? "System"
                };

                await _unitOfWork.Bonds.AddAsync(bond);
            }

            // Update progress
            progress.Form5_Extension = true; // Using Form5 flag for bonding
            progress.CurrentStep = Math.Max(progress.CurrentStep, 6); // Move to stage 6
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                message = "Stage 5 (Bonding) saved successfully",
                bondId = bond.PK,
                nextStage = 6
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error saving Stage 5");
            return StatusCode(500, new { message = "An error occurred while saving Stage 5 data" });
        }
    }

    /// <summary>
    /// Stage 6: Save Training Costs (Allowances)
    /// </summary>
    [HttpPost("{progressId}/stage6")]
    public async Task<IActionResult> SaveStage6([FromRoute] int progressId, [FromBody] Stage6TrainingCostDto dto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var progress = await _unitOfWork.EnrollmentProgress.GetByIdAsync(progressId);
            if (progress == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment progress not found" });
            }

            if (!progress.ParticipantFK.HasValue || progress.ParticipantFK.Value == 0 || !progress.ParticipantEnrollmentFK.HasValue)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return BadRequest(new { message = "Previous stages must be completed first" });
            }

            var enrollment = await _unitOfWork.ParticipantEnrollments.GetByIdAsync(progress.ParticipantEnrollmentFK.Value);
            if (enrollment == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return NotFound(new { message = "Enrollment not found" });
            }

            var createdAllowances = new List<int>();

            // Create allowances for each cost item
            foreach (var allowanceDto in dto.Allowances)
            {
                var allowance = new Allowance
                {
                    TrainingFK = enrollment.TrainingFK,
                    ParticipantFK = progress.ParticipantFK.Value,
                    AllowanceTypeFK = allowanceDto.AllowanceTypeFK,
                    StatusFK = allowanceDto.StatusFK,
                    Amount = allowanceDto.Amount,
                    StartDate = allowanceDto.StartDate,
                    EndDate = allowanceDto.EndDate,
                    Frequency = allowanceDto.Frequency,
                    AllowanceStoppageDate = allowanceDto.AllowanceStoppageDate,
                    Comments = allowanceDto.Comments,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = User.Identity?.Name ?? "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = User.Identity?.Name ?? "System"
                };

                await _unitOfWork.Allowances.AddAsync(allowance);
                await _unitOfWork.SaveChangesAsync();
                createdAllowances.Add(allowance.PK);
            }

            // Update progress - mark enrollment as complete
            progress.Form4_TrainingCosts = true;
            progress.Form6_Completion = true; // Mark final form complete
            progress.CurrentStep = 6;
            progress.EnrollmentStatus = "Completed";
            progress.CompletedDate = DateTime.UtcNow;
            progress.LastUpdated = DateTime.UtcNow;
            progress.UpdatedAt = DateTime.UtcNow;
            progress.UpdatedBy = User.Identity?.Name ?? "System";

            await _unitOfWork.EnrollmentProgress.UpdateAsync(progress);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new
            {
                message = "Stage 6 (Training Costs) saved successfully. Enrollment complete!",
                allowanceIds = createdAllowances,
                enrollmentComplete = true
            });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error saving Stage 6");
            return StatusCode(500, new { message = "An error occurred while saving Stage 6 data" });
        }
    }

    #region Helper Methods

    private Nomination CreateNomination(int participantFK, Stage3NominationDto dto)
    {
        return new Nomination
        {
            ParticipantFK = participantFK,
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
            CreatedAt = DateTime.UtcNow,
            CreatedBy = User.Identity?.Name ?? "System",
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = User.Identity?.Name ?? "System"
        };
    }

    private ParticipantEnrollment CreateEnrollment(int participantFK, int trainingFK, int? nominationFK, Stage4AdmissionDto dto)
    {
        return new ParticipantEnrollment
        {
            ParticipantFK = participantFK,
            TrainingFK = trainingFK,
            NominationFK = nominationFK,
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
            SponsorFK = dto.SponsorFK,
            ModeOfStudy = dto.ModeOfStudy,
            RegistrationDate = dto.RegistrationDate,
            TrainingStatus = dto.TrainingStatus,
            FinancialYear = dto.FinancialYear,
            CampusType = dto.CampusType,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = User.Identity?.Name ?? "System",
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = User.Identity?.Name ?? "System"
        };
    }

    private void UpdateEnrollment(ParticipantEnrollment enrollment, int trainingFK, Stage4AdmissionDto dto)
    {
        enrollment.TrainingFK = trainingFK;
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
        enrollment.SponsorFK = dto.SponsorFK;
        enrollment.ModeOfStudy = dto.ModeOfStudy;
        enrollment.RegistrationDate = dto.RegistrationDate;
        enrollment.TrainingStatus = dto.TrainingStatus;
        enrollment.FinancialYear = dto.FinancialYear;
        enrollment.CampusType = dto.CampusType;
        enrollment.UpdatedAt = DateTime.UtcNow;
        enrollment.UpdatedBy = User.Identity?.Name ?? "System";
    }

    #endregion
}
