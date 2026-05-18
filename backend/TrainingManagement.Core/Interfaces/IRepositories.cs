using TrainingManagement.Core.Entities;

namespace TrainingManagement.Core.Interfaces;

public interface IParticipantRepository
{
    Task<(IEnumerable<Participant> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search);
    Task<Participant?> GetByIdAsync(int id);
    Task<Participant?> GetByIdNumberAsync(string idNumber);
    Task<bool> IdNumberExistsAsync(string idNumber, int? excludeId = null);
    Task<Participant> CreateAsync(Participant participant);
    Task<Participant> UpdateAsync(Participant participant);
    Task DeleteAsync(int id);
}

public interface INextOfKinRepository
{
    Task<NextOfKin?> GetByParticipantAsync(int participantId);
    Task<NextOfKin> UpsertAsync(NextOfKin nextOfKin);
}

public interface INominationRepository
{
    Task<(IEnumerable<Nomination> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, int? year);
    Task<Nomination?> GetByIdAsync(int id);
    Task<IEnumerable<Nomination>> GetByParticipantAsync(int participantId);
    Task<Nomination> CreateAsync(Nomination nomination);
    Task<Nomination> UpdateAsync(Nomination nomination);
    Task DeleteAsync(int id);
}

public interface IAdmissionRepository
{
    Task<(IEnumerable<Admission> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search);
    Task<Admission?> GetByIdAsync(int id);
    Task<Admission?> GetByNominationAsync(int nominationId);
    Task<Admission> CreateAsync(Admission admission);
    Task<Admission> UpdateAsync(Admission admission);
    Task DeleteAsync(int id);
}

public interface IAllowanceRepository
{
    Task<(IEnumerable<Allowance> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search);
    Task<Allowance?> GetByIdAsync(int id);
    Task<IEnumerable<Allowance>> GetByParticipantAsync(int participantId);
    Task<IEnumerable<Allowance>> GetByAdmissionAsync(int admissionId);
    Task<Allowance> CreateAsync(Allowance allowance);
    Task<Allowance> UpdateAsync(Allowance allowance);
    Task DeleteAsync(int id);
}

public interface IAllowanceTypeRepository
{
    Task<IEnumerable<AllowanceType>> GetAllAsync(string? search);
    Task<AllowanceType?> GetByIdAsync(int id);
    Task<bool> NameExistsAsync(string name, int? excludeId = null);
    Task<AllowanceType> CreateAsync(AllowanceType allowanceType);
    Task<AllowanceType> UpdateAsync(AllowanceType allowanceType);
    Task DeleteAsync(int id);
}

public interface IAllowanceStatusRepository
{
    Task<IEnumerable<AllowanceStatus>> GetAllAsync(string? search);
    Task<AllowanceStatus?> GetByIdAsync(int id);
    Task<bool> NameExistsAsync(string name, int? excludeId = null);
    Task<AllowanceStatus> CreateAsync(AllowanceStatus status);
    Task<AllowanceStatus> UpdateAsync(AllowanceStatus status);
    Task DeleteAsync(int id);
}

public interface ILookupRepository
{
    // Titles
    Task<IEnumerable<Title>> GetTitlesAsync(string? search);
    Task<Title?> GetTitleByIdAsync(int id);
    Task<Title> CreateTitleAsync(Title title);
    Task<Title> UpdateTitleAsync(Title title);
    Task DeleteTitleAsync(int id);

    // IdTypes
    Task<IEnumerable<IdType>> GetIdTypesAsync(string? search);
    Task<IdType?> GetIdTypeByIdAsync(int id);
    Task<IdType> CreateIdTypeAsync(IdType idType);
    Task<IdType> UpdateIdTypeAsync(IdType idType);
    Task DeleteIdTypeAsync(int id);

    // RelationshipTypes
    Task<IEnumerable<RelationshipType>> GetRelationshipTypesAsync(string? search);
    Task<RelationshipType?> GetRelationshipTypeByIdAsync(int id);
    Task<RelationshipType> CreateRelationshipTypeAsync(RelationshipType rt);
    Task<RelationshipType> UpdateRelationshipTypeAsync(RelationshipType rt);
    Task DeleteRelationshipTypeAsync(int id);

    // Departments
    Task<IEnumerable<Department>> GetDepartmentsAsync(string? search);
    Task<Department?> GetDepartmentByIdAsync(int id);
    Task<Department> CreateDepartmentAsync(Department dept);
    Task<Department> UpdateDepartmentAsync(Department dept);
    Task DeleteDepartmentAsync(int id);

    // SalaryScales
    Task<IEnumerable<SalaryScale>> GetSalaryScalesAsync(string? search);
    Task<SalaryScale?> GetSalaryScaleByIdAsync(int id);
    Task<SalaryScale> CreateSalaryScaleAsync(SalaryScale scale);
    Task<SalaryScale> UpdateSalaryScaleAsync(SalaryScale scale);
    Task DeleteSalaryScaleAsync(int id);

    // DutyStations
    Task<IEnumerable<DutyStation>> GetDutyStationsAsync(string? search);
    Task<DutyStation?> GetDutyStationByIdAsync(int id);
    Task<DutyStation> CreateDutyStationAsync(DutyStation station);
    Task<DutyStation> UpdateDutyStationAsync(DutyStation station);
    Task DeleteDutyStationAsync(int id);

    // SponsorTypes
    Task<IEnumerable<SponsorType>> GetSponsorTypesAsync(string? search);
    Task<SponsorType?> GetSponsorTypeByIdAsync(int id);
    Task<SponsorType> CreateSponsorTypeAsync(SponsorType sponsorType);
    Task<SponsorType> UpdateSponsorTypeAsync(SponsorType sponsorType);
    Task DeleteSponsorTypeAsync(int id);

    // Qualifications
    Task<IEnumerable<Qualification>> GetQualificationsAsync(string? search);
    Task<Qualification?> GetQualificationByIdAsync(int id);
    Task<Qualification> CreateQualificationAsync(Qualification qual);
    Task<Qualification> UpdateQualificationAsync(Qualification qual);
    Task DeleteQualificationAsync(int id);

    // NominatedPrograms
    Task<IEnumerable<NominatedProgram>> GetNominatedProgramsAsync(string? search, int? year);
    Task<NominatedProgram?> GetNominatedProgramByIdAsync(int id);
    Task<NominatedProgram> CreateNominatedProgramAsync(NominatedProgram program);
    Task<NominatedProgram> UpdateNominatedProgramAsync(NominatedProgram program);
    Task DeleteNominatedProgramAsync(int id);

    // AdmissionPrograms
    Task<IEnumerable<AdmissionProgram>> GetAdmissionProgramsAsync(string? search);
    Task<AdmissionProgram?> GetAdmissionProgramByIdAsync(int id);
    Task<AdmissionProgram> CreateAdmissionProgramAsync(AdmissionProgram program);
    Task<AdmissionProgram> UpdateAdmissionProgramAsync(AdmissionProgram program);
    Task DeleteAdmissionProgramAsync(int id);

    // ModesOfStudy
    Task<IEnumerable<ModeOfStudy>> GetModesOfStudyAsync(string? search);
    Task<ModeOfStudy?> GetModeOfStudyByIdAsync(int id);
    Task<ModeOfStudy> CreateModeOfStudyAsync(ModeOfStudy mode);
    Task<ModeOfStudy> UpdateModeOfStudyAsync(ModeOfStudy mode);
    Task DeleteModeOfStudyAsync(int id);
}
