using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AllowancesController : ControllerBase
{
    private readonly IAllowanceService _service;
    public AllowancesController(IAllowanceService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<AllowanceResponseDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        var (items, total) = await _service.GetPagedAsync(page, pageSize, search);
        return Ok(new PaginatedResponse<AllowanceResponseDto>(items.Select(MapToDto), total, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AllowanceResponseDto>> GetById(int id)
    {
        var a = await _service.GetByIdAsync(id);
        return a == null ? NotFound() : Ok(MapToDto(a));
    }

    [HttpGet("participant/{participantId}")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetByParticipant(int participantId)
        => Ok((await _service.GetByParticipantAsync(participantId)).Select(MapToDto));

    [HttpGet("admission/{admissionId}")]
    public async Task<ActionResult<IEnumerable<AllowanceResponseDto>>> GetByAdmission(int admissionId)
        => Ok((await _service.GetByAdmissionAsync(admissionId)).Select(MapToDto));

    [HttpPost]
    public async Task<ActionResult<AllowanceResponseDto>> Create([FromBody] CreateAllowanceDto dto)
    {
        var a = new Allowance { ParticipantFK = dto.ParticipantId, AdmissionFK = dto.AdmissionId, AllowanceTypeFK = dto.AllowanceTypeId, StatusFK = dto.StatusId, Amount = dto.Amount, Frequency = dto.Frequency, StartDate = dto.StartDate, EndDate = dto.EndDate, AllowanceStoppageDate = dto.AllowanceStoppageDate, Comments = dto.Comments };
        var created = await _service.CreateAsync(a);
        return CreatedAtAction(nameof(GetById), new { id = created.PK }, MapToDto(created));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AllowanceResponseDto>> Update(int id, [FromBody] UpdateAllowanceDto dto)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.ParticipantFK = dto.ParticipantId ?? existing.ParticipantFK;
        existing.AdmissionFK = dto.AdmissionId ?? existing.AdmissionFK;
        existing.AllowanceTypeFK = dto.AllowanceTypeId ?? existing.AllowanceTypeFK;
        existing.StatusFK = dto.StatusId ?? existing.StatusFK;
        existing.Amount = dto.Amount ?? existing.Amount;
        existing.Frequency = dto.Frequency ?? existing.Frequency;
        existing.StartDate = dto.StartDate ?? existing.StartDate;
        existing.EndDate = dto.EndDate ?? existing.EndDate;
        existing.AllowanceStoppageDate = dto.AllowanceStoppageDate ?? existing.AllowanceStoppageDate;
        existing.Comments = dto.Comments ?? existing.Comments;
        var updated = await _service.UpdateAsync(id, existing);
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (await _service.GetByIdAsync(id) == null)
        {
            return NotFound();
        }

        await _service.DeleteAsync(id);
        return NoContent();
    }

    private static AllowanceResponseDto MapToDto(Allowance a) => new(
        a.PK, a.ParticipantFK, a.Participant?.FullName ?? string.Empty,
        a.AdmissionFK,
        a.AllowanceType?.Name ?? string.Empty,
        a.AllowanceStatus?.Name ?? string.Empty,
        a.Amount, a.Frequency, a.StartDate, a.EndDate,
        a.AllowanceStoppageDate, a.Comments, a.CreatedAt);
}

[Authorize]
[ApiController]
[Route("api/allowance-types")]
public class AllowanceTypesController : ControllerBase
{
    private readonly IAllowanceTypeService _service;
    public AllowanceTypesController(IAllowanceTypeService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AllowanceTypeResponseDto>>> GetAll([FromQuery] string? search)
        => Ok((await _service.GetAllAsync(search)).Select(t => new AllowanceTypeResponseDto(t.PK, t.Name, t.Description, t.Frequency)));

    [HttpGet("{id}")]
    public async Task<ActionResult<AllowanceTypeResponseDto>> GetById(int id)
    {
        var t = await _service.GetByIdAsync(id);
        return t == null ? NotFound() : Ok(new AllowanceTypeResponseDto(t.PK, t.Name, t.Description, t.Frequency));
    }

    [HttpPost]
    public async Task<ActionResult<AllowanceTypeResponseDto>> Create([FromBody] CreateAllowanceTypeDto dto)
    {
        try { var t = await _service.CreateAsync(new AllowanceType { Name = dto.Name, Description = dto.Description, Frequency = dto.Frequency }); return CreatedAtAction(nameof(GetById), new { id = t.PK }, new AllowanceTypeResponseDto(t.PK, t.Name, t.Description, t.Frequency)); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AllowanceTypeResponseDto>> Update(int id, [FromBody] UpdateAllowanceTypeDto dto)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Name = dto.Name ?? existing.Name; existing.Description = dto.Description ?? existing.Description; existing.Frequency = dto.Frequency ?? existing.Frequency;
        try { var t = await _service.UpdateAsync(id, existing); return Ok(new AllowanceTypeResponseDto(t.PK, t.Name, t.Description, t.Frequency)); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (await _service.GetByIdAsync(id) == null)
        {
            return NotFound();
        }

        await _service.DeleteAsync(id); return NoContent();
    }
}

[Authorize]
[ApiController]
[Route("api/allowance-statuses")]
public class AllowanceStatusesController : ControllerBase
{
    private readonly IAllowanceStatusService _service;
    public AllowanceStatusesController(IAllowanceStatusService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AllowanceStatusResponseDto>>> GetAll([FromQuery] string? search)
        => Ok((await _service.GetAllAsync(search)).Select(s => new AllowanceStatusResponseDto(s.PK, s.Name, s.Description)));

    [HttpGet("{id}")]
    public async Task<ActionResult<AllowanceStatusResponseDto>> GetById(int id)
    {
        var s = await _service.GetByIdAsync(id);
        return s == null ? NotFound() : Ok(new AllowanceStatusResponseDto(s.PK, s.Name, s.Description));
    }

    [HttpPost]
    public async Task<ActionResult<AllowanceStatusResponseDto>> Create([FromBody] CreateAllowanceStatusDto dto)
    {
        try { var s = await _service.CreateAsync(new AllowanceStatus { Name = dto.Name, Description = dto.Description }); return CreatedAtAction(nameof(GetById), new { id = s.PK }, new AllowanceStatusResponseDto(s.PK, s.Name, s.Description)); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AllowanceStatusResponseDto>> Update(int id, [FromBody] UpdateAllowanceStatusDto dto)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Name = dto.Name ?? existing.Name; existing.Description = dto.Description ?? existing.Description;
        try { var s = await _service.UpdateAsync(id, existing); return Ok(new AllowanceStatusResponseDto(s.PK, s.Name, s.Description)); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (await _service.GetByIdAsync(id) == null)
        {
            return NotFound();
        }

        await _service.DeleteAsync(id); return NoContent();
    }
}
