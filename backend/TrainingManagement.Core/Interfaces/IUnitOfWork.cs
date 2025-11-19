namespace TrainingManagement.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IParticipantRepository Participants { get; }
    ITrainingRepository Trainings { get; }
    IParticipantEnrollmentRepository ParticipantEnrollments { get; }
    IAllowanceRepository Allowances { get; }
    ITrainingTransferRepository TrainingTransfers { get; }
    IAllowanceTypeRepository AllowanceTypes { get; }
    IAllowanceStatusRepository AllowanceStatuses { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
