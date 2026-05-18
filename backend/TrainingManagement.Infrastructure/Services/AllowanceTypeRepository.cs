using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceTypeRepository : IAllowanceTypeRepository
{
    private readonly TrainingDbContext _db;
    public AllowanceTypeRepository(TrainingDbContext db) => _db = db;

    public async Task<IEnumerable<AllowanceType>> GetAllAsync(string? search)
    {
        var query = _db.AllowanceTypes.Where(t => !t.Deleted).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(t => t.Name.Contains(search));
        }

        return await query.OrderBy(t => t.Name).ToListAsync();
    }

    public async Task<AllowanceType?> GetByIdAsync(int id)
        => await _db.AllowanceTypes.FirstOrDefaultAsync(t => !t.Deleted && t.PK == id);

    public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        => await _db.AllowanceTypes.AnyAsync(t => !t.Deleted && t.Name == name && (excludeId == null || t.PK != excludeId));

    public async Task<AllowanceType> CreateAsync(AllowanceType t)
    {
        t.CreatedAt = DateTime.UtcNow;
        _db.AllowanceTypes.Add(t);
        await _db.SaveChangesAsync();
        return t;
    }

    public async Task<AllowanceType> UpdateAsync(AllowanceType t)
    {
        t.UpdatedAt = DateTime.UtcNow;
        _db.AllowanceTypes.Update(t);
        await _db.SaveChangesAsync();
        return t;
    }

    public async Task DeleteAsync(int id)
    {
        var t = await _db.AllowanceTypes.FindAsync(id);
        if (t != null) { t.Deleted = true; t.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }
    }
}
