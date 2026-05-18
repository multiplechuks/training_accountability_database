using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceStatusRepository : IAllowanceStatusRepository
{
    private readonly TrainingDbContext _db;
    public AllowanceStatusRepository(TrainingDbContext db) => _db = db;

    public async Task<IEnumerable<AllowanceStatus>> GetAllAsync(string? search)
    {
        var query = _db.AllowanceStatuses.Where(s => !s.Deleted).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(s => s.Name.Contains(search));
        }

        return await query.OrderBy(s => s.Name).ToListAsync();
    }

    public async Task<AllowanceStatus?> GetByIdAsync(int id)
        => await _db.AllowanceStatuses.FirstOrDefaultAsync(s => !s.Deleted && s.PK == id);

    public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        => await _db.AllowanceStatuses.AnyAsync(s => !s.Deleted && s.Name == name && (excludeId == null || s.PK != excludeId));

    public async Task<AllowanceStatus> CreateAsync(AllowanceStatus s)
    {
        s.CreatedAt = DateTime.UtcNow;
        _db.AllowanceStatuses.Add(s);
        await _db.SaveChangesAsync();
        return s;
    }

    public async Task<AllowanceStatus> UpdateAsync(AllowanceStatus s)
    {
        s.UpdatedAt = DateTime.UtcNow;
        _db.AllowanceStatuses.Update(s);
        await _db.SaveChangesAsync();
        return s;
    }

    public async Task DeleteAsync(int id)
    {
        var s = await _db.AllowanceStatuses.FindAsync(id);
        if (s != null) { s.Deleted = true; s.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }
    }
}
