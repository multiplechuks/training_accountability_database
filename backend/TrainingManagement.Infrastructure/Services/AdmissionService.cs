using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;

namespace TrainingManagement.Infrastructure.Services;

public interface IWebHostEnvironmentAccessor
{
    string? WebRootPath { get; }
}

public class AdmissionService : IAdmissionService
{
    private readonly IAdmissionRepository _repo;
    private readonly string _uploadRoot;

    public AdmissionService(IAdmissionRepository repo, IWebHostEnvironmentAccessor env)
    {
        _repo = repo;
        _uploadRoot = Path.Combine(env.WebRootPath ?? "wwwroot", "uploads", "release-letters");
        Directory.CreateDirectory(_uploadRoot);
    }

    public Task<(IEnumerable<Admission> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search)
        => _repo.GetPagedAsync(page, pageSize, search);

    public Task<Admission?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

    public Task<Admission?> GetByNominationAsync(int nominationId) => _repo.GetByNominationAsync(nominationId);

    public async Task<Admission> CreateAsync(Admission admission, Stream? releaseLetterStream, string? releaseLetterFileName)
    {
        if (releaseLetterStream != null && releaseLetterFileName != null)
        {
            await SaveReleaseLetterAsync(admission, releaseLetterStream, releaseLetterFileName);
        }

        return await _repo.CreateAsync(admission);
    }

    public async Task<Admission> UpdateAsync(int id, Admission admission, Stream? releaseLetterStream, string? releaseLetterFileName)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Admission not found.");
        admission.PK = id;
        admission.CreatedAt = existing.CreatedAt;
        admission.CreatedBy = existing.CreatedBy;
        if (releaseLetterStream != null && releaseLetterFileName != null)
        {
            await SaveReleaseLetterAsync(admission, releaseLetterStream, releaseLetterFileName);
        }
        else
        {
            admission.ReleaseLetterPath = existing.ReleaseLetterPath;
            admission.ReleaseLetterOriginalName = existing.ReleaseLetterOriginalName;
        }
        return await _repo.UpdateAsync(admission);
    }

    public Task DeleteAsync(int id) => _repo.DeleteAsync(id);

    private async Task SaveReleaseLetterAsync(Admission admission, Stream stream, string originalName)
    {
        var ext = Path.GetExtension(originalName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(_uploadRoot, fileName);
        await using var fs = new FileStream(filePath, FileMode.Create);
        await stream.CopyToAsync(fs);
        admission.ReleaseLetterPath = Path.Combine("uploads", "release-letters", fileName);
        admission.ReleaseLetterOriginalName = originalName;
    }
}
