using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceTypeRepository : GenericRepository<AllowanceType>, IAllowanceTypeRepository
{
    public AllowanceTypeRepository(TrainingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<AllowanceType>> SearchAllowanceTypesAsync(string searchTerm)
    {
        return await _dbSet
            .Where(at => !at.Deleted &&
                (at.Name.Contains(searchTerm) ||
                (at.Description != null && at.Description.Contains(searchTerm))))
            .OrderBy(at => at.Name)
            .ToListAsync();
    }

    public async Task<AllowanceType?> GetByNameAsync(string name)
    {
        return await _dbSet
            .Where(at => !at.Deleted && at.Name.ToLower() == name.ToLower())
            .FirstOrDefaultAsync();
    }

    public async Task<bool> IsNameUniqueAsync(string name, int? excludeId = null)
    {
        var query = _dbSet.Where(at => !at.Deleted && at.Name.ToLower() == name.ToLower());

        if (excludeId.HasValue)
        {
            query = query.Where(at => at.PK != excludeId.Value);
        }

        return !await query.AnyAsync();
    }

    public async Task<bool> HasAllowancesAsync(int allowanceTypeId)
    {
        return await _context.Allowances
            .AnyAsync(a => !a.Deleted && a.AllowanceTypeFK == allowanceTypeId);
    }
}
