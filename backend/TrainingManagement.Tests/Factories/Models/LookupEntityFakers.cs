using Bogus;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Tests.Factories.Models;

public class FacilityFaker : BaseFakerConfig<Facility>
{
    private readonly Faker<Facility> _faker;

    public FacilityFaker()
    {
        _faker = new Faker<Facility>()
            .RuleFor(f => f.Name, f => f.Company.CompanyName() + " " + f.PickRandom("Hospital", "Clinic", "Center", "Institute"))
            .RuleFor(f => f.Code, f => f.Random.AlphaNumeric(5).ToUpper())
            .RuleFor(f => f.Location, f => f.Address.City())
            .RuleFor(f => f.Description, f => f.Lorem.Sentence())
            .RuleFor(f => f.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(f => f.CreatedBy, f => "System")
            .RuleFor(f => f.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(f => f.UpdatedBy, f => "System")
            .RuleFor(f => f.Deleted, f => false);
    }

    public override Facility Create()
    {
        return _faker.Generate();
    }

    public Facility CreateWithSpecificLocation(string location)
    {
        return _faker.Clone()
            .RuleFor(f => f.Location, location)
            .Generate();
    }
}

public class DesignationFaker : BaseFakerConfig<Designation>
{
    private readonly Faker<Designation> _faker;

    public DesignationFaker()
    {
        _faker = new Faker<Designation>()
            .RuleFor(d => d.Title, f => f.PickRandom(
                "Software Developer", "Project Manager", "Business Analyst",
                "Data Scientist", "System Administrator", "Quality Assurance Analyst",
                "Database Administrator", "Network Engineer", "Security Specialist"))
            .RuleFor(d => d.Code, f => f.Random.AlphaNumeric(5).ToUpper())
            .RuleFor(d => d.Level, f => f.PickRandom("Junior", "Senior", "Principal", "Lead", "Manager"))
            .RuleFor(d => d.Description, f => f.Lorem.Sentence())
            .RuleFor(d => d.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(d => d.CreatedBy, f => "System")
            .RuleFor(d => d.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(d => d.UpdatedBy, f => "System")
            .RuleFor(d => d.Deleted, f => false);
    }

    public override Designation Create()
    {
        return _faker.Generate();
    }

    public Designation CreateWithSpecificLevel(string level)
    {
        return _faker.Clone()
            .RuleFor(d => d.Level, level)
            .Generate();
    }

    public Designation CreateSeniorLevel()
    {
        return CreateWithSpecificLevel("Senior");
    }

    public Designation CreateJuniorLevel()
    {
        return CreateWithSpecificLevel("Junior");
    }
}

public class SalaryScaleFaker : BaseFakerConfig<SalaryScale>
{
    private readonly Faker<SalaryScale> _faker;

    public SalaryScaleFaker()
    {
        _faker = new Faker<SalaryScale>()
            .RuleFor(s => s.Scale, f => f.PickRandom("A", "B", "C", "D", "E") + f.Random.Int(1, 10))
            .RuleFor(s => s.Grade, f => f.PickRandom("I", "II", "III", "IV", "V"))
            .RuleFor(s => s.MinSalary, f => f.Random.Decimal(20000, 50000))
            .RuleFor(s => s.MaxSalary, (f, s) => s.MinSalary + f.Random.Decimal(10000, 30000))
            .RuleFor(s => s.Description, f => f.Lorem.Sentence())
            .RuleFor(s => s.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(s => s.CreatedBy, f => "System")
            .RuleFor(s => s.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(s => s.UpdatedBy, f => "System")
            .RuleFor(s => s.Deleted, f => false);
    }

    public override SalaryScale Create()
    {
        return _faker.Generate();
    }

    public SalaryScale CreateWithSpecificRange(decimal minSalary, decimal maxSalary)
    {
        return _faker.Clone()
            .RuleFor(s => s.MinSalary, minSalary)
            .RuleFor(s => s.MaxSalary, maxSalary)
            .Generate();
    }
}

public class SponsorFaker : BaseFakerConfig<Sponsor>
{
    private readonly Faker<Sponsor> _faker;

    public SponsorFaker()
    {
        _faker = new Faker<Sponsor>()
            .RuleFor(s => s.Name, f => f.Company.CompanyName())
            .RuleFor(s => s.Type, f => f.PickRandom("Government", "Private", "International", "NGO", "Foundation"))
            .RuleFor(s => s.ContactPerson, f => f.Name.FullName())
            .RuleFor(s => s.Email, f => f.Internet.Email())
            .RuleFor(s => s.Phone, f => f.Phone.PhoneNumber("###-###-####"))
            .RuleFor(s => s.Description, f => f.Lorem.Sentence())
            .RuleFor(s => s.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(s => s.CreatedBy, f => "System")
            .RuleFor(s => s.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(s => s.UpdatedBy, f => "System")
            .RuleFor(s => s.Deleted, f => false);
    }

    public override Sponsor Create()
    {
        return _faker.Generate();
    }

    public Sponsor CreateWithSpecificType(string type)
    {
        return _faker.Clone()
            .RuleFor(s => s.Type, type)
            .Generate();
    }

    public Sponsor CreateGovernmentSponsor()
    {
        return CreateWithSpecificType("Government");
    }

    public Sponsor CreatePrivateSponsor()
    {
        return CreateWithSpecificType("Private");
    }
}
