using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class TrainingTransferRepository : GenericRepository<TrainingTransfer>, ITrainingTransferRepository
{
    public TrainingTransferRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TrainingTransfer>> GetTransfersByParticipantAsync(int participantId)
    {
        return await _dbSet
            .Include(tt => tt.Participant)
            .Include(tt => tt.Training)
            .Where(tt => tt.ParticipantFK == participantId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TrainingTransfer>> GetTransfersByTrainingAsync(int trainingId)
    {
        return await _dbSet
            .Include(tt => tt.Participant)
            .Include(tt => tt.Training)
            .Where(tt => tt.TrainingFK == trainingId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TrainingTransfer>> GetTransfersByCountryAsync(string country)
    {
        return await _dbSet
            .Where(tt => tt.Country == country)
            .ToListAsync();
    }

    public async Task<IEnumerable<TrainingTransfer>> GetActiveTransfersAsync()
    {
        return await _dbSet
            .Where(tt => !tt.Deleted && tt.StartDate <= DateTime.Now && tt.EndDate > DateTime.Now)
            .ToListAsync();
    }
}
