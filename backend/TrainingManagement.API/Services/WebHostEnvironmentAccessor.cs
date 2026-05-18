using TrainingManagement.Infrastructure.Services;

namespace TrainingManagement.API.Services;

public class WebHostEnvironmentAccessor : IWebHostEnvironmentAccessor
{
    private readonly IWebHostEnvironment _env;
    public WebHostEnvironmentAccessor(IWebHostEnvironment env) => _env = env;
    public string? WebRootPath => _env.WebRootPath;
}
