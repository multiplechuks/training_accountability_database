using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceStatusRepository : GenericRepository<AllowanceStatus>, IAllowanceStatusRepository
{
    public AllowanceStatusRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<AllowanceStatus>> SearchAllowanceStatusesAsync(string searchTerm)
    {
        return await _dbSet
            .Where(asts => !asts.Deleted &&
                (asts.Name.Contains(searchTerm) ||
                (asts.Description != null && asts.Description.Contains(searchTerm))))
            .OrderBy(asts => asts.Name)
            .ToListAsync();
    }

    public async Task<AllowanceStatus?> GetByNameAsync(string name)
    {
        return await _dbSet
            .Where(asts => !asts.Deleted && asts.Name.ToLower() == name.ToLower())
            .FirstOrDefaultAsync();
    }

    public async Task<bool> IsNameUniqueAsync(string name, int? excludeId = null)
    {
        var query = _dbSet.Where(asts => !asts.Deleted && asts.Name.ToLower() == name.ToLower());

        if (excludeId.HasValue)
        {
            query = query.Where(asts => asts.PK != excludeId.Value);
        }

        return !await query.AnyAsync();
    }

    public async Task<bool> HasAllowancesAsync(int allowanceStatusId)
    {
        return await _context.Allowances
            .AnyAsync(a => !a.Deleted && a.StatusFK == allowanceStatusId);
    }
}
