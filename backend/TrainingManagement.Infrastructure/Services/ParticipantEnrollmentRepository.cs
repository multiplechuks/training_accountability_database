using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class ParticipantEnrollmentRepository : GenericRepository<ParticipantEnrollment>, IParticipantEnrollmentRepository
{
    public ParticipantEnrollmentRepository(TrainingDbContext context) : base(context)
    {
    }

    public override async Task<ParticipantEnrollment?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(pe => pe.Participant)
            .Include(pe => pe.Training)
            .FirstOrDefaultAsync(pe => pe.PK == id);
    }

    public override async Task<IEnumerable<ParticipantEnrollment>> GetAllAsync()
    {
        return await _dbSet
            .Include(pe => pe.Participant)
            .Include(pe => pe.Training)
            .ToListAsync();
    }

    public async Task<IEnumerable<ParticipantEnrollment>> GetByParticipantAsync(int participantId)
    {
        return await _dbSet
            .Include(pe => pe.Participant)
            .Include(pe => pe.Training)
            .Where(pe => pe.ParticipantFK == participantId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ParticipantEnrollment>> GetByTrainingAsync(int trainingId)
    {
        return await _dbSet
            .Include(pe => pe.Participant)
            .Include(pe => pe.Training)
            .Where(pe => pe.TrainingFK == trainingId)
            .ToListAsync();
    }

    public async Task<ParticipantEnrollment?> GetByParticipantAndTrainingAsync(int participantId, int trainingId)
    {
        return await _dbSet
            .Include(pe => pe.Participant)
            .Include(pe => pe.Training)
            .FirstOrDefaultAsync(pe => pe.ParticipantFK == participantId && pe.TrainingFK == trainingId);
    }

    public async Task<bool> IsParticipantEnrolledAsync(int participantId, int trainingId)
    {
        return await _dbSet
            .AnyAsync(pe => pe.ParticipantFK == participantId && pe.TrainingFK == trainingId);
    }
}
