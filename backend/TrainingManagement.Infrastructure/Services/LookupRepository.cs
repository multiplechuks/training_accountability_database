using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class LookupRepository : ILookupRepository
{
    private readonly TrainingDbContext _db;
    public LookupRepository(TrainingDbContext db) => _db = db;

    // Titles
    public async Task<IEnumerable<Title>> GetTitlesAsync(string? search)
    {
        var q = _db.Titles.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<Title?> GetTitleByIdAsync(int id) => await _db.Titles.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<Title> CreateTitleAsync(Title t) { t.CreatedAt = DateTime.UtcNow; _db.Titles.Add(t); await _db.SaveChangesAsync(); return t; }
    public async Task<Title> UpdateTitleAsync(Title t) { t.UpdatedAt = DateTime.UtcNow; _db.Titles.Update(t); await _db.SaveChangesAsync(); return t; }
    public async Task DeleteTitleAsync(int id) { var e = await _db.Titles.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // IdTypes
    public async Task<IEnumerable<IdType>> GetIdTypesAsync(string? search)
    {
        var q = _db.IdTypes.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<IdType?> GetIdTypeByIdAsync(int id) => await _db.IdTypes.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<IdType> CreateIdTypeAsync(IdType e) { e.CreatedAt = DateTime.UtcNow; _db.IdTypes.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<IdType> UpdateIdTypeAsync(IdType e) { e.UpdatedAt = DateTime.UtcNow; _db.IdTypes.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteIdTypeAsync(int id) { var e = await _db.IdTypes.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // RelationshipTypes
    public async Task<IEnumerable<RelationshipType>> GetRelationshipTypesAsync(string? search)
    {
        var q = _db.RelationshipTypes.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<RelationshipType?> GetRelationshipTypeByIdAsync(int id) => await _db.RelationshipTypes.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<RelationshipType> CreateRelationshipTypeAsync(RelationshipType e) { e.CreatedAt = DateTime.UtcNow; _db.RelationshipTypes.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<RelationshipType> UpdateRelationshipTypeAsync(RelationshipType e) { e.UpdatedAt = DateTime.UtcNow; _db.RelationshipTypes.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteRelationshipTypeAsync(int id) { var e = await _db.RelationshipTypes.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // Departments
    public async Task<IEnumerable<Department>> GetDepartmentsAsync(string? search)
    {
        var q = _db.Departments.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<Department?> GetDepartmentByIdAsync(int id) => await _db.Departments.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<Department> CreateDepartmentAsync(Department e) { e.CreatedAt = DateTime.UtcNow; _db.Departments.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<Department> UpdateDepartmentAsync(Department e) { e.UpdatedAt = DateTime.UtcNow; _db.Departments.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteDepartmentAsync(int id) { var e = await _db.Departments.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // SalaryScales
    public async Task<IEnumerable<SalaryScale>> GetSalaryScalesAsync(string? search)
    {
        var q = _db.SalaryScales.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Scale.Contains(search));
        }

        return await q.OrderBy(x => x.Scale).ToListAsync();
    }
    public async Task<SalaryScale?> GetSalaryScaleByIdAsync(int id) => await _db.SalaryScales.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<SalaryScale> CreateSalaryScaleAsync(SalaryScale e) { e.CreatedAt = DateTime.UtcNow; _db.SalaryScales.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<SalaryScale> UpdateSalaryScaleAsync(SalaryScale e) { e.UpdatedAt = DateTime.UtcNow; _db.SalaryScales.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteSalaryScaleAsync(int id) { var e = await _db.SalaryScales.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // DutyStations
    public async Task<IEnumerable<DutyStation>> GetDutyStationsAsync(string? search)
    {
        var q = _db.DutyStations.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<DutyStation?> GetDutyStationByIdAsync(int id) => await _db.DutyStations.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<DutyStation> CreateDutyStationAsync(DutyStation e) { e.CreatedAt = DateTime.UtcNow; _db.DutyStations.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<DutyStation> UpdateDutyStationAsync(DutyStation e) { e.UpdatedAt = DateTime.UtcNow; _db.DutyStations.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteDutyStationAsync(int id) { var e = await _db.DutyStations.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // SponsorTypes
    public async Task<IEnumerable<SponsorType>> GetSponsorTypesAsync(string? search)
    {
        var q = _db.SponsorTypes.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<SponsorType?> GetSponsorTypeByIdAsync(int id) => await _db.SponsorTypes.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<SponsorType> CreateSponsorTypeAsync(SponsorType e) { e.CreatedAt = DateTime.UtcNow; _db.SponsorTypes.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<SponsorType> UpdateSponsorTypeAsync(SponsorType e) { e.UpdatedAt = DateTime.UtcNow; _db.SponsorTypes.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteSponsorTypeAsync(int id) { var e = await _db.SponsorTypes.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // Qualifications
    public async Task<IEnumerable<Qualification>> GetQualificationsAsync(string? search)
    {
        var q = _db.Qualifications.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<Qualification?> GetQualificationByIdAsync(int id) => await _db.Qualifications.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<Qualification> CreateQualificationAsync(Qualification e) { e.CreatedAt = DateTime.UtcNow; _db.Qualifications.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<Qualification> UpdateQualificationAsync(Qualification e) { e.UpdatedAt = DateTime.UtcNow; _db.Qualifications.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteQualificationAsync(int id) { var e = await _db.Qualifications.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // NominatedPrograms
    public async Task<IEnumerable<NominatedProgram>> GetNominatedProgramsAsync(string? search, int? year)
    {
        var q = _db.NominatedPrograms.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        if (year.HasValue)
        {
            q = q.Where(x => x.Year == year.Value);
        }

        return await q.OrderBy(x => x.Year).ThenBy(x => x.Name).ToListAsync();
    }
    public async Task<NominatedProgram?> GetNominatedProgramByIdAsync(int id) => await _db.NominatedPrograms.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<NominatedProgram> CreateNominatedProgramAsync(NominatedProgram e) { e.CreatedAt = DateTime.UtcNow; _db.NominatedPrograms.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<NominatedProgram> UpdateNominatedProgramAsync(NominatedProgram e) { e.UpdatedAt = DateTime.UtcNow; _db.NominatedPrograms.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteNominatedProgramAsync(int id) { var e = await _db.NominatedPrograms.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // AdmissionPrograms
    public async Task<IEnumerable<AdmissionProgram>> GetAdmissionProgramsAsync(string? search)
    {
        var q = _db.AdmissionPrograms.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<AdmissionProgram?> GetAdmissionProgramByIdAsync(int id) => await _db.AdmissionPrograms.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<AdmissionProgram> CreateAdmissionProgramAsync(AdmissionProgram e) { e.CreatedAt = DateTime.UtcNow; _db.AdmissionPrograms.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<AdmissionProgram> UpdateAdmissionProgramAsync(AdmissionProgram e) { e.UpdatedAt = DateTime.UtcNow; _db.AdmissionPrograms.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteAdmissionProgramAsync(int id) { var e = await _db.AdmissionPrograms.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }

    // ModesOfStudy
    public async Task<IEnumerable<ModeOfStudy>> GetModesOfStudyAsync(string? search)
    {
        var q = _db.ModesOfStudy.Where(x => !x.Deleted && x.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            q = q.Where(x => x.Name.Contains(search));
        }

        return await q.OrderBy(x => x.Name).ToListAsync();
    }
    public async Task<ModeOfStudy?> GetModeOfStudyByIdAsync(int id) => await _db.ModesOfStudy.FirstOrDefaultAsync(x => !x.Deleted && x.PK == id);
    public async Task<ModeOfStudy> CreateModeOfStudyAsync(ModeOfStudy e) { e.CreatedAt = DateTime.UtcNow; _db.ModesOfStudy.Add(e); await _db.SaveChangesAsync(); return e; }
    public async Task<ModeOfStudy> UpdateModeOfStudyAsync(ModeOfStudy e) { e.UpdatedAt = DateTime.UtcNow; _db.ModesOfStudy.Update(e); await _db.SaveChangesAsync(); return e; }
    public async Task DeleteModeOfStudyAsync(int id) { var e = await _db.ModesOfStudy.FindAsync(id); if (e != null) { e.Deleted = true; e.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); } }
}
