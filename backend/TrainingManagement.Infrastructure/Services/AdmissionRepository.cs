using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class AdmissionRepository : IAdmissionRepository
{
    private readonly TrainingDbContext _db;
    public AdmissionRepository(TrainingDbContext db) => _db = db;

    private IQueryable<Admission> BaseQuery()
        => _db.Admissions.Where(a => !a.Deleted)
            .Include(a => a.Nomination).ThenInclude(n => n.Participant)
            .Include(a => a.AdmissionProgram)
            .Include(a => a.ModeOfStudy);

    public async Task<(IEnumerable<Admission> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search)
    {
        var query = BaseQuery();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a => a.Nomination.Participant.Firstname.Contains(search) || a.Nomination.Participant.Lastname.Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.AdmissionDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<Admission?> GetByIdAsync(int id)
        => await BaseQuery().FirstOrDefaultAsync(a => a.PK == id);

    public async Task<Admission?> GetByNominationAsync(int nominationId)
        => await BaseQuery().FirstOrDefaultAsync(a => a.NominationFK == nominationId);

    public async Task<Admission> CreateAsync(Admission admission)
    {
        admission.CreatedAt = DateTime.UtcNow;
        _db.Admissions.Add(admission);
        await _db.SaveChangesAsync();
        return admission;
    }

    public async Task<Admission> UpdateAsync(Admission admission)
    {
        admission.UpdatedAt = DateTime.UtcNow;
        _db.Admissions.Update(admission);
        await _db.SaveChangesAsync();
        return admission;
    }

    public async Task DeleteAsync(int id)
    {
        var a = await _db.Admissions.FindAsync(id);
        if (a != null) { a.Deleted = true; a.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }
    }
}
