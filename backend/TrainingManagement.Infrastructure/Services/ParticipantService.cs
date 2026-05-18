using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.Infrastructure.Services;

public class ParticipantService : IParticipantService
{
    private readonly IParticipantRepository _repo;
    public ParticipantService(IParticipantRepository repo) => _repo = repo;

    public Task<(IEnumerable<Participant> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search)
        => _repo.GetPagedAsync(page, pageSize, search);

    public Task<Participant?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

    public async Task<Participant> CreateAsync(Participant participant)
    {
        if (await _repo.IdNumberExistsAsync(participant.IdNumber))
        {
            throw new InvalidOperationException($"A participant with ID number '{participant.IdNumber}' already exists.");
        }

        return await _repo.CreateAsync(participant);
    }

    public async Task<Participant> UpdateAsync(int id, Participant participant)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Participant not found.");
        if (await _repo.IdNumberExistsAsync(participant.IdNumber, id))
        {
            throw new InvalidOperationException($"A participant with ID number '{participant.IdNumber}' already exists.");
        }

        participant.PK = id;
        participant.CreatedAt = existing.CreatedAt;
        participant.CreatedBy = existing.CreatedBy;
        return await _repo.UpdateAsync(participant);
    }

    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}
