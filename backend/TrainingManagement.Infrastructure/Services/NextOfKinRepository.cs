using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class NextOfKinRepository : INextOfKinRepository
{
    private readonly TrainingDbContext _db;
    public NextOfKinRepository(TrainingDbContext db) => _db = db;

    public async Task<NextOfKin?> GetByParticipantAsync(int participantId)
        => await _db.NextOfKins.Include(n => n.RelationshipType)
            .FirstOrDefaultAsync(n => !n.Deleted && n.ParticipantFK == participantId);

    public async Task<NextOfKin> UpsertAsync(NextOfKin nextOfKin)
    {
        var existing = await _db.NextOfKins.FirstOrDefaultAsync(n => n.ParticipantFK == nextOfKin.ParticipantFK);
        if (existing == null)
        {
            nextOfKin.CreatedAt = DateTime.UtcNow;
            _db.NextOfKins.Add(nextOfKin);
        }
        else
        {
            existing.FullName = nextOfKin.FullName;
            existing.RelationshipTypeFK = nextOfKin.RelationshipTypeFK;
            existing.Phone = nextOfKin.Phone;
            existing.Email = nextOfKin.Email;
            existing.IdNumber = nextOfKin.IdNumber;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return existing ?? nextOfKin;
    }
}
