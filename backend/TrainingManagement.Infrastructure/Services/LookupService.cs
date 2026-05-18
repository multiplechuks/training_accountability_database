using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.Infrastructure.Services;

public class LookupService : ILookupService
{
    private readonly ILookupRepository _repo;
    public LookupService(ILookupRepository repo) => _repo = repo;

    public Task<IEnumerable<Title>> GetTitlesAsync(string? search) => _repo.GetTitlesAsync(search);
    public Task<Title?> GetTitleByIdAsync(int id) => _repo.GetTitleByIdAsync(id);
    public Task<Title> CreateTitleAsync(Title t) => _repo.CreateTitleAsync(t);
    public async Task<Title> UpdateTitleAsync(int id, Title t) { var e = await _repo.GetTitleByIdAsync(id) ?? throw new KeyNotFoundException("Title not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateTitleAsync(t); }
    public Task DeleteTitleAsync(int id) => _repo.DeleteTitleAsync(id);

    public Task<IEnumerable<IdType>> GetIdTypesAsync(string? search) => _repo.GetIdTypesAsync(search);
    public Task<IdType?> GetIdTypeByIdAsync(int id) => _repo.GetIdTypeByIdAsync(id);
    public Task<IdType> CreateIdTypeAsync(IdType t) => _repo.CreateIdTypeAsync(t);
    public async Task<IdType> UpdateIdTypeAsync(int id, IdType t) { var e = await _repo.GetIdTypeByIdAsync(id) ?? throw new KeyNotFoundException("IdType not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateIdTypeAsync(t); }
    public Task DeleteIdTypeAsync(int id) => _repo.DeleteIdTypeAsync(id);

    public Task<IEnumerable<RelationshipType>> GetRelationshipTypesAsync(string? search) => _repo.GetRelationshipTypesAsync(search);
    public Task<RelationshipType?> GetRelationshipTypeByIdAsync(int id) => _repo.GetRelationshipTypeByIdAsync(id);
    public Task<RelationshipType> CreateRelationshipTypeAsync(RelationshipType t) => _repo.CreateRelationshipTypeAsync(t);
    public async Task<RelationshipType> UpdateRelationshipTypeAsync(int id, RelationshipType t) { var e = await _repo.GetRelationshipTypeByIdAsync(id) ?? throw new KeyNotFoundException("RelationshipType not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateRelationshipTypeAsync(t); }
    public Task DeleteRelationshipTypeAsync(int id) => _repo.DeleteRelationshipTypeAsync(id);

    public Task<IEnumerable<Department>> GetDepartmentsAsync(string? search) => _repo.GetDepartmentsAsync(search);
    public Task<Department?> GetDepartmentByIdAsync(int id) => _repo.GetDepartmentByIdAsync(id);
    public Task<Department> CreateDepartmentAsync(Department t) => _repo.CreateDepartmentAsync(t);
    public async Task<Department> UpdateDepartmentAsync(int id, Department t) { var e = await _repo.GetDepartmentByIdAsync(id) ?? throw new KeyNotFoundException("Department not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateDepartmentAsync(t); }
    public Task DeleteDepartmentAsync(int id) => _repo.DeleteDepartmentAsync(id);

    public Task<IEnumerable<SalaryScale>> GetSalaryScalesAsync(string? search) => _repo.GetSalaryScalesAsync(search);
    public Task<SalaryScale?> GetSalaryScaleByIdAsync(int id) => _repo.GetSalaryScaleByIdAsync(id);
    public Task<SalaryScale> CreateSalaryScaleAsync(SalaryScale t) => _repo.CreateSalaryScaleAsync(t);
    public async Task<SalaryScale> UpdateSalaryScaleAsync(int id, SalaryScale t) { var e = await _repo.GetSalaryScaleByIdAsync(id) ?? throw new KeyNotFoundException("SalaryScale not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateSalaryScaleAsync(t); }
    public Task DeleteSalaryScaleAsync(int id) => _repo.DeleteSalaryScaleAsync(id);

    public Task<IEnumerable<DutyStation>> GetDutyStationsAsync(string? search) => _repo.GetDutyStationsAsync(search);
    public Task<DutyStation?> GetDutyStationByIdAsync(int id) => _repo.GetDutyStationByIdAsync(id);
    public Task<DutyStation> CreateDutyStationAsync(DutyStation t) => _repo.CreateDutyStationAsync(t);
    public async Task<DutyStation> UpdateDutyStationAsync(int id, DutyStation t) { var e = await _repo.GetDutyStationByIdAsync(id) ?? throw new KeyNotFoundException("DutyStation not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateDutyStationAsync(t); }
    public Task DeleteDutyStationAsync(int id) => _repo.DeleteDutyStationAsync(id);

    public Task<IEnumerable<SponsorType>> GetSponsorTypesAsync(string? search) => _repo.GetSponsorTypesAsync(search);
    public Task<SponsorType?> GetSponsorTypeByIdAsync(int id) => _repo.GetSponsorTypeByIdAsync(id);
    public Task<SponsorType> CreateSponsorTypeAsync(SponsorType t) => _repo.CreateSponsorTypeAsync(t);
    public async Task<SponsorType> UpdateSponsorTypeAsync(int id, SponsorType t) { var e = await _repo.GetSponsorTypeByIdAsync(id) ?? throw new KeyNotFoundException("SponsorType not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateSponsorTypeAsync(t); }
    public Task DeleteSponsorTypeAsync(int id) => _repo.DeleteSponsorTypeAsync(id);

    public Task<IEnumerable<Qualification>> GetQualificationsAsync(string? search) => _repo.GetQualificationsAsync(search);
    public Task<Qualification?> GetQualificationByIdAsync(int id) => _repo.GetQualificationByIdAsync(id);
    public Task<Qualification> CreateQualificationAsync(Qualification t) => _repo.CreateQualificationAsync(t);
    public async Task<Qualification> UpdateQualificationAsync(int id, Qualification t) { var e = await _repo.GetQualificationByIdAsync(id) ?? throw new KeyNotFoundException("Qualification not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateQualificationAsync(t); }
    public Task DeleteQualificationAsync(int id) => _repo.DeleteQualificationAsync(id);

    public Task<IEnumerable<NominatedProgram>> GetNominatedProgramsAsync(string? search, int? year) => _repo.GetNominatedProgramsAsync(search, year);
    public Task<NominatedProgram?> GetNominatedProgramByIdAsync(int id) => _repo.GetNominatedProgramByIdAsync(id);
    public Task<NominatedProgram> CreateNominatedProgramAsync(NominatedProgram t) => _repo.CreateNominatedProgramAsync(t);
    public async Task<NominatedProgram> UpdateNominatedProgramAsync(int id, NominatedProgram t) { var e = await _repo.GetNominatedProgramByIdAsync(id) ?? throw new KeyNotFoundException("NominatedProgram not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateNominatedProgramAsync(t); }
    public Task DeleteNominatedProgramAsync(int id) => _repo.DeleteNominatedProgramAsync(id);

    public Task<IEnumerable<AdmissionProgram>> GetAdmissionProgramsAsync(string? search) => _repo.GetAdmissionProgramsAsync(search);
    public Task<AdmissionProgram?> GetAdmissionProgramByIdAsync(int id) => _repo.GetAdmissionProgramByIdAsync(id);
    public Task<AdmissionProgram> CreateAdmissionProgramAsync(AdmissionProgram t) => _repo.CreateAdmissionProgramAsync(t);
    public async Task<AdmissionProgram> UpdateAdmissionProgramAsync(int id, AdmissionProgram t) { var e = await _repo.GetAdmissionProgramByIdAsync(id) ?? throw new KeyNotFoundException("AdmissionProgram not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateAdmissionProgramAsync(t); }
    public Task DeleteAdmissionProgramAsync(int id) => _repo.DeleteAdmissionProgramAsync(id);

    public Task<IEnumerable<ModeOfStudy>> GetModesOfStudyAsync(string? search) => _repo.GetModesOfStudyAsync(search);
    public Task<ModeOfStudy?> GetModeOfStudyByIdAsync(int id) => _repo.GetModeOfStudyByIdAsync(id);
    public Task<ModeOfStudy> CreateModeOfStudyAsync(ModeOfStudy t) => _repo.CreateModeOfStudyAsync(t);
    public async Task<ModeOfStudy> UpdateModeOfStudyAsync(int id, ModeOfStudy t) { var e = await _repo.GetModeOfStudyByIdAsync(id) ?? throw new KeyNotFoundException("ModeOfStudy not found."); t.PK = id; t.CreatedAt = e.CreatedAt; return await _repo.UpdateModeOfStudyAsync(t); }
    public Task DeleteModeOfStudyAsync(int id) => _repo.DeleteModeOfStudyAsync(id);
}
