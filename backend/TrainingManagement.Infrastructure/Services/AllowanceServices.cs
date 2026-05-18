using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.Infrastructure.Services;

public class AllowanceService : IAllowanceService
{
    private readonly IAllowanceRepository _repo;
    public AllowanceService(IAllowanceRepository repo) => _repo = repo;

    public Task<(IEnumerable<Allowance> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search) => _repo.GetPagedAsync(page, pageSize, search);
    public Task<Allowance?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
    public Task<IEnumerable<Allowance>> GetByParticipantAsync(int participantId) => _repo.GetByParticipantAsync(participantId);
    public Task<IEnumerable<Allowance>> GetByAdmissionAsync(int admissionId) => _repo.GetByAdmissionAsync(admissionId);
    public Task<Allowance> CreateAsync(Allowance allowance) => _repo.CreateAsync(allowance);
    public async Task<Allowance> UpdateAsync(int id, Allowance allowance)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Allowance not found.");
        allowance.PK = id; allowance.CreatedAt = existing.CreatedAt; allowance.CreatedBy = existing.CreatedBy;
        return await _repo.UpdateAsync(allowance);
    }
    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}

public class AllowanceTypeService : IAllowanceTypeService
{
    private readonly IAllowanceTypeRepository _repo;
    public AllowanceTypeService(IAllowanceTypeRepository repo) => _repo = repo;

    public Task<IEnumerable<AllowanceType>> GetAllAsync(string? search) => _repo.GetAllAsync(search);
    public Task<AllowanceType?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
    public async Task<AllowanceType> CreateAsync(AllowanceType t)
    {
        if (await _repo.NameExistsAsync(t.Name))
        {
            throw new InvalidOperationException($"Allowance type '{t.Name}' already exists.");
        }

        return await _repo.CreateAsync(t);
    }
    public async Task<AllowanceType> UpdateAsync(int id, AllowanceType t)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Allowance type not found.");
        if (await _repo.NameExistsAsync(t.Name, id))
        {
            throw new InvalidOperationException($"Allowance type '{t.Name}' already exists.");
        }

        t.PK = id; t.CreatedAt = existing.CreatedAt; t.CreatedBy = existing.CreatedBy;
        return await _repo.UpdateAsync(t);
    }
    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}

public class AllowanceStatusService : IAllowanceStatusService
{
    private readonly IAllowanceStatusRepository _repo;
    public AllowanceStatusService(IAllowanceStatusRepository repo) => _repo = repo;

    public Task<IEnumerable<AllowanceStatus>> GetAllAsync(string? search) => _repo.GetAllAsync(search);
    public Task<AllowanceStatus?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
    public async Task<AllowanceStatus> CreateAsync(AllowanceStatus s)
    {
        if (await _repo.NameExistsAsync(s.Name))
        {
            throw new InvalidOperationException($"Allowance status ''{s.Name}'' already exists.");
        }

        return await _repo.CreateAsync(s);
    }
    public async Task<AllowanceStatus> UpdateAsync(int id, AllowanceStatus s)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Allowance status not found.");
        if (await _repo.NameExistsAsync(s.Name, id))
        {
            throw new InvalidOperationException($"Allowance status ''{s.Name}'' already exists.");
        }

        s.PK = id; s.CreatedAt = existing.CreatedAt; s.CreatedBy = existing.CreatedBy;
        return await _repo.UpdateAsync(s);
    }
    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
}
