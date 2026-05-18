using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.Infrastructure.Services;

public class NextOfKinService : INextOfKinService
{
    private readonly INextOfKinRepository _repo;
    public NextOfKinService(INextOfKinRepository repo) => _repo = repo;

    public Task<NextOfKin?> GetByParticipantAsync(int participantId) => _repo.GetByParticipantAsync(participantId);

    public Task<NextOfKin> UpsertAsync(int participantId, NextOfKin nextOfKin)
    {
        nextOfKin.ParticipantFK = participantId;
        return _repo.UpsertAsync(nextOfKin);
    }
}
