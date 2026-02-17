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
    IEnrollmentProgressRepository EnrollmentProgress { get; }
    INominationRepository Nominations { get; }
    INextOfKinRepository NextOfKins { get; }
    IBondRepository Bonds { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
