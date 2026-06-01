using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

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
        try
        {
            var s = await _service.CreateAsync(new AllowanceStatus { Name = dto.Name, Description = dto.Description });
            return CreatedAtAction(nameof(GetById), new { id = s.PK }, new AllowanceStatusResponseDto(s.PK, s.Name, s.Description));
        }
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

        existing.Name = dto.Name ?? existing.Name;
        existing.Description = dto.Description ?? existing.Description;

        try
        {
            var s = await _service.UpdateAsync(id, existing);
            return Ok(new AllowanceStatusResponseDto(s.PK, s.Name, s.Description));
        }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
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
}
