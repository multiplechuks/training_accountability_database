using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class NominationRepository : GenericRepository<Nomination>, INominationRepository
{
    public NominationRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Nomination>> GetByParticipantAsync(int participantId)
    {
        return await _dbSet
            .Where(n => n.ParticipantFK == participantId)
            .Include(n => n.Participant)
            .Include(n => n.Sponsor)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Nomination?> GetByIdWithRelatedAsync(int nominationId)
    {
        return await _dbSet
            .Include(n => n.Participant)
            .Include(n => n.Sponsor)
            .FirstOrDefaultAsync(n => n.PK == nominationId);
    }

    public async Task<IEnumerable<Nomination>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Where(n => n.NominationStatus == status)
            .Include(n => n.Participant)
            .OrderByDescending(n => n.NominationDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Nomination>> GetByYearAsync(int year)
    {
        return await _dbSet
            .Where(n => n.YearOfNomination == year)
            .Include(n => n.Participant)
            .Include(n => n.Sponsor)
            .OrderByDescending(n => n.NominationDate)
            .ToListAsync();
    }
}
