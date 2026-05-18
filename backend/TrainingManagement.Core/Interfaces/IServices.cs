using TrainingManagement.Core.Entities;

namespace TrainingManagement.Core.Interfaces;

public interface IParticipantService
{
    Task<(IEnumerable<Participant> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search);
    Task<Participant?> GetByIdAsync(int id);
    Task<Participant> CreateAsync(Participant participant);
    Task<Participant> UpdateAsync(int id, Participant participant);
    Task DeleteAsync(int id);
}

public interface INextOfKinService
{
    Task<NextOfKin?> GetByParticipantAsync(int participantId);
    Task<NextOfKin> UpsertAsync(int participantId, NextOfKin nextOfKin);
}

public interface INominationService
{
    Task<(IEnumerable<Nomination> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, int? year);
    Task<Nomination?> GetByIdAsync(int id);
    Task<IEnumerable<Nomination>> GetByParticipantAsync(int participantId);
    Task<Nomination> CreateAsync(Nomination nomination);
    Task<Nomination> UpdateAsync(int id, Nomination nomination);
    Task DeleteAsync(int id);
}

public interface IAdmissionService
{
    Task<(IEnumerable<Admission> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search);
    Task<Admission?> GetByIdAsync(int id);
    Task<Admission?> GetByNominationAsync(int nominationId);
    Task<Admission> CreateAsync(Admission admission, Stream? releaseLetterStream, string? releaseLetterFileName);
    Task<Admission> UpdateAsync(int id, Admission admission, Stream? releaseLetterStream, string? releaseLetterFileName);
    Task DeleteAsync(int id);
}

public interface IAllowanceService
{
    Task<(IEnumerable<Allowance> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search);
    Task<Allowance?> GetByIdAsync(int id);
    Task<IEnumerable<Allowance>> GetByParticipantAsync(int participantId);
    Task<IEnumerable<Allowance>> GetByAdmissionAsync(int admissionId);
    Task<Allowance> CreateAsync(Allowance allowance);
    Task<Allowance> UpdateAsync(int id, Allowance allowance);
    Task DeleteAsync(int id);
}

public interface IAllowanceTypeService
{
    Task<IEnumerable<AllowanceType>> GetAllAsync(string? search);
    Task<AllowanceType?> GetByIdAsync(int id);
    Task<AllowanceType> CreateAsync(AllowanceType allowanceType);
    Task<AllowanceType> UpdateAsync(int id, AllowanceType allowanceType);
    Task DeleteAsync(int id);
}

public interface IAllowanceStatusService
{
    Task<IEnumerable<AllowanceStatus>> GetAllAsync(string? search);
    Task<AllowanceStatus?> GetByIdAsync(int id);
    Task<AllowanceStatus> CreateAsync(AllowanceStatus status);
    Task<AllowanceStatus> UpdateAsync(int id, AllowanceStatus status);
    Task DeleteAsync(int id);
}

public interface ILookupService
{
    // Titles
    Task<IEnumerable<Title>> GetTitlesAsync(string? search);
    Task<Title?> GetTitleByIdAsync(int id);
    Task<Title> CreateTitleAsync(Title title);
    Task<Title> UpdateTitleAsync(int id, Title title);
    Task DeleteTitleAsync(int id);

    // IdTypes
    Task<IEnumerable<IdType>> GetIdTypesAsync(string? search);
    Task<IdType?> GetIdTypeByIdAsync(int id);
    Task<IdType> CreateIdTypeAsync(IdType idType);
    Task<IdType> UpdateIdTypeAsync(int id, IdType idType);
    Task DeleteIdTypeAsync(int id);

    // RelationshipTypes
    Task<IEnumerable<RelationshipType>> GetRelationshipTypesAsync(string? search);
    Task<RelationshipType?> GetRelationshipTypeByIdAsync(int id);
    Task<RelationshipType> CreateRelationshipTypeAsync(RelationshipType rt);
    Task<RelationshipType> UpdateRelationshipTypeAsync(int id, RelationshipType rt);
    Task DeleteRelationshipTypeAsync(int id);

    // Departments
    Task<IEnumerable<Department>> GetDepartmentsAsync(string? search);
    Task<Department?> GetDepartmentByIdAsync(int id);
    Task<Department> CreateDepartmentAsync(Department dept);
    Task<Department> UpdateDepartmentAsync(int id, Department dept);
    Task DeleteDepartmentAsync(int id);

    // SalaryScales
    Task<IEnumerable<SalaryScale>> GetSalaryScalesAsync(string? search);
    Task<SalaryScale?> GetSalaryScaleByIdAsync(int id);
    Task<SalaryScale> CreateSalaryScaleAsync(SalaryScale scale);
    Task<SalaryScale> UpdateSalaryScaleAsync(int id, SalaryScale scale);
    Task DeleteSalaryScaleAsync(int id);

    // DutyStations
    Task<IEnumerable<DutyStation>> GetDutyStationsAsync(string? search);
    Task<DutyStation?> GetDutyStationByIdAsync(int id);
    Task<DutyStation> CreateDutyStationAsync(DutyStation station);
    Task<DutyStation> UpdateDutyStationAsync(int id, DutyStation station);
    Task DeleteDutyStationAsync(int id);

    // SponsorTypes
    Task<IEnumerable<SponsorType>> GetSponsorTypesAsync(string? search);
    Task<SponsorType?> GetSponsorTypeByIdAsync(int id);
    Task<SponsorType> CreateSponsorTypeAsync(SponsorType sponsorType);
    Task<SponsorType> UpdateSponsorTypeAsync(int id, SponsorType sponsorType);
    Task DeleteSponsorTypeAsync(int id);

    // Qualifications
    Task<IEnumerable<Qualification>> GetQualificationsAsync(string? search);
    Task<Qualification?> GetQualificationByIdAsync(int id);
    Task<Qualification> CreateQualificationAsync(Qualification qual);
    Task<Qualification> UpdateQualificationAsync(int id, Qualification qual);
    Task DeleteQualificationAsync(int id);

    // NominatedPrograms
    Task<IEnumerable<NominatedProgram>> GetNominatedProgramsAsync(string? search, int? year);
    Task<NominatedProgram?> GetNominatedProgramByIdAsync(int id);
    Task<NominatedProgram> CreateNominatedProgramAsync(NominatedProgram program);
    Task<NominatedProgram> UpdateNominatedProgramAsync(int id, NominatedProgram program);
    Task DeleteNominatedProgramAsync(int id);

    // AdmissionPrograms
    Task<IEnumerable<AdmissionProgram>> GetAdmissionProgramsAsync(string? search);
    Task<AdmissionProgram?> GetAdmissionProgramByIdAsync(int id);
    Task<AdmissionProgram> CreateAdmissionProgramAsync(AdmissionProgram program);
    Task<AdmissionProgram> UpdateAdmissionProgramAsync(int id, AdmissionProgram program);
    Task DeleteAdmissionProgramAsync(int id);

    // ModesOfStudy
    Task<IEnumerable<ModeOfStudy>> GetModesOfStudyAsync(string? search);
    Task<ModeOfStudy?> GetModeOfStudyByIdAsync(int id);
    Task<ModeOfStudy> CreateModeOfStudyAsync(ModeOfStudy mode);
    Task<ModeOfStudy> UpdateModeOfStudyAsync(int id, ModeOfStudy mode);
    Task DeleteModeOfStudyAsync(int id);
}
