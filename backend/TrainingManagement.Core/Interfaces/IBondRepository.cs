namespace TrainingManagement.Core.Interfaces;

using TrainingManagement.Core.Entities;

public interface IBondRepository : IGenericRepository<Bond>
{
    Task<Bond?> GetByEnrollmentIdAsync(int enrollmentId);
}
