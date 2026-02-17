using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using TrainingManagement.API.Controllers;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Tests.Factories.Models;

namespace TrainingManagement.Tests.Controllers;

public class TrainingProgramsControllerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<ITrainingRepository> _mockTrainingRepo;
    private readonly Mock<ILogger<TrainingProgramsController>> _mockLogger;
    private readonly TrainingProgramsController _controller;
    private readonly TrainingFaker _trainingFaker;

    public TrainingProgramsControllerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockTrainingRepo = new Mock<ITrainingRepository>();
        _mockLogger = new Mock<ILogger<TrainingProgramsController>>();
        _trainingFaker = new TrainingFaker();

        _mockUnitOfWork.Setup(x => x.Trainings).Returns(_mockTrainingRepo.Object);

        _controller = new TrainingProgramsController(
            _mockUnitOfWork.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task GetAllPrograms_WithoutFilters_ReturnsOkResult()
    {
        // Arrange
        var trainings = _trainingFaker.CreateMany(5).ToList();
        _mockTrainingRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(trainings);

        // Act
        var result = await _controller.GetAllPrograms();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetAllPrograms_WithCountryFilter_ReturnsOkResult()
    {
        // Arrange
        var trainings = _trainingFaker.CreateMany(3).ToList();
        trainings.ForEach(t => t.CountryOfStudy = "Kenya");

        _mockTrainingRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(trainings);

        // Act
        var result = await _controller.GetAllPrograms(country: "Kenya");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetAllPrograms_WithSearchTerm_ReturnsOkResult()
    {
        // Arrange
        var trainings = _trainingFaker.CreateMany(3).ToList();
        _mockTrainingRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(trainings);

        // Act
        var result = await _controller.GetAllPrograms(search: "Computer");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetAllPrograms_WithPagination_ReturnsOkResult()
    {
        // Arrange
        var trainings = _trainingFaker.CreateMany(10).ToList();
        _mockTrainingRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(trainings);

        // Act
        var result = await _controller.GetAllPrograms(page: 1, pageSize: 5);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task CreateProgram_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var createDto = new CreateTrainingProgramDto
        {
            Institution = "MIT",
            Program = "Computer Science",
            CountryOfStudy = "USA",
            StartDate = DateTime.Now.AddMonths(1),
            EndDate = DateTime.Now.AddMonths(25),
            Duration = 24,
            ModeOfStudy = "Full-time",
            CampusType = "Main Campus"
        };

        var createdTraining = _trainingFaker.Create();
        _mockTrainingRepo.Setup(x => x.AddAsync(It.IsAny<Training>()))
            .ReturnsAsync(createdTraining);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);

        // Act
        var result = await _controller.CreateProgram(createDto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.NotNull(createdResult.Value);
        _mockTrainingRepo.Verify(x => x.AddAsync(It.IsAny<Training>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateProgram_WithInvalidModel_ReturnsBadRequest()
    {
        // Arrange
        _controller.ModelState.AddModelError("Institution", "Required");
        var createDto = new CreateTrainingProgramDto();

        // Act
        var result = await _controller.CreateProgram(createDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        _mockTrainingRepo.Verify(x => x.AddAsync(It.IsAny<Training>()), Times.Never);
    }

    [Fact]
    public async Task UpdateProgram_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var training = _trainingFaker.Create();
        var updateDto = new UpdateTrainingProgramDto
        {
            Program = "Updated Program",
            Institution = training.Institution
        };

        _mockTrainingRepo.Setup(x => x.GetByIdAsync(training.PK))
            .ReturnsAsync(training);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);

        // Act
        var result = await _controller.UpdateProgram(training.PK, updateDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateProgram_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var updateDto = new UpdateTrainingProgramDto { Program = "Updated" };
        _mockTrainingRepo.Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((Training)null);

        // Act
        var result = await _controller.UpdateProgram(999, updateDto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task DeleteProgram_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var training = _trainingFaker.Create();
        _mockTrainingRepo.Setup(x => x.GetByIdAsync(training.PK))
            .ReturnsAsync(training);
        _mockTrainingRepo.Setup(x => x.DeleteAsync(training))
            .Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);

        // Act
        var result = await _controller.DeleteProgram(training.PK);

        // Assert
        Assert.IsType<NoContentResult>(result);
        _mockTrainingRepo.Verify(x => x.DeleteAsync(training), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteProgram_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        _mockTrainingRepo.Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((Training)null);

        // Act
        var result = await _controller.DeleteProgram(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        _mockTrainingRepo.Verify(x => x.DeleteAsync(It.IsAny<Training>()), Times.Never);
    }
}
