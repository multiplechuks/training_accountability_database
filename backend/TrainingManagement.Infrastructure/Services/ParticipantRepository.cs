using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class ParticipantRepository : GenericRepository<Participant>, IParticipantRepository
{
    public ParticipantRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Participant>> SearchParticipantsAsync(string searchTerm)
    {
        return await _dbSet
            .Where(p => p.Firstname.Contains(searchTerm) ||
                       p.Lastname.Contains(searchTerm) ||
                       p.IdNo.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<Participant?> GetByIdNumberAsync(string idNumber)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.IdNo == idNumber);
    }

    public async Task<IEnumerable<Participant>> GetParticipantsByStatusAsync(string status)
    {
        // Since Participant doesn't have a Status field, let's filter by a different criteria
        // or we can add status to the base entity
        return await _dbSet
            .Where(p => !p.Deleted) // Using the BaseEntity Deleted field instead
            .ToListAsync();
    }

    public async Task<Participant?> GetWithEnrollmentsAsync(int participantId)
    {
        return await _dbSet
            .Include(p => p.ParticipantEnrollments)
            .ThenInclude(pe => pe.Training)
            .FirstOrDefaultAsync(p => p.PK == participantId);
    }

    public async Task<bool> IsIdNumberUniqueAsync(string idNumber, int? excludeParticipantId = null)
    {
        var query = _dbSet.Where(p => p.IdNo == idNumber);

        if (excludeParticipantId.HasValue)
        {
            query = query.Where(p => p.PK != excludeParticipantId.Value);
        }

        return !await query.AnyAsync();
    }
}
