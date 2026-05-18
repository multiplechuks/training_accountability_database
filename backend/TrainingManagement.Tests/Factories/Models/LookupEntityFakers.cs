using Bogus;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Tests.Factories.Models;

public class TitleFaker : BaseFakerConfig<Title>
{
    private readonly Faker<Title> _faker;
    public TitleFaker()
    {
        _faker = new Faker<Title>()
            .RuleFor(x => x.Name, f => f.PickRandom("Mr", "Mrs", "Ms", "Dr", "Prof"))
            .RuleFor(x => x.IsActive, f => true)
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.Deleted, f => false);
    }
    public override Title Create() => _faker.Generate();
}

public class DutyStationFaker : BaseFakerConfig<DutyStation>
{
    private readonly Faker<DutyStation> _faker;
    public DutyStationFaker()
    {
        _faker = new Faker<DutyStation>()
            .RuleFor(x => x.Name, f => f.Address.City())
            .RuleFor(x => x.IsActive, f => true)
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.Deleted, f => false);
    }
    public override DutyStation Create() => _faker.Generate();
}

public class SponsorTypeFaker : BaseFakerConfig<SponsorType>
{
    private readonly Faker<SponsorType> _faker;
    public SponsorTypeFaker()
    {
        _faker = new Faker<SponsorType>()
            .RuleFor(x => x.Name, f => f.PickRandom("Government", "Private", "NGO", "Self-Sponsored"))
            .RuleFor(x => x.IsActive, f => true)
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.Deleted, f => false);
    }
    public override SponsorType Create() => _faker.Generate();
}

public class NominatedProgramFaker : BaseFakerConfig<NominatedProgram>
{
    private readonly Faker<NominatedProgram> _faker;
    public NominatedProgramFaker()
    {
        _faker = new Faker<NominatedProgram>()
            .RuleFor(x => x.Name, f => f.Commerce.ProductName())
            .RuleFor(x => x.Year, f => f.Random.Int(2020, 2025))
            .RuleFor(x => x.IsActive, f => true)
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.Deleted, f => false);
    }
    public override NominatedProgram Create() => _faker.Generate();
}
