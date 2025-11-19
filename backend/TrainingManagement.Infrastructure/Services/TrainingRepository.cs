using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class TrainingRepository : GenericRepository<Training>, ITrainingRepository
{
    public TrainingRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Training>> GetTrainingsByInstitutionAsync(string institution)
    {
        return await _dbSet
            .Where(t => t.Institution.Contains(institution))
            .ToListAsync();
    }

    public async Task<IEnumerable<Training>> GetTrainingsByCountryAsync(string country)
    {
        return await _dbSet
            .Where(t => t.CountryOfStudy == country)
            .ToListAsync();
    }

    public async Task<IEnumerable<Training>> GetTrainingsByFinancialYearAsync(string financialYear)
    {
        return await _dbSet
            .Where(t => t.FinancialYear == financialYear)
            .ToListAsync();
    }

    public async Task<Training?> GetWithParticipantsAsync(int trainingId)
    {
        return await _dbSet
            .Include(t => t.ParticipantEnrollments)
            .ThenInclude(pe => pe.Participant)
            .FirstOrDefaultAsync(t => t.PK == trainingId);
    }

    public async Task<IEnumerable<Training>> SearchTrainingsAsync(string searchTerm)
    {
        return await _dbSet
            .Where(t => t.Institution.Contains(searchTerm) ||
                       t.Program.Contains(searchTerm) ||
                       t.CountryOfStudy.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<IEnumerable<Training>> GetActiveTrainingsAsync()
    {
        return await _dbSet
            .Where(t => !t.Deleted && t.EndDate > DateTime.Now)
            .ToListAsync();
    }
}
