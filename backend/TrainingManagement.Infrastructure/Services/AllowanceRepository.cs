using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceRepository : GenericRepository<Allowance>, IAllowanceRepository
{
    public AllowanceRepository(TrainingDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Allowance>> GetAllAsync()
    {
        return await _dbSet
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Include(a => a.Participant)
            .Include(a => a.Training)
            .ToListAsync();
    }

    public async Task<IEnumerable<Allowance>> GetAllowancesByParticipantAsync(int participantId)
    {
        return await _dbSet
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Where(a => a.ParticipantFK == participantId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Allowance>> GetAllowancesByTrainingAsync(int trainingId)
    {
        return await _dbSet
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Where(a => a.TrainingFK == trainingId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Allowance>> GetAllowancesByStatusAsync(int statusId)
    {
        return await _dbSet
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Where(a => a.StatusFK == statusId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Allowance>> GetAllowancesByTypeAsync(int typeId)
    {
        return await _dbSet
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Where(a => a.AllowanceTypeFK == typeId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Allowance>> GetAllowancesInDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Where(a => a.StartDate >= startDate && a.EndDate <= endDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalAllowancesByParticipantAsync(int participantId)
    {
        return await _dbSet
            .Where(a => a.ParticipantFK == participantId)
            .SumAsync(a => a.Amount);
    }
}
