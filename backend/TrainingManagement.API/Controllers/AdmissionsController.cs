using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AdmissionsController : ControllerBase
{
    private readonly IAdmissionService _service;
    public AdmissionsController(IAdmissionService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<AdmissionResponseDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        var (items, total) = await _service.GetPagedAsync(page, pageSize, search);
        return Ok(new PaginatedResponse<AdmissionResponseDto>(items.Select(MapToDto), total, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AdmissionResponseDto>> GetById(int id)
    {
        var a = await _service.GetByIdAsync(id);
        return a == null ? NotFound() : Ok(MapToDto(a));
    }

    [HttpGet("nomination/{nominationId}")]
    public async Task<ActionResult<AdmissionResponseDto>> GetByNomination(int nominationId)
    {
        var a = await _service.GetByNominationAsync(nominationId);
        return a == null ? NotFound() : Ok(MapToDto(a));
    }

    [HttpPost]
    public async Task<ActionResult<AdmissionResponseDto>> Create([FromForm] CreateAdmissionDto dto, IFormFile? releaseLetter)
    {
        var admission = new Admission
        {
            NominationFK = dto.NominationId,
            AdmissionDate = dto.AdmissionDate,
            AdmissionProgramFK = dto.AdmissionProgramId,
            ModeOfStudyFK = dto.ModeOfStudyId,
            ReleaseStartDate = dto.ReleaseStartDate,
            ReleaseEndDate = dto.ReleaseEndDate,
            Notes = dto.Notes
        };
        var stream = releaseLetter?.OpenReadStream();
        var created = await _service.CreateAsync(admission, stream, releaseLetter?.FileName);
        return CreatedAtAction(nameof(GetById), new { id = created.PK }, MapToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AdmissionResponseDto>> Update(int id, [FromForm] UpdateAdmissionDto dto, IFormFile? releaseLetter)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.AdmissionDate = dto.AdmissionDate ?? existing.AdmissionDate;
        existing.AdmissionProgramFK = dto.AdmissionProgramId ?? existing.AdmissionProgramFK;
        existing.ModeOfStudyFK = dto.ModeOfStudyId ?? existing.ModeOfStudyFK;
        existing.ReleaseStartDate = dto.ReleaseStartDate ?? existing.ReleaseStartDate;
        existing.ReleaseEndDate = dto.ReleaseEndDate ?? existing.ReleaseEndDate;
        existing.Notes = dto.Notes ?? existing.Notes;
        var stream = releaseLetter?.OpenReadStream();
        var updated = await _service.UpdateAsync(id, existing, stream, releaseLetter?.FileName);
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var a = await _service.GetByIdAsync(id);
        if (a == null)
        {
            return NotFound();
        }

        await _service.DeleteAsync(id);
        return NoContent();
    }

    private static AdmissionResponseDto MapToDto(Admission a) => new(
        a.PK, a.NominationFK,
        a.Nomination?.Participant?.FullName ?? string.Empty,
        a.AdmissionDate,
        a.AdmissionProgramFK, a.AdmissionProgram?.Name,
        a.AdmissionProgram?.Country, a.AdmissionProgram?.Institution,
        a.ModeOfStudyFK, a.ModeOfStudy?.Name,
        a.ReleaseStartDate, a.ReleaseEndDate,
        a.ReleaseLetterPath, a.ReleaseLetterOriginalName,
        a.Notes, a.CreatedAt);
}
