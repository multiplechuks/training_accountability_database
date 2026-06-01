using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

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
        try
        {
            var t = await _service.CreateAsync(new AllowanceType { Name = dto.Name, Description = dto.Description, Frequency = dto.Frequency });
            return CreatedAtAction(nameof(GetById), new { id = t.PK }, new AllowanceTypeResponseDto(t.PK, t.Name, t.Description, t.Frequency));
        }
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

        existing.Name = dto.Name ?? existing.Name;
        existing.Description = dto.Description ?? existing.Description;
        existing.Frequency = dto.Frequency ?? existing.Frequency;

        try
        {
            var t = await _service.UpdateAsync(id, existing);
            return Ok(new AllowanceTypeResponseDto(t.PK, t.Name, t.Description, t.Frequency));
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
