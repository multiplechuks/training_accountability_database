namespace TrainingManagement.Core.Interfaces;

using TrainingManagement.Core.Entities;

public interface INextOfKinRepository : IGenericRepository<NextOfKin>
{
    Task<IEnumerable<NextOfKin>> GetByParticipantIdAsync(int participantId);
}
