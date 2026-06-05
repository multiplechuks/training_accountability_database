using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class ParticipantRepository : IParticipantRepository
{
    private readonly TrainingDbContext _db;
    public ParticipantRepository(TrainingDbContext db) => _db = db;

    public async Task<(IEnumerable<Participant> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search)
    {
        var query = _db.Participants.Where(p => !p.Deleted)
            .Include(p => p.Title).Include(p => p.IdType)
            .Include(p => p.Department).Include(p => p.SalaryScale).Include(p => p.DutyStation)
            .AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.Firstname.Contains(search) || p.Lastname.Contains(search) || p.IdNumber.Contains(search) || p.Email.Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query.OrderBy(p => p.Lastname).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<Participant?> GetByIdAsync(int id)
        => await _db.Participants.Where(p => !p.Deleted && p.PK == id)
            .Include(p => p.Title).Include(p => p.IdType)
            .Include(p => p.Department).Include(p => p.SalaryScale).Include(p => p.DutyStation)
            .Include(p => p.NextOfKin).ThenInclude(n => n!.RelationshipType)
            .FirstOrDefaultAsync();

    public async Task<Participant?> GetByIdNumberAsync(string idNumber)
        => await _db.Participants.FirstOrDefaultAsync(p => !p.Deleted && p.IdNumber == idNumber);

    public async Task<bool> IdNumberExistsAsync(string idNumber, int? excludeId = null)
        => await _db.Participants.AnyAsync(p => !p.Deleted && p.IdNumber == idNumber && (excludeId == null || p.PK != excludeId));

    public async Task<Participant> CreateAsync(Participant participant)
    {
        _db.Participants.Add(participant);
        await _db.SaveChangesAsync();
        return participant;
    }

    public async Task<Participant> UpdateAsync(Participant participant)
    {
        _db.Participants.Update(participant);
        await _db.SaveChangesAsync();
        return participant;
    }

    public async Task DeleteAsync(int id)
    {
        var p = await _db.Participants.FindAsync(id);
        if (p != null) { p.Deleted = true; await _db.SaveChangesAsync(); }
    }
}
