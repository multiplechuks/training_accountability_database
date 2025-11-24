using Bogus;
using TrainingManagement.API.DTOs;

namespace TrainingManagement.Tests.Factories.DTO;

public class LoginDtoFaker : BaseFakerConfig<LoginDto>
{
    private readonly Faker<LoginDto> _faker;

    public LoginDtoFaker()
    {
        _faker = new Faker<LoginDto>()
            .RuleFor(l => l.Email, f => f.Internet.Email())
            .RuleFor(l => l.Password, f => f.Internet.Password(8, false, "", "Aa1!"));
    }

    public override LoginDto Create()
    {
        return _faker.Generate();
    }

    public LoginDto CreateWithSpecificEmail(string email)
    {
        return _faker.Clone()
            .RuleFor(l => l.Email, email)
            .Generate();
    }

    public LoginDto CreateWithWeakPassword()
    {
        return _faker.Clone()
            .RuleFor(l => l.Password, f => "123")
            .Generate();
    }
}

public class RegisterDtoFaker : BaseFakerConfig<RegisterDto>
{
    private readonly Faker<RegisterDto> _faker;

    public RegisterDtoFaker()
    {
        _faker = new Faker<RegisterDto>()
            .RuleFor(r => r.Email, f => f.Internet.Email())
            .RuleFor(r => r.Password, f => f.Internet.Password(8, false, "", "Aa1!"))
            .RuleFor(r => r.ConfirmPassword, (f, r) => r.Password)
            .RuleFor(r => r.FirstName, f => f.Name.FirstName())
            .RuleFor(r => r.LastName, f => f.Name.LastName())
            .RuleFor(r => r.DateOfBirth, f => f.Date.Past(30, DateTime.Now.AddYears(-18)));
    }

    public override RegisterDto Create()
    {
        return _faker.Generate();
    }

    public RegisterDto CreateWithSpecificEmail(string email)
    {
        return _faker.Clone()
            .RuleFor(r => r.Email, email)
            .Generate();
    }

    public RegisterDto CreateWithMismatchedPasswords()
    {
        return _faker.Clone()
            .RuleFor(r => r.ConfirmPassword, f => f.Internet.Password())
            .Generate();
    }

    public RegisterDto CreateWithWeakPassword()
    {
        return _faker.Clone()
            .RuleFor(r => r.Password, f => "123")
            .RuleFor(r => r.ConfirmPassword, f => "123")
            .Generate();
    }
}

public class ChangePasswordDtoFaker : BaseFakerConfig<ChangePasswordDto>
{
    private readonly Faker<ChangePasswordDto> _faker;

    public ChangePasswordDtoFaker()
    {
        _faker = new Faker<ChangePasswordDto>()
            .RuleFor(c => c.CurrentPassword, f => f.Internet.Password(8, false, "", "Aa1!"))
            .RuleFor(c => c.NewPassword, f => f.Internet.Password(8, false, "", "Aa1!"))
            .RuleFor(c => c.ConfirmNewPassword, (f, c) => c.NewPassword);
    }

    public override ChangePasswordDto Create()
    {
        return _faker.Generate();
    }

    public ChangePasswordDto CreateWithMismatchedPasswords()
    {
        return _faker.Clone()
            .RuleFor(c => c.ConfirmNewPassword, f => f.Internet.Password())
            .Generate();
    }

    public ChangePasswordDto CreateWithWeakNewPassword()
    {
        return _faker.Clone()
            .RuleFor(c => c.NewPassword, f => "123")
            .RuleFor(c => c.ConfirmNewPassword, f => "123")
            .Generate();
    }
}

public class AuthResponseDtoFaker : BaseFakerConfig<AuthResponseDto>
{
    private readonly Faker<AuthResponseDto> _faker;

    public AuthResponseDtoFaker()
    {
        _faker = new Faker<AuthResponseDto>()
            .RuleFor(a => a.Success, f => f.Random.Bool())
            .RuleFor(a => a.Message, f => f.Lorem.Sentence())
            .RuleFor(a => a.Token, f => f.Random.AlphaNumeric(50))
            .RuleFor(a => a.ExpiresAt, f => f.Date.Future())
            .RuleFor(a => a.User, f => new UserDtoFaker().Create());
    }

    public override AuthResponseDto Create()
    {
        return _faker.Generate();
    }

    public AuthResponseDto CreateSuccess()
    {
        return _faker.Clone()
            .RuleFor(a => a.Success, true)
            .RuleFor(a => a.Message, "Success")
            .Generate();
    }

    public AuthResponseDto CreateFailure()
    {
        return _faker.Clone()
            .RuleFor(a => a.Success, false)
            .RuleFor(a => a.Token, (string?)null)
            .RuleFor(a => a.ExpiresAt, (DateTime?)null)
            .RuleFor(a => a.User, (UserDto?)null)
            .Generate();
    }
}

public class UserDtoFaker : BaseFakerConfig<UserDto>
{
    private readonly Faker<UserDto> _faker;

    public UserDtoFaker()
    {
        _faker = new Faker<UserDto>()
            .RuleFor(u => u.Id, f => f.Random.Int(1, 1000))
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.DateOfBirth, f => f.Date.Past(30, DateTime.Now.AddYears(-18)))
            .RuleFor(u => u.ProfilePictureUrl, f => f.Internet.Avatar())
            .RuleFor(u => u.Roles, f => f.Make(f.Random.Int(1, 3), () => f.PickRandom("Admin", "User", "Manager")).ToList());
    }

    public override UserDto Create()
    {
        return _faker.Generate();
    }

    public UserDto CreateWithSpecificRole(string role)
    {
        return _faker.Clone()
            .RuleFor(u => u.Roles, new List<string> { role })
            .Generate();
    }

    public UserDto CreateAdmin()
    {
        return CreateWithSpecificRole("Admin");
    }

    public UserDto CreateRegularUser()
    {
        return CreateWithSpecificRole("User");
    }
}
