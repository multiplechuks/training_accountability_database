using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class NextOfKinRepository : GenericRepository<NextOfKin>, INextOfKinRepository
{
    public NextOfKinRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<NextOfKin>> GetByParticipantIdAsync(int participantId)
    {
        return await _context.NextOfKins
            .Where(n => n.ParticipantFK == participantId)
            .ToListAsync();
    }
}
