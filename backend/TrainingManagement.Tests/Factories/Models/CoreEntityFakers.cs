using Bogus;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Tests.Factories.Models;

public class ParticipantFaker : BaseFakerConfig<Participant>
{
    private readonly Faker<Participant> _faker;

    public ParticipantFaker()
    {
        _faker = new Faker<Participant>()
            .RuleFor(p => p.Title, f => f.PickRandom("Mr", "Ms", "Mrs", "Dr", "Prof"))
            .RuleFor(p => p.Firstname, f => f.Name.FirstName())
            .RuleFor(p => p.Lastname, f => f.Name.LastName())
            .RuleFor(p => p.Middlename, f => f.Random.Bool(0.3f) ? f.Name.FirstName() : null)
            .RuleFor(p => p.IdNo, f => f.Random.Replace("########"))
            .RuleFor(p => p.Sex, f => f.PickRandom("Male", "Female"))
            .RuleFor(p => p.Dob, f => f.Date.Past(40, DateTime.Now.AddYears(-18)))
            .RuleFor(p => p.IdType, f => f.PickRandom("National ID", "Passport", "Permit"))
            .RuleFor(p => p.Phone, f => f.Phone.PhoneNumber("###-###-####"))
            .RuleFor(p => p.Email, f => f.Internet.Email())
            .RuleFor(p => p.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(p => p.CreatedBy, f => "System")
            .RuleFor(p => p.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(p => p.UpdatedBy, f => "System")
            .RuleFor(p => p.Deleted, f => false);
    }

    public override Participant Create()
    {
        return _faker.Generate();
    }

    public Participant CreateWithSpecificEmail(string email)
    {
        return _faker.Clone()
            .RuleFor(p => p.Email, email)
            .Generate();
    }

    public Participant CreateMale()
    {
        return _faker.Clone()
            .RuleFor(p => p.Sex, "Male")
            .RuleFor(p => p.Title, f => f.PickRandom("Mr", "Dr", "Prof"))
            .Generate();
    }

    public Participant CreateFemale()
    {
        return _faker.Clone()
            .RuleFor(p => p.Sex, "Female")
            .RuleFor(p => p.Title, f => f.PickRandom("Ms", "Mrs", "Dr", "Prof"))
            .Generate();
    }
}

public class TrainingFaker : BaseFakerConfig<Training>
{
    private readonly Faker<Training> _faker;

    public TrainingFaker()
    {
        _faker = new Faker<Training>()
            .RuleFor(t => t.Institution, f => f.Company.CompanyName() + " University")
            .RuleFor(t => t.Program, f => f.PickRandom(
                "Computer Science", "Business Administration", "Engineering",
                "Medicine", "Law", "Education", "Economics", "Public Administration"))
            .RuleFor(t => t.CountryOfStudy, f => f.Address.Country())
            .RuleFor(t => t.StartDate, f => f.Date.Future(0, DateTime.Now.AddMonths(1)))
            .RuleFor(t => t.Duration, f => f.Random.Int(6, 48)) // 6 months to 4 years
            .RuleFor(t => t.EndDate, (f, t) => t.StartDate.AddMonths(t.Duration))
            .RuleFor(t => t.DepartureDate, (f, t) => f.Date.Between(DateTime.Now, t.StartDate))
            .RuleFor(t => t.ArrivalDate, (f, t) => t.DepartureDate?.AddDays(f.Random.Int(1, 3)))
            .RuleFor(t => t.VacationEmploymentPeriod, f => f.Random.Bool(0.3f) ? f.Random.Int(1, 6) + " months" : null)
            .RuleFor(t => t.ResumptionDate, (f, t) => f.Random.Bool(0.3f) ? t.EndDate.AddMonths(f.Random.Int(1, 3)) : null)
            .RuleFor(t => t.ExtensionPeriod, f => f.Random.Bool(0.2f) ? f.Random.Int(3, 12) + " months" : null)
            .RuleFor(t => t.DateBondSigned, f => f.Random.Bool(0.8f) ? f.Date.Recent(30) : null)
            .RuleFor(t => t.BondServingPeriod, f => f.Random.Bool(0.8f) ? f.Random.Int(2, 5) + " years" : null)
            .RuleFor(t => t.ModeOfStudy, f => f.PickRandom("Full-time", "Part-time", "Distance Learning"))
            .RuleFor(t => t.RegistrationDate, f => f.Date.Recent(30))
            .RuleFor(t => t.TrainingStatus, f => f.PickRandom("Active", "Completed", "Suspended", "Cancelled"))
            .RuleFor(t => t.FinancialYear, f => DateTime.Now.Year + "/" + (DateTime.Now.Year + 1))
            .RuleFor(t => t.CampusType, f => f.PickRandom("Main Campus", "Branch Campus", "Online"))
            .RuleFor(t => t.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(t => t.CreatedBy, f => "System")
            .RuleFor(t => t.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(t => t.UpdatedBy, f => "System")
            .RuleFor(t => t.Deleted, f => false);
    }

    public override Training Create()
    {
        return _faker.Generate();
    }

    public Training CreateWithSpecificDuration(int months)
    {
        return _faker.Clone()
            .RuleFor(t => t.Duration, months)
            .RuleFor(t => t.EndDate, (f, t) => t.StartDate.AddMonths(months))
            .Generate();
    }

    public Training CreateCompleted()
    {
        return _faker.Clone()
            .RuleFor(t => t.TrainingStatus, "Completed")
            .RuleFor(t => t.StartDate, f => f.Date.Past(2))
            .RuleFor(t => t.EndDate, f => f.Date.Recent(30))
            .Generate();
    }

    public Training CreateActive()
    {
        return _faker.Clone()
            .RuleFor(t => t.TrainingStatus, "Active")
            .RuleFor(t => t.StartDate, f => f.Date.Recent(30))
            .RuleFor(t => t.EndDate, f => f.Date.Future(2))
            .Generate();
    }
}
