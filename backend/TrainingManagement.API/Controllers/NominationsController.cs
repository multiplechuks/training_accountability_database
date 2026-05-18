using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NominationsController : ControllerBase
{
    private readonly INominationService _service;
    public NominationsController(INominationService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<NominationResponseDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null, [FromQuery] int? year = null)
    {
        var (items, total) = await _service.GetPagedAsync(page, pageSize, search, year);
        return Ok(new PaginatedResponse<NominationResponseDto>(items.Select(MapToDto), total, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NominationResponseDto>> GetById(int id)
    {
        var n = await _service.GetByIdAsync(id);
        return n == null ? NotFound() : Ok(MapToDto(n));
    }

    [HttpGet("participant/{participantId}")]
    public async Task<ActionResult<IEnumerable<NominationResponseDto>>> GetByParticipant(int participantId)
    {
        var items = await _service.GetByParticipantAsync(participantId);
        return Ok(items.Select(MapToDto));
    }

    [HttpPost]
    public async Task<ActionResult<NominationResponseDto>> Create([FromBody] CreateNominationDto dto)
    {
        var nomination = new Nomination
        {
            ParticipantFK = dto.ParticipantId,
            QualificationFK = dto.QualificationId,
            NominatedProgramFK = dto.NominatedProgramId,
            SponsorTypeFK = dto.SponsorTypeId,
            YearOfNomination = dto.YearOfNomination,
            EstimatedBudget = dto.EstimatedBudget,
            Currency = dto.Currency,
            ProfessionalBody = dto.ProfessionalBody,
            Notes = dto.Notes
        };
        var created = await _service.CreateAsync(nomination);
        return CreatedAtAction(nameof(GetById), new { id = created.PK }, MapToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<NominationResponseDto>> Update(int id, [FromBody] UpdateNominationDto dto)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.QualificationFK = dto.QualificationId ?? existing.QualificationFK;
        existing.NominatedProgramFK = dto.NominatedProgramId ?? existing.NominatedProgramFK;
        existing.SponsorTypeFK = dto.SponsorTypeId ?? existing.SponsorTypeFK;
        existing.YearOfNomination = dto.YearOfNomination ?? existing.YearOfNomination;
        existing.EstimatedBudget = dto.EstimatedBudget ?? existing.EstimatedBudget;
        existing.Currency = dto.Currency ?? existing.Currency;
        existing.ProfessionalBody = dto.ProfessionalBody ?? existing.ProfessionalBody;
        existing.NominationStatus = dto.NominationStatus ?? existing.NominationStatus;
        existing.StatusReason = dto.StatusReason ?? existing.StatusReason;
        existing.ApprovalDate = dto.ApprovalDate ?? existing.ApprovalDate;
        existing.ApprovedBy = dto.ApprovedBy ?? existing.ApprovedBy;
        existing.Notes = dto.Notes ?? existing.Notes;
        var updated = await _service.UpdateAsync(id, existing);
        return Ok(MapToDto(updated));
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<NominationResponseDto>> UpdateStatus(int id, [FromBody] UpdateNominationStatusDto dto)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.NominationStatus = dto.Status;
        existing.StatusReason = dto.StatusReason ?? existing.StatusReason;
        existing.ApprovedBy = dto.ApprovedBy ?? existing.ApprovedBy;
        existing.ApprovalDate = dto.ApprovalDate ?? existing.ApprovalDate;
        var updated = await _service.UpdateAsync(id, existing);
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var n = await _service.GetByIdAsync(id);
        if (n == null)
        {
            return NotFound();
        }

        await _service.DeleteAsync(id);
        return NoContent();
    }

    private static NominationResponseDto MapToDto(Nomination n) => new(
        n.PK, n.ParticipantFK,
        n.Participant?.FullName ?? string.Empty,
        n.QualificationFK, n.Qualification?.Name,
        n.NominatedProgramFK, n.NominatedProgram?.Name, n.NominatedProgram?.Year,
        n.SponsorTypeFK, n.SponsorType?.Name,
        n.YearOfNomination, n.EstimatedBudget, n.Currency,
        n.ProfessionalBody, n.NominationStatus, n.StatusReason,
        n.NominationDate, n.ApprovalDate, n.ApprovedBy, n.Notes,
        n.Admission != null,
        n.CreatedAt);
}
