using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ParticipantsController : ControllerBase
{
    private readonly IParticipantService _service;
    private readonly INextOfKinService _nokService;
    public ParticipantsController(IParticipantService service, INextOfKinService nokService)
    {
        _service = service; _nokService = nokService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<ParticipantResponseDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        var (items, total) = await _service.GetPagedAsync(page, pageSize, search);
        return Ok(new PaginatedResponse<ParticipantResponseDto>(items.Select(MapToDto), total, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ParticipantResponseDto>> GetById(int id)
    {
        var p = await _service.GetByIdAsync(id);
        return p == null ? NotFound() : Ok(MapToDto(p));
    }

    [HttpPost]
    public async Task<ActionResult<ParticipantResponseDto>> Create([FromBody] CreateParticipantDto dto)
    {
        try
        {
            var participant = MapFromCreateDto(dto);
            var created = await _service.CreateAsync(participant);
            return CreatedAtAction(nameof(GetById), new { id = created.PK }, MapToDto(created));
        }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ParticipantResponseDto>> Update(int id, [FromBody] UpdateParticipantDto dto)
    {
        try
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            var participant = MergeUpdate(existing, dto);
            var updated = await _service.UpdateAsync(id, participant);
            return Ok(MapToDto(updated));
        }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        await _service.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("{id}/next-of-kin")]
    public async Task<ActionResult<NextOfKinResponseDto>> GetNextOfKin(int id)
    {
        var nok = await _nokService.GetByParticipantAsync(id);
        return nok == null ? NotFound() : Ok(MapNokToDto(nok));
    }

    [HttpPut("{id}/next-of-kin")]
    public async Task<ActionResult<NextOfKinResponseDto>> UpsertNextOfKin(int id, [FromBody] UpsertNextOfKinDto dto)
    {
        var nok = new NextOfKin
        {
            FullName = dto.FullName,
            RelationshipTypeFK = dto.RelationshipTypeId,
            Phone = dto.Phone,
            Email = dto.Email,
            IdNumber = dto.IdNumber
        };
        var result = await _nokService.UpsertAsync(id, nok);
        return Ok(MapNokToDto(result));
    }

    private static ParticipantResponseDto MapToDto(Participant p) => new(
        p.PK, p.Title?.Name, p.Firstname, p.Middlename, p.Lastname, p.FullName,
        p.Sex, p.Dob, p.IdType?.Name, p.IdNumber, p.Phone, p.Email, p.Address,
        p.SalaryScale?.Scale, p.Department?.Name, p.DutyStation?.Name, p.PostalAddress,
        p.NextOfKin == null ? null : MapNokToDto(p.NextOfKin),
        p.CreatedAt);

    private static NextOfKinResponseDto MapNokToDto(NextOfKin n) => new(
        n.PK, n.FullName, n.RelationshipTypeFK, n.RelationshipType?.Name, n.Phone, n.Email, n.IdNumber);

    private static Participant MapFromCreateDto(CreateParticipantDto dto) => new()
    {
        TitleFK = dto.TitleId,
        Firstname = dto.Firstname,
        Middlename = dto.Middlename,
        Lastname = dto.Lastname,
        Sex = dto.Sex,
        Dob = dto.Dob,
        IdTypeFK = dto.IdTypeId,
        IdNumber = dto.IdNumber,
        Phone = dto.Phone,
        Email = dto.Email,
        Address = dto.Address,
        SalaryScaleFK = dto.SalaryScaleId,
        DepartmentFK = dto.DepartmentId,
        DutyStationFK = dto.DutyStationId,
        PostalAddress = dto.PostalAddress
    };

    private static Participant MergeUpdate(Participant existing, UpdateParticipantDto dto)
    {
        existing.TitleFK = dto.TitleId ?? existing.TitleFK;
        existing.Firstname = dto.Firstname ?? existing.Firstname;
        existing.Middlename = dto.Middlename ?? existing.Middlename;
        existing.Lastname = dto.Lastname ?? existing.Lastname;
        existing.Sex = dto.Sex ?? existing.Sex;
        existing.Dob = dto.Dob ?? existing.Dob;
        existing.IdTypeFK = dto.IdTypeId ?? existing.IdTypeFK;
        existing.IdNumber = dto.IdNumber ?? existing.IdNumber;
        existing.Phone = dto.Phone ?? existing.Phone;
        existing.Email = dto.Email ?? existing.Email;
        existing.Address = dto.Address ?? existing.Address;
        existing.SalaryScaleFK = dto.SalaryScaleId ?? existing.SalaryScaleFK;
        existing.DepartmentFK = dto.DepartmentId ?? existing.DepartmentFK;
        existing.DutyStationFK = dto.DutyStationId ?? existing.DutyStationFK;
        existing.PostalAddress = dto.PostalAddress ?? existing.PostalAddress;
        return existing;
    }
}
