using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.API.DTOs;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly TrainingDbContext _context;
    private readonly ILogger<LookupController> _logger;

    public LookupController(TrainingDbContext context, ILogger<LookupController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/lookup/departments
    [HttpGet("departments")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetDepartments([FromQuery] string? searchTerm = null)
    {
        try
        {
            var query = _context.Departments.Where(d => !d.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(d =>
                    d.Name.Contains(searchTerm) ||
                    (d.Code != null && d.Code.Contains(searchTerm)));
            }

            var departments = await query
                .Select(d => new LookupDto
                {
                    PK = d.PK,
                    Name = d.Name,
                    Code = d.Code,
                    Description = d.Description
                })
                .OrderBy(d => d.Name)
                .ToListAsync();

            return Ok(departments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving departments");
            return StatusCode(500, "An error occurred while retrieving departments");
        }
    }

    // GET: api/lookup/facilities
    [HttpGet("facilities")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetFacilities([FromQuery] string? searchTerm = null)
    {
        try
        {
            var query = _context.Facilities.Where(f => !f.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(f =>
                    f.Name.Contains(searchTerm) ||
                    (f.Code != null && f.Code.Contains(searchTerm)));
            }

            var facilities = await query
                .Select(f => new LookupDto
                {
                    PK = f.PK,
                    Name = f.Name,
                    Code = f.Code,
                    Description = f.Description,
                    Location = f.Location
                })
                .OrderBy(f => f.Name)
                .ToListAsync();

            return Ok(facilities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving facilities");
            return StatusCode(500, "An error occurred while retrieving facilities");
        }
    }

    // GET: api/lookup/designations
    [HttpGet("designations")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetDesignations([FromQuery] string? searchTerm = null)
    {
        try
        {
            var query = _context.Designations.Where(d => !d.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(d =>
                    d.Title.Contains(searchTerm) ||
                    (d.Code != null && d.Code.Contains(searchTerm)));
            }

            var designations = await query
                .Select(d => new LookupDto
                {
                    PK = d.PK,
                    Name = d.Title,
                    Code = d.Code,
                    Description = d.Description,
                    Title = d.Title,
                    Level = d.Level
                })
                .OrderBy(d => d.Name)
                .ToListAsync();

            return Ok(designations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving designations");
            return StatusCode(500, "An error occurred while retrieving designations");
        }
    }

    // GET: api/lookup/salary-scales
    [HttpGet("salary-scales")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetSalaryScales([FromQuery] string? searchTerm = null)
    {
        try
        {
            var query = _context.SalaryScales.Where(s => !s.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(s =>
                    s.Scale.Contains(searchTerm) ||
                    (s.Grade != null && s.Grade.Contains(searchTerm)));
            }

            var salaryScales = await query
                .Select(s => new LookupDto
                {
                    PK = s.PK,
                    Name = s.Scale,
                    Code = s.Grade,
                    Description = s.Description,
                    Scale = s.Scale,
                    Grade = s.Grade,
                    MinSalary = s.MinSalary,
                    MaxSalary = s.MaxSalary
                })
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(salaryScales);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving salary scales");
            return StatusCode(500, "An error occurred while retrieving salary scales");
        }
    }

    // GET: api/lookup/sponsors
    [HttpGet("sponsors")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetSponsors([FromQuery] string? searchTerm = null)
    {
        try
        {
            var query = _context.Sponsors.Where(s => !s.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(s =>
                    s.Name.Contains(searchTerm) ||
                    (s.Type != null && s.Type.Contains(searchTerm)));
            }

            var sponsors = await query
                .Select(s => new LookupDto
                {
                    PK = s.PK,
                    Name = s.Name,
                    Code = s.Type,
                    Description = s.Description,
                    Type = s.Type
                })
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(sponsors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving sponsors");
            return StatusCode(500, "An error occurred while retrieving sponsors");
        }
    }

    // GET: api/lookup/allowance-types
    [HttpGet("allowance-types")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetAllowanceTypes([FromQuery] string? searchTerm = null)
    {
        try
        {
            // Note: LookupController still uses DbContext for now, but could be refactored to use UnitOfWork
            var query = _context.AllowanceTypes.Where(at => !at.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(at =>
                    at.Name.Contains(searchTerm) ||
                    (at.Description != null && at.Description.Contains(searchTerm)));
            }

            var allowanceTypes = await query
                .Select(at => new LookupDto
                {
                    PK = at.PK,
                    Name = at.Name,
                    Description = at.Description
                })
                .OrderBy(at => at.Name)
                .ToListAsync();

            return Ok(allowanceTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance types");
            return StatusCode(500, "An error occurred while retrieving allowance types");
        }
    }

    // GET: api/lookup/allowance-statuses
    [HttpGet("allowance-statuses")]
    public async Task<ActionResult<IEnumerable<LookupDto>>> GetAllowanceStatuses([FromQuery] string? searchTerm = null)
    {
        try
        {
            // Note: LookupController still uses DbContext for now, but could be refactored to use UnitOfWork
            var query = _context.AllowanceStatuses.Where(asts => !asts.Deleted);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(asts =>
                    asts.Name.Contains(searchTerm) ||
                    (asts.Description != null && asts.Description.Contains(searchTerm)));
            }

            var allowanceStatuses = await query
                .Select(asts => new LookupDto
                {
                    PK = asts.PK,
                    Name = asts.Name,
                    Description = asts.Description
                })
                .OrderBy(asts => asts.Name)
                .ToListAsync();

            return Ok(allowanceStatuses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance statuses");
            return StatusCode(500, "An error occurred while retrieving allowance statuses");
        }
    }

    // GET: api/lookup/all
    [HttpGet("all")]
    public async Task<ActionResult<object>> GetAllLookupData()
    {
        try
        {
            var departments = await _context.Departments
                .Where(d => !d.Deleted)
                .Select(d => new LookupDto
                {
                    PK = d.PK,
                    Name = d.Name,
                    Code = d.Code,
                    Description = d.Description
                })
                .OrderBy(d => d.Name)
                .ToListAsync();

            var facilities = await _context.Facilities
                .Where(f => !f.Deleted)
                .Select(f => new LookupDto
                {
                    PK = f.PK,
                    Name = f.Name,
                    Code = f.Code,
                    Description = f.Description,
                    Location = f.Location
                })
                .OrderBy(f => f.Name)
                .ToListAsync();

            var designations = await _context.Designations
                .Where(d => !d.Deleted)
                .Select(d => new LookupDto
                {
                    PK = d.PK,
                    Name = d.Title,
                    Code = d.Code,
                    Description = d.Description,
                    Title = d.Title,
                    Level = d.Level
                })
                .OrderBy(d => d.Name)
                .ToListAsync();

            var salaryScales = await _context.SalaryScales
                .Where(s => !s.Deleted)
                .Select(s => new LookupDto
                {
                    PK = s.PK,
                    Name = s.Scale,
                    Code = s.Grade,
                    Description = s.Description,
                    Scale = s.Scale,
                    Grade = s.Grade,
                    MinSalary = s.MinSalary,
                    MaxSalary = s.MaxSalary
                })
                .OrderBy(s => s.Name)
                .ToListAsync();

            var sponsors = await _context.Sponsors
                .Where(s => !s.Deleted)
                .Select(s => new LookupDto
                {
                    PK = s.PK,
                    Name = s.Name,
                    Code = s.Type,
                    Description = s.Description,
                    Type = s.Type
                })
                .OrderBy(s => s.Name)
                .ToListAsync();

            var allowanceTypes = await _context.AllowanceTypes
                .Where(at => !at.Deleted)
                .Select(at => new LookupDto
                {
                    PK = at.PK,
                    Name = at.Name,
                    Description = at.Description
                })
                .OrderBy(at => at.Name)
                .ToListAsync();

            var allowanceStatuses = await _context.AllowanceStatuses
                .Where(asts => !asts.Deleted)
                .Select(asts => new LookupDto
                {
                    PK = asts.PK,
                    Name = asts.Name,
                    Description = asts.Description
                })
                .OrderBy(asts => asts.Name)
                .ToListAsync();

            return Ok(new
            {
                Departments = departments,
                Facilities = facilities,
                Designations = designations,
                SalaryScales = salaryScales,
                Sponsors = sponsors,
                AllowanceTypes = allowanceTypes,
                AllowanceStatuses = allowanceStatuses
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all lookup data");
            return StatusCode(500, "An error occurred while retrieving lookup data");
        }
    }
}
