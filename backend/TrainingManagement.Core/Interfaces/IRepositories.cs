using TrainingManagement.Core.Entities;

namespace TrainingManagement.Core.Interfaces;

public interface IParticipantRepository : IGenericRepository<Participant>
{
    Task<IEnumerable<Participant>> SearchParticipantsAsync(string searchTerm);
    Task<Participant?> GetByIdNumberAsync(string idNumber);
    Task<IEnumerable<Participant>> GetParticipantsByStatusAsync(string status);
    Task<Participant?> GetWithEnrollmentsAsync(int participantId);
    Task<bool> IsIdNumberUniqueAsync(string idNumber, int? excludeParticipantId = null);
}

public interface ITrainingRepository : IGenericRepository<Training>
{
    Task<IEnumerable<Training>> GetTrainingsByInstitutionAsync(string institution);
    Task<IEnumerable<Training>> GetTrainingsByCountryAsync(string country);
    Task<IEnumerable<Training>> GetTrainingsByFinancialYearAsync(string financialYear);
    Task<Training?> GetWithParticipantsAsync(int trainingId);
    Task<IEnumerable<Training>> SearchTrainingsAsync(string searchTerm);
    Task<IEnumerable<Training>> GetActiveTrainingsAsync();
}

public interface IParticipantEnrollmentRepository : IGenericRepository<ParticipantEnrollment>
{
    Task<IEnumerable<ParticipantEnrollment>> GetByParticipantAsync(int participantId);
    Task<IEnumerable<ParticipantEnrollment>> GetByTrainingAsync(int trainingId);
    Task<ParticipantEnrollment?> GetByParticipantAndTrainingAsync(int participantId, int trainingId);
    Task<bool> IsParticipantEnrolledAsync(int participantId, int trainingId);
}

public interface IAllowanceRepository : IGenericRepository<Allowance>
{
    Task<IEnumerable<Allowance>> GetAllowancesByParticipantAsync(int participantId);
    Task<IEnumerable<Allowance>> GetAllowancesByTrainingAsync(int trainingId);
    Task<IEnumerable<Allowance>> GetAllowancesByStatusAsync(int statusId);
    Task<IEnumerable<Allowance>> GetAllowancesByTypeAsync(int typeId);
    Task<IEnumerable<Allowance>> GetAllowancesInDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<decimal> GetTotalAllowancesByParticipantAsync(int participantId);
}

public interface ITrainingTransferRepository : IGenericRepository<TrainingTransfer>
{
    Task<IEnumerable<TrainingTransfer>> GetTransfersByParticipantAsync(int participantId);
    Task<IEnumerable<TrainingTransfer>> GetTransfersByTrainingAsync(int trainingId);
    Task<IEnumerable<TrainingTransfer>> GetTransfersByCountryAsync(string country);
    Task<IEnumerable<TrainingTransfer>> GetActiveTransfersAsync();
}

public interface IAllowanceTypeRepository : IGenericRepository<AllowanceType>
{
    Task<IEnumerable<AllowanceType>> SearchAllowanceTypesAsync(string searchTerm);
    Task<AllowanceType?> GetByNameAsync(string name);
    Task<bool> IsNameUniqueAsync(string name, int? excludeId = null);
    Task<bool> HasAllowancesAsync(int allowanceTypeId);
}

public interface IAllowanceStatusRepository : IGenericRepository<AllowanceStatus>
{
    Task<IEnumerable<AllowanceStatus>> SearchAllowanceStatusesAsync(string searchTerm);
    Task<AllowanceStatus?> GetByNameAsync(string name);
    Task<bool> IsNameUniqueAsync(string name, int? excludeId = null);
    Task<bool> HasAllowancesAsync(int allowanceStatusId);
}
