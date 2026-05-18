using Microsoft.AspNetCore.Mvc;
using Moq;
using TrainingManagement.API.Controllers;
using TrainingManagement.Core.Entities;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Tests.Factories.Models;

namespace TrainingManagement.Tests.Controllers;

public class ParticipantsControllerTests
{
    private readonly Mock<IParticipantService> _mockService;
    private readonly Mock<INextOfKinService> _mockNokService;
    private readonly ParticipantsController _controller;
    private readonly ParticipantFaker _faker;

    public ParticipantsControllerTests()
    {
        _mockService = new Mock<IParticipantService>();
        _mockNokService = new Mock<INextOfKinService>();
        _controller = new ParticipantsController(_mockService.Object, _mockNokService.Object);
        _faker = new ParticipantFaker();
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult()
    {
        // Arrange
        var participants = _faker.CreateMany(5).ToList();
        _mockService.Setup(x => x.GetPagedAsync(1, 20, null))
            .ReturnsAsync((participants, participants.Count));

        // Act
        var result = await _controller.GetAll(1, 20, null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetById_ExistingId_ReturnsOkResult()
    {
        // Arrange
        var participant = _faker.Create();
        participant.PK = 1;
        _mockService.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(participant);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetById_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        _mockService.Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((Participant?)null);

        // Act
        var result = await _controller.GetById(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
