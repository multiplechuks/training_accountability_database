using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingManagement.API.DTOs;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/lookups")]
public class LookupsController : ControllerBase
{
    private readonly ILookupService _service;
    public LookupsController(ILookupService service) => _service = service;

    // ── All lookups in one call (for dropdowns) ───────────────────────────────
    [HttpGet("all")]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        return Ok(new
        {
            Titles = (await _service.GetTitlesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name)),
            IdTypes = (await _service.GetIdTypesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)),
            RelationshipTypes = (await _service.GetRelationshipTypesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name)),
            Departments = (await _service.GetDepartmentsAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)),
            SponsorTypes = (await _service.GetSponsorTypesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)),
            Qualifications = (await _service.GetQualificationsAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)),
            NominatedPrograms = (await _service.GetNominatedProgramsAsync(search, null)).Select(x => new { x.PK, x.Name, x.Year, x.Description }),
            AdmissionPrograms = (await _service.GetAdmissionProgramsAsync(search)).Select(x => new AdmissionProgramResponseDto(x.PK, x.Name, x.Country, x.Institution, x.Description)),
            ModesOfStudy = (await _service.GetModesOfStudyAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description))
        });
    }

    // ── Titles ─────────────────────────────────────────────────────────────────
    [HttpGet("titles")] public async Task<IActionResult> GetTitles([FromQuery] string? search) => Ok((await _service.GetTitlesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name)));
    [HttpGet("titles/{id}")] public async Task<IActionResult> GetTitle(int id) { var e = await _service.GetTitleByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name)); }
    [HttpPost("titles")] public async Task<IActionResult> CreateTitle([FromBody] CreateLookupDto dto) { var e = await _service.CreateTitleAsync(new Title { Name = dto.Name }); return CreatedAtAction(nameof(GetTitle), new { id = e.PK }, new LookupItemDto(e.PK, e.Name)); }
    [HttpPut("titles/{id}")] public async Task<IActionResult> UpdateTitle(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetTitleByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateTitleAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name)); }
    [HttpDelete("titles/{id}")] public async Task<IActionResult> DeleteTitle(int id) { if (await _service.GetTitleByIdAsync(id) == null) { return NotFound(); } await _service.DeleteTitleAsync(id); return NoContent(); }

    // ── IdTypes ────────────────────────────────────────────────────────────────
    [HttpGet("id-types")] public async Task<IActionResult> GetIdTypes([FromQuery] string? search) => Ok((await _service.GetIdTypesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)));
    [HttpGet("id-types/{id}")] public async Task<IActionResult> GetIdType(int id) { var e = await _service.GetIdTypeByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPost("id-types")] public async Task<IActionResult> CreateIdType([FromBody] CreateLookupDto dto) { var e = await _service.CreateIdTypeAsync(new IdType { Name = dto.Name, Description = dto.Description }); return CreatedAtAction(nameof(GetIdType), new { id = e.PK }, new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPut("id-types/{id}")] public async Task<IActionResult> UpdateIdType(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetIdTypeByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateIdTypeAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name, u.Description)); }
    [HttpDelete("id-types/{id}")] public async Task<IActionResult> DeleteIdType(int id) { if (await _service.GetIdTypeByIdAsync(id) == null) { return NotFound(); } await _service.DeleteIdTypeAsync(id); return NoContent(); }

    // ── RelationshipTypes ──────────────────────────────────────────────────────
    [HttpGet("relationship-types")] public async Task<IActionResult> GetRelationshipTypes([FromQuery] string? search) => Ok((await _service.GetRelationshipTypesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name)));
    [HttpGet("relationship-types/{id}")] public async Task<IActionResult> GetRelationshipType(int id) { var e = await _service.GetRelationshipTypeByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name)); }
    [HttpPost("relationship-types")] public async Task<IActionResult> CreateRelationshipType([FromBody] CreateLookupDto dto) { var e = await _service.CreateRelationshipTypeAsync(new RelationshipType { Name = dto.Name }); return CreatedAtAction(nameof(GetRelationshipType), new { id = e.PK }, new LookupItemDto(e.PK, e.Name)); }
    [HttpPut("relationship-types/{id}")] public async Task<IActionResult> UpdateRelationshipType(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetRelationshipTypeByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateRelationshipTypeAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name)); }
    [HttpDelete("relationship-types/{id}")] public async Task<IActionResult> DeleteRelationshipType(int id) { if (await _service.GetRelationshipTypeByIdAsync(id) == null) { return NotFound(); } await _service.DeleteRelationshipTypeAsync(id); return NoContent(); }

    // ── Departments ────────────────────────────────────────────────────────────
    [HttpGet("departments")] public async Task<IActionResult> GetDepartments([FromQuery] string? search) => Ok((await _service.GetDepartmentsAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)));
    [HttpGet("departments/{id}")] public async Task<IActionResult> GetDepartment(int id) { var e = await _service.GetDepartmentByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPost("departments")] public async Task<IActionResult> CreateDepartment([FromBody] CreateLookupDto dto) { var e = await _service.CreateDepartmentAsync(new Department { Name = dto.Name, Description = dto.Description }); return CreatedAtAction(nameof(GetDepartment), new { id = e.PK }, new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPut("departments/{id}")] public async Task<IActionResult> UpdateDepartment(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetDepartmentByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateDepartmentAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name, u.Description)); }
    [HttpDelete("departments/{id}")] public async Task<IActionResult> DeleteDepartment(int id) { if (await _service.GetDepartmentByIdAsync(id) == null) { return NotFound(); } await _service.DeleteDepartmentAsync(id); return NoContent(); }

    // ── SalaryScales ───────────────────────────────────────────────────────────
    [HttpGet("salary-scales")] public async Task<IActionResult> GetSalaryScales([FromQuery] string? search) => Ok((await _service.GetSalaryScalesAsync(search)).Select(x => new { x.PK, x.Scale, x.Grade, x.Description }));
    [HttpGet("salary-scales/{id}")] public async Task<IActionResult> GetSalaryScale(int id) { var e = await _service.GetSalaryScaleByIdAsync(id); return e == null ? NotFound() : Ok(new { e.PK, e.Scale, e.Grade, e.Description }); }
    [HttpPost("salary-scales")] public async Task<IActionResult> CreateSalaryScale([FromBody] CreateSalaryScaleDto dto) { var e = await _service.CreateSalaryScaleAsync(new SalaryScale { Scale = dto.Scale, Grade = dto.Grade, Description = dto.Description }); return CreatedAtAction(nameof(GetSalaryScale), new { id = e.PK }, new { e.PK, e.Scale, e.Grade, e.Description }); }
    [HttpPut("salary-scales/{id}")] public async Task<IActionResult> UpdateSalaryScale(int id, [FromBody] UpdateSalaryScaleDto dto) { var e = await _service.GetSalaryScaleByIdAsync(id); if (e == null) { return NotFound(); } e.Scale = dto.Scale ?? e.Scale; e.Grade = dto.Grade ?? e.Grade; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateSalaryScaleAsync(id, e); return Ok(new { u.PK, u.Scale, u.Grade, u.Description }); }
    [HttpDelete("salary-scales/{id}")] public async Task<IActionResult> DeleteSalaryScale(int id) { if (await _service.GetSalaryScaleByIdAsync(id) == null) { return NotFound(); } await _service.DeleteSalaryScaleAsync(id); return NoContent(); }

    // ── DutyStations ───────────────────────────────────────────────────────────
    [HttpGet("duty-stations")] public async Task<IActionResult> GetDutyStations([FromQuery] string? search) => Ok((await _service.GetDutyStationsAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)));
    [HttpGet("duty-stations/{id}")] public async Task<IActionResult> GetDutyStation(int id) { var e = await _service.GetDutyStationByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPost("duty-stations")] public async Task<IActionResult> CreateDutyStation([FromBody] CreateLookupDto dto) { var e = await _service.CreateDutyStationAsync(new DutyStation { Name = dto.Name, Description = dto.Description }); return CreatedAtAction(nameof(GetDutyStation), new { id = e.PK }, new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPut("duty-stations/{id}")] public async Task<IActionResult> UpdateDutyStation(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetDutyStationByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateDutyStationAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name, u.Description)); }
    [HttpDelete("duty-stations/{id}")] public async Task<IActionResult> DeleteDutyStation(int id) { if (await _service.GetDutyStationByIdAsync(id) == null) { return NotFound(); } await _service.DeleteDutyStationAsync(id); return NoContent(); }

    // ── SponsorTypes ───────────────────────────────────────────────────────────
    [HttpGet("sponsor-types")] public async Task<IActionResult> GetSponsorTypes([FromQuery] string? search) => Ok((await _service.GetSponsorTypesAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)));
    [HttpGet("sponsor-types/{id}")] public async Task<IActionResult> GetSponsorType(int id) { var e = await _service.GetSponsorTypeByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPost("sponsor-types")] public async Task<IActionResult> CreateSponsorType([FromBody] CreateLookupDto dto) { var e = await _service.CreateSponsorTypeAsync(new SponsorType { Name = dto.Name, Description = dto.Description }); return CreatedAtAction(nameof(GetSponsorType), new { id = e.PK }, new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPut("sponsor-types/{id}")] public async Task<IActionResult> UpdateSponsorType(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetSponsorTypeByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateSponsorTypeAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name, u.Description)); }
    [HttpDelete("sponsor-types/{id}")] public async Task<IActionResult> DeleteSponsorType(int id) { if (await _service.GetSponsorTypeByIdAsync(id) == null) { return NotFound(); } await _service.DeleteSponsorTypeAsync(id); return NoContent(); }

    // ── Qualifications ─────────────────────────────────────────────────────────
    [HttpGet("qualifications")] public async Task<IActionResult> GetQualifications([FromQuery] string? search) => Ok((await _service.GetQualificationsAsync(search)).Select(x => new { x.PK, x.Name, x.Level, x.Description }));
    [HttpGet("qualifications/{id}")] public async Task<IActionResult> GetQualification(int id) { var e = await _service.GetQualificationByIdAsync(id); return e == null ? NotFound() : Ok(new { e.PK, e.Name, e.Level, e.Description }); }
    [HttpPost("qualifications")] public async Task<IActionResult> CreateQualification([FromBody] CreateQualificationDto dto) { var e = await _service.CreateQualificationAsync(new Qualification { Name = dto.Name, Level = dto.Level, Description = dto.Description }); return CreatedAtAction(nameof(GetQualification), new { id = e.PK }, new { e.PK, e.Name, e.Level, e.Description }); }
    [HttpPut("qualifications/{id}")] public async Task<IActionResult> UpdateQualification(int id, [FromBody] UpdateQualificationDto dto) { var e = await _service.GetQualificationByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Level = dto.Level ?? e.Level; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateQualificationAsync(id, e); return Ok(new { u.PK, u.Name, u.Level, u.Description }); }
    [HttpDelete("qualifications/{id}")] public async Task<IActionResult> DeleteQualification(int id) { if (await _service.GetQualificationByIdAsync(id) == null) { return NotFound(); } await _service.DeleteQualificationAsync(id); return NoContent(); }

    // ── NominatedPrograms ──────────────────────────────────────────────────────
    [HttpGet("nominated-programs")] public async Task<IActionResult> GetNominatedPrograms([FromQuery] string? search, [FromQuery] int? year) => Ok((await _service.GetNominatedProgramsAsync(search, year)).Select(x => new { x.PK, x.Name, x.Year, x.Description }));
    [HttpGet("nominated-programs/{id}")] public async Task<IActionResult> GetNominatedProgram(int id) { var e = await _service.GetNominatedProgramByIdAsync(id); return e == null ? NotFound() : Ok(new { e.PK, e.Name, e.Year, e.Description }); }
    [HttpPost("nominated-programs")] public async Task<IActionResult> CreateNominatedProgram([FromBody] CreateYearlyProgramDto dto) { var e = await _service.CreateNominatedProgramAsync(new NominatedProgram { Name = dto.Name, Description = dto.Description, Year = dto.Year }); return CreatedAtAction(nameof(GetNominatedProgram), new { id = e.PK }, new { e.PK, e.Name, e.Year, e.Description }); }
    [HttpPut("nominated-programs/{id}")] public async Task<IActionResult> UpdateNominatedProgram(int id, [FromBody] UpdateYearlyProgramDto dto) { var e = await _service.GetNominatedProgramByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Description = dto.Description ?? e.Description; if (dto.Year.HasValue) { e.Year = dto.Year.Value; } if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateNominatedProgramAsync(id, e); return Ok(new { u.PK, u.Name, u.Year, u.Description }); }
    [HttpDelete("nominated-programs/{id}")] public async Task<IActionResult> DeleteNominatedProgram(int id) { if (await _service.GetNominatedProgramByIdAsync(id) == null) { return NotFound(); } await _service.DeleteNominatedProgramAsync(id); return NoContent(); }

    // ── AdmissionPrograms ──────────────────────────────────────────────────────
    [HttpGet("admission-programs")] public async Task<IActionResult> GetAdmissionPrograms([FromQuery] string? search) => Ok((await _service.GetAdmissionProgramsAsync(search)).Select(x => new AdmissionProgramResponseDto(x.PK, x.Name, x.Country, x.Institution, x.Description)));
    [HttpGet("admission-programs/{id}")] public async Task<IActionResult> GetAdmissionProgram(int id) { var e = await _service.GetAdmissionProgramByIdAsync(id); return e == null ? NotFound() : Ok(new AdmissionProgramResponseDto(e.PK, e.Name, e.Country, e.Institution, e.Description)); }
    [HttpPost("admission-programs")] public async Task<IActionResult> CreateAdmissionProgram([FromBody] CreateAdmissionProgramDto dto) { var e = await _service.CreateAdmissionProgramAsync(new AdmissionProgram { Name = dto.Name, Country = dto.Country, Institution = dto.Institution, Description = dto.Description }); return CreatedAtAction(nameof(GetAdmissionProgram), new { id = e.PK }, new AdmissionProgramResponseDto(e.PK, e.Name, e.Country, e.Institution, e.Description)); }
    [HttpPut("admission-programs/{id}")] public async Task<IActionResult> UpdateAdmissionProgram(int id, [FromBody] UpdateAdmissionProgramDto dto) { var e = await _service.GetAdmissionProgramByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Country = dto.Country ?? e.Country; e.Institution = dto.Institution ?? e.Institution; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateAdmissionProgramAsync(id, e); return Ok(new AdmissionProgramResponseDto(u.PK, u.Name, u.Country, u.Institution, u.Description)); }
    [HttpDelete("admission-programs/{id}")] public async Task<IActionResult> DeleteAdmissionProgram(int id) { if (await _service.GetAdmissionProgramByIdAsync(id) == null) { return NotFound(); } await _service.DeleteAdmissionProgramAsync(id); return NoContent(); }

    // ── ModesOfStudy ───────────────────────────────────────────────────────────
    [HttpGet("modes-of-study")] public async Task<IActionResult> GetModesOfStudy([FromQuery] string? search) => Ok((await _service.GetModesOfStudyAsync(search)).Select(x => new LookupItemDto(x.PK, x.Name, x.Description)));
    [HttpGet("modes-of-study/{id}")] public async Task<IActionResult> GetModeOfStudy(int id) { var e = await _service.GetModeOfStudyByIdAsync(id); return e == null ? NotFound() : Ok(new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPost("modes-of-study")] public async Task<IActionResult> CreateModeOfStudy([FromBody] CreateLookupDto dto) { var e = await _service.CreateModeOfStudyAsync(new ModeOfStudy { Name = dto.Name, Description = dto.Description }); return CreatedAtAction(nameof(GetModeOfStudy), new { id = e.PK }, new LookupItemDto(e.PK, e.Name, e.Description)); }
    [HttpPut("modes-of-study/{id}")] public async Task<IActionResult> UpdateModeOfStudy(int id, [FromBody] UpdateLookupDto dto) { var e = await _service.GetModeOfStudyByIdAsync(id); if (e == null) { return NotFound(); } e.Name = dto.Name ?? e.Name; e.Description = dto.Description ?? e.Description; if (dto.IsActive.HasValue) { e.IsActive = dto.IsActive.Value; } var u = await _service.UpdateModeOfStudyAsync(id, e); return Ok(new LookupItemDto(u.PK, u.Name, u.Description)); }
    [HttpDelete("modes-of-study/{id}")] public async Task<IActionResult> DeleteModeOfStudy(int id) { if (await _service.GetModeOfStudyByIdAsync(id) == null) { return NotFound(); } await _service.DeleteModeOfStudyAsync(id); return NoContent(); }
}
