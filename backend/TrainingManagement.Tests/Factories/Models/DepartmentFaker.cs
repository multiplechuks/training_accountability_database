using Bogus;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Tests.Factories.Models;

public class DepartmentFaker : BaseFakerConfig<Department>
{
    private readonly Faker<Department> _faker;

    public DepartmentFaker()
    {
        _faker = new Faker<Department>()
            .RuleFor(x => x.Name, f => f.Commerce.Department())
            .RuleFor(x => x.Code, f => f.Random.AlphaNumeric(5).ToUpper())
            .RuleFor(x => x.Description, f => f.Lorem.Sentence())
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.Deleted, f => false);
    }

    public override Department Create()
    {
        return _faker.Generate();
    }

    public Department CreateWithSpecificName(string name)
    {
        return _faker.Clone()
            .RuleFor(x => x.Name, name)
            .Generate();
    }

    public Department CreateWithSpecificCode(string code)
    {
        return _faker.Clone()
            .RuleFor(x => x.Code, code)
            .Generate();
    }

    public Department CreateDeleted()
    {
        return _faker.Clone()
            .RuleFor(x => x.Deleted, true)
            .Generate();
    }
}
