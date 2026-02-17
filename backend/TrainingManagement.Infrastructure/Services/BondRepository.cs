using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class BondRepository : GenericRepository<Bond>, IBondRepository
{
    public BondRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<Bond?> GetByEnrollmentIdAsync(int enrollmentId)
    {
        return await _context.Bonds
            .FirstOrDefaultAsync(b => b.ParticipantEnrollmentFK == enrollmentId);
    }
}
