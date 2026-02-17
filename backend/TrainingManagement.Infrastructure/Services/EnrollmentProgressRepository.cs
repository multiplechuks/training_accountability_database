using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class EnrollmentProgressRepository : GenericRepository<EnrollmentProgress>, IEnrollmentProgressRepository
{
    public EnrollmentProgressRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<EnrollmentProgress>> GetByParticipantAsync(int participantId)
    {
        return await _dbSet
            .Where(ep => ep.ParticipantFK == participantId)
            .OrderByDescending(ep => ep.CreatedAt)
            .ToListAsync();
    }

    public async Task<EnrollmentProgress?> GetActiveProgressByParticipantAsync(int participantId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(ep => ep.ParticipantFK == participantId
                                    && ep.EnrollmentStatus == "In Progress");
    }

    public async Task<IEnumerable<EnrollmentProgress>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Where(ep => ep.EnrollmentStatus == status)
            .OrderByDescending(ep => ep.LastUpdated)
            .ToListAsync();
    }
}
