using Bogus;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Tests.Factories.Models;

public class UserFaker : BaseFakerConfig<User>
{
    private readonly Faker<User> _faker;

    public UserFaker()
    {
        _faker = new Faker<User>()
            .RuleFor(u => u.Id, f => f.Random.Int(1, 1000))
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.UserName, (f, u) => u.Email)
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.DateOfBirth, f => f.Date.Past(30, DateTime.Now.AddYears(-18)))
            .RuleFor(u => u.ProfilePictureUrl, f => f.Internet.Avatar())
            .RuleFor(u => u.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(u => u.CreatedBy, f => "System")
            .RuleFor(u => u.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(u => u.UpdatedBy, f => "System")
            .RuleFor(u => u.Deleted, f => false)
            .RuleFor(u => u.EmailConfirmed, f => true)
            .RuleFor(u => u.PhoneNumberConfirmed, f => false)
            .RuleFor(u => u.TwoFactorEnabled, f => false)
            .RuleFor(u => u.LockoutEnabled, f => false);
    }

    public override User Create()
    {
        return _faker.Generate();
    }

    public User CreateWithSpecificEmail(string email)
    {
        return _faker.Clone()
            .RuleFor(u => u.Email, email)
            .RuleFor(u => u.UserName, email)
            .Generate();
    }

    public User CreateWithSpecificName(string firstName, string lastName)
    {
        return _faker.Clone()
            .RuleFor(u => u.FirstName, firstName)
            .RuleFor(u => u.LastName, lastName)
            .Generate();
    }

    public User CreateDeleted()
    {
        return _faker.Clone()
            .RuleFor(u => u.Deleted, true)
            .Generate();
    }
}
