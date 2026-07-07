using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.Infrastructure.Services;

public class NominationService : INominationService
{
    private readonly INominationRepository _repo;
    public NominationService(INominationRepository repo) => _repo = repo;

    public Task<(IEnumerable<Nomination> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, int? year, string? status = null, int? sponsorTypeId = null)
        => _repo.GetPagedAsync(page, pageSize, search, year, status, sponsorTypeId);

    public Task<Nomination?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

    public Task<IEnumerable<Nomination>> GetByParticipantAsync(int participantId) => _repo.GetByParticipantAsync(participantId);

    public Task<Nomination> CreateAsync(Nomination nomination) => _repo.CreateAsync(nomination);

    public async Task<Nomination> UpdateAsync(int id, Nomination nomination)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Nomination not found.");
        nomination.PK = id;
        nomination.CreatedAt = existing.CreatedAt;
        nomination.CreatedBy = existing.CreatedBy;
        return await _repo.UpdateAsync(nomination);
    }

    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}
