using Bogus;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Tests.Factories.Models;

public class ParticipantFaker : BaseFakerConfig<Participant>
{
    private readonly Faker<Participant> _faker;

    public ParticipantFaker()
    {
        _faker = new Faker<Participant>()
            .RuleFor(p => p.TitleFK, f => f.Random.Int(1, 5))
            .RuleFor(p => p.Firstname, f => f.Name.FirstName())
            .RuleFor(p => p.Lastname, f => f.Name.LastName())
            .RuleFor(p => p.Middlename, f => f.Random.Bool(0.3f) ? f.Name.FirstName() : null)
            .RuleFor(p => p.IdNumber, f => f.Random.Replace("########"))
            .RuleFor(p => p.IdTypeFK, f => f.Random.Int(1, 3))
            .RuleFor(p => p.Sex, f => f.PickRandom("Male", "Female"))
            .RuleFor(p => p.Dob, f => f.Date.Past(40, DateTime.Now.AddYears(-18)))
            .RuleFor(p => p.Phone, f => f.Phone.PhoneNumber("###-###-####"))
            .RuleFor(p => p.Email, f => f.Internet.Email())
            .RuleFor(p => p.DepartmentFK, f => f.Random.Int(1, 5))
            .RuleFor(p => p.SalaryScaleFK, f => f.Random.Int(1, 5))
            .RuleFor(p => p.DutyStationFK, f => f.Random.Int(1, 3))
            .RuleFor(p => p.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(p => p.CreatedBy, f => "System")
            .RuleFor(p => p.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(p => p.UpdatedBy, f => "System")
            .RuleFor(p => p.Deleted, f => false);
    }

    public override Participant Create() => _faker.Generate();

    public Participant CreateMale() =>
        _faker.Clone().RuleFor(p => p.Sex, "Male").Generate();

    public Participant CreateFemale() =>
        _faker.Clone().RuleFor(p => p.Sex, "Female").Generate();
}

public class NominationFaker : BaseFakerConfig<Nomination>
{
    private readonly Faker<Nomination> _faker;

    public NominationFaker()
    {
        _faker = new Faker<Nomination>()
            .RuleFor(n => n.ParticipantFK, f => f.Random.Int(1, 10))
            .RuleFor(n => n.QualificationFK, f => f.Random.Int(1, 5))
            .RuleFor(n => n.NominatedProgramFK, f => f.Random.Int(1, 5))
            .RuleFor(n => n.SponsorTypeFK, f => f.Random.Int(1, 3))
            .RuleFor(n => n.YearOfNomination, f => f.Random.Int(2020, 2025))
            .RuleFor(n => n.EstimatedBudget, f => f.Finance.Amount(5000, 50000))
            .RuleFor(n => n.Currency, f => f.PickRandom("GHS", "USD", "EUR"))
            .RuleFor(n => n.NominationStatus, f => f.PickRandom("Pending", "Approved", "Rejected"))
            .RuleFor(n => n.NominationDate, f => f.Date.Past(1))
            .RuleFor(n => n.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(n => n.CreatedBy, f => "System")
            .RuleFor(n => n.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(n => n.UpdatedBy, f => "System")
            .RuleFor(n => n.Deleted, f => false);
    }

    public override Nomination Create() => _faker.Generate();
}

public class AdmissionFaker : BaseFakerConfig<Admission>
{
    private readonly Faker<Admission> _faker;

    public AdmissionFaker()
    {
        _faker = new Faker<Admission>()
            .RuleFor(a => a.NominationFK, f => f.Random.Int(1, 10))
            .RuleFor(a => a.AdmissionProgramFK, f => f.Random.Int(1, 5))
            .RuleFor(a => a.ModeOfStudyFK, f => f.Random.Int(1, 3))
            .RuleFor(a => a.AdmissionDate, f => f.Date.Past(1))
            .RuleFor(a => a.ReleaseStartDate, f => f.Date.Past(1))
            .RuleFor(a => a.ReleaseEndDate, f => f.Date.Future(1))
            .RuleFor(a => a.Notes, f => f.Lorem.Sentence())
            .RuleFor(a => a.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(a => a.CreatedBy, f => "System")
            .RuleFor(a => a.UpdatedAt, f => f.Date.Recent(10))
            .RuleFor(a => a.UpdatedBy, f => "System")
            .RuleFor(a => a.Deleted, f => false);
    }

    public override Admission Create() => _faker.Generate();
}
