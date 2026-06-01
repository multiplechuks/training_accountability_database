using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class NominationRepository : INominationRepository
{
    private readonly TrainingDbContext _db;
    public NominationRepository(TrainingDbContext db) => _db = db;

    private IQueryable<Nomination> BaseQuery()
        => _db.Nominations.Where(n => !n.Deleted)
            .Include(n => n.Participant)
            .Include(n => n.Qualification)
            .Include(n => n.NominatedProgram)
            .Include(n => n.SponsorType)
            .Include(n => n.Admission).ThenInclude(a => a.AdmissionProgram);

    public async Task<(IEnumerable<Nomination> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, int? year)
    {
        var query = BaseQuery();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(n => n.Participant.Firstname.Contains(search) || n.Participant.Lastname.Contains(search));
        }

        if (year.HasValue)
        {
            query = query.Where(n => n.YearOfNomination == year.Value);
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(n => n.NominationDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<Nomination?> GetByIdAsync(int id)
        => await BaseQuery().FirstOrDefaultAsync(n => n.PK == id);

    public async Task<IEnumerable<Nomination>> GetByParticipantAsync(int participantId)
        => await BaseQuery().Where(n => n.ParticipantFK == participantId).OrderByDescending(n => n.YearOfNomination).ToListAsync();

    public async Task<Nomination> CreateAsync(Nomination nomination)
    {
        nomination.CreatedAt = DateTime.UtcNow;
        _db.Nominations.Add(nomination);
        await _db.SaveChangesAsync();
        return nomination;
    }

    public async Task<Nomination> UpdateAsync(Nomination nomination)
    {
        nomination.UpdatedAt = DateTime.UtcNow;
        _db.Nominations.Update(nomination);
        await _db.SaveChangesAsync();
        return nomination;
    }

    public async Task DeleteAsync(int id)
    {
        var n = await _db.Nominations.FindAsync(id);
        if (n != null) { n.Deleted = true; n.UpdatedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }
    }
}
