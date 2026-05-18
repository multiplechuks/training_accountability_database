using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceRepository : IAllowanceRepository
{
    private readonly TrainingDbContext _db;
    public AllowanceRepository(TrainingDbContext db) => _db = db;

    private IQueryable<Allowance> BaseQuery()
        => _db.Allowances.Where(a => !a.Deleted)
            .Include(a => a.AllowanceType)
            .Include(a => a.AllowanceStatus)
            .Include(a => a.Participant);

    public async Task<(IEnumerable<Allowance> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search)
    {
        var query = BaseQuery();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a => a.Participant.Firstname.Contains(search) || a.Participant.Lastname.Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.StartDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<Allowance?> GetByIdAsync(int id)
        => await BaseQuery().FirstOrDefaultAsync(a => a.PK == id);

    public async Task<IEnumerable<Allowance>> GetByParticipantAsync(int participantId)
        => await BaseQuery().Where(a => a.ParticipantFK == participantId).ToListAsync();

    public async Task<IEnumerable<Allowance>> GetByAdmissionAsync(int admissionId)
        => await BaseQuery().Where(a => a.AdmissionFK == admissionId).ToListAsync();

    public async Task<Allowance> CreateAsync(Allowance allowance)
    {
        allowance.CreatedAt = DateTime.UtcNow;
        _db.Allowances.Add(allowance);
        await _db.SaveChangesAsync();
        return allowance;
    }

    public async Task<Allowance> UpdateAsync(Allowance allowance)
    {
        allowance.UpdatedAt = DateTime.UtcNow;
        _db.Allowances.Update(allowance);
        await _db.SaveChangesAsync();
        return allowance;
    }

    public async Task DeleteAsync(int id)
    {
        var a = await _db.Allowances.FindAsync(id);
        if (a != null) { a.Deleted = true; a.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }
    }
}
