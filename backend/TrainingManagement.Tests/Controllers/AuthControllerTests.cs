using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using TrainingManagement.API.Controllers;
using TrainingManagement.API.DTOs;
using TrainingManagement.API.Services;
using TrainingManagement.Core.Entities;
using TrainingManagement.Tests.Factories.DTO;
using TrainingManagement.Tests.Factories.Models;

namespace TrainingManagement.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<SignInManager<User>> _mockSignInManager;
    private readonly Mock<IJwtService> _mockJwtService;
    private readonly Mock<ILogger<AuthController>> _mockLogger;
    private readonly AuthController _controller;
    private readonly UserFaker _userFaker;
    private readonly LoginDtoFaker _loginDtoFaker;
    private readonly RegisterDtoFaker _registerDtoFaker;

    public AuthControllerTests()
    {
        // Setup UserManager mock
        var userStore = new Mock<IUserStore<User>>();
        _mockUserManager = new Mock<UserManager<User>>(
            userStore.Object,
            Options.Create(new IdentityOptions()),
            new Mock<IPasswordHasher<User>>().Object,
            Array.Empty<IUserValidator<User>>(),
            Array.Empty<IPasswordValidator<User>>(),
            new Mock<ILookupNormalizer>().Object,
            new Mock<IdentityErrorDescriber>().Object,
            new Mock<IServiceProvider>().Object,
            new Mock<ILogger<UserManager<User>>>().Object);

        // Setup SignInManager mock
        var contextAccessor = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var claimsFactory = new Mock<IUserClaimsPrincipalFactory<User>>();
        _mockSignInManager = new Mock<SignInManager<User>>(
            _mockUserManager.Object,
            contextAccessor.Object,
            claimsFactory.Object,
            Options.Create(new IdentityOptions()),
            new Mock<ILogger<SignInManager<User>>>().Object,
            new Mock<Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider>().Object,
            new Mock<IUserConfirmation<User>>().Object);

        _mockJwtService = new Mock<IJwtService>();
        _mockLogger = new Mock<ILogger<AuthController>>();

        _controller = new AuthController(
            _mockUserManager.Object,
            _mockSignInManager.Object,
            _mockJwtService.Object,
            _mockLogger.Object);

        // Initialize Faker instances
        _userFaker = new UserFaker();
        _loginDtoFaker = new LoginDtoFaker();
        _registerDtoFaker = new RegisterDtoFaker();
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
        var loginDto = _loginDtoFaker.Create();
        var user = _userFaker.Create();
        user.Email = loginDto.Email; // Ensure email matches for login

        var roles = new List<string> { "User" };
        var token = "test-jwt-token";
        var signInResult = Microsoft.AspNetCore.Identity.SignInResult.Success;

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginDto.Password, false))
            .ReturnsAsync(signInResult);

        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(roles);

        _mockJwtService.Setup(x => x.GenerateJwtToken(user, roles))
            .Returns(token);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);

        Assert.True(response.Success);
        Assert.Equal("Login successful", response.Message);
        Assert.Equal(token, response.Token);
        Assert.NotNull(response.User);
        Assert.Equal(user.Email, response.User.Email);
        Assert.Equal(user.FirstName, response.User.FirstName);
        Assert.Equal(user.LastName, response.User.LastName);
        Assert.Equal(roles, response.User.Roles);
    }

    [Fact]
    public async Task Login_InvalidEmail_ReturnsUnauthorized()
    {
        // Arrange
        var loginDto = _loginDtoFaker.Create();

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(unauthorizedResult.Value);

        Assert.False(response.Success);
        Assert.Equal("Invalid email or password", response.Message);
        Assert.Null(response.Token);
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        // Arrange
        var loginDto = _loginDtoFaker.Create();
        var user = _userFaker.Create();
        user.Email = loginDto.Email; // Ensure email matches

        var signInResult = Microsoft.AspNetCore.Identity.SignInResult.Failed;

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginDto.Password, false))
            .ReturnsAsync(signInResult);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(unauthorizedResult.Value);

        Assert.False(response.Success);
        Assert.Equal("Invalid email or password", response.Message);
        Assert.Null(response.Token);
    }

    [Fact]
    public async Task Register_ValidData_ReturnsCreatedWithToken()
    {
        // Arrange
        var registerDto = _registerDtoFaker.Create();

        var roles = new List<string> { "User" };
        var token = "test-jwt-token";
        var identityResult = IdentityResult.Success;

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerDto.Email))
            .ReturnsAsync((User?)null);

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), registerDto.Password))
            .ReturnsAsync(identityResult);

        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        _mockUserManager.Setup(x => x.GetRolesAsync(It.IsAny<User>()))
            .ReturnsAsync(roles);

        _mockJwtService.Setup(x => x.GenerateJwtToken(It.IsAny<User>(), roles))
            .Returns(token);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(createdResult.Value);

        Assert.True(response.Success);
        Assert.Equal("Registration successful", response.Message);
        Assert.Equal(token, response.Token);
        Assert.NotNull(response.User);
        Assert.Equal(registerDto.Email, response.User.Email);
        Assert.Equal(registerDto.FirstName, response.User.FirstName);
        Assert.Equal(registerDto.LastName, response.User.LastName);
    }

    [Fact]
    public async Task Register_ExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var registerDto = _registerDtoFaker.Create();
        var existingUser = _userFaker.Create();
        existingUser.Email = registerDto.Email;

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerDto.Email))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(badRequestResult.Value);

        Assert.False(response.Success);
        Assert.Equal("Email already exists", response.Message);
        Assert.Null(response.Token);
    }

    [Fact]
    public void ValidateToken_WithValidToken_ReturnsOk()
    {
        // Act
        var result = _controller.ValidateToken();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);

        Assert.True(response.Success);
        Assert.Equal("Token is valid", response.Message);
    }
}
