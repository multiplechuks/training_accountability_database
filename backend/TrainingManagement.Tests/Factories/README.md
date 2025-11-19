# Test Factories Documentation

This document explains how to use the faker factories in the TrainingManagement.Tests project.

## Structure

```
Factories/
├── BaseFakerConfig.cs           # Base class for all fakers
├── Models/                      # Entity/Model fakers
│   ├── UserFaker.cs
│   ├── DepartmentFaker.cs
│   ├── CoreEntityFakers.cs      # ParticipantFaker, TrainingFaker
│   └── LookupEntityFakers.cs    # FacilityFaker, DesignationFaker, etc.
└── DTO/
    └── AuthDtoFakers.cs         # All Auth-related DTO fakers
```

## BaseFakerConfig

All fakers inherit from `BaseFakerConfig<T>` which provides:
- `Create()` - Creates a single instance
- `CreateMany(int count = 3)` - Creates multiple instances

## Usage Examples

### Basic Usage

```csharp
// In your test class constructor or setup
private readonly UserFaker _userFaker = new UserFaker();
private readonly LoginDtoFaker _loginDtoFaker = new LoginDtoFaker();

// In your test methods
public void TestMethod()
{
    // Create single instances
    var user = _userFaker.Create();
    var loginDto = _loginDtoFaker.Create();
    
    // Create multiple instances
    var users = _userFaker.CreateMany(5);
}
```

### Specialized Creation Methods

Most fakers provide specialized methods for common scenarios:

```csharp
// UserFaker examples
var user = _userFaker.Create();                              // Random user
var specificUser = _userFaker.CreateWithSpecificEmail("test@example.com");
var deletedUser = _userFaker.CreateDeleted();

// LoginDtoFaker examples
var loginDto = _loginDtoFaker.Create();                       // Random login
var weakLogin = _loginDtoFaker.CreateWithWeakPassword();
var specificLogin = _loginDtoFaker.CreateWithSpecificEmail("admin@test.com");

// ParticipantFaker examples
var participant = _participantFaker.Create();                // Random participant
var maleParticipant = _participantFaker.CreateMale();
var femaleParticipant = _participantFaker.CreateFemale();

// TrainingFaker examples
var training = _trainingFaker.Create();                       // Random training
var completedTraining = _trainingFaker.CreateCompleted();
var activeTraining = _trainingFaker.CreateActive();
var customDuration = _trainingFaker.CreateWithSpecificDuration(12);
```

### Using in Test Classes

```csharp
public class ParticipantServiceTests
{
    private readonly ParticipantFaker _participantFaker;
    private readonly TrainingFaker _trainingFaker;
    
    public ParticipantServiceTests()
    {
        _participantFaker = new ParticipantFaker();
        _trainingFaker = new TrainingFaker();
    }
    
    [Fact]
    public void EnrollParticipant_ValidData_ShouldSucceed()
    {
        // Arrange
        var participant = _participantFaker.Create();
        var training = _trainingFaker.CreateActive();
        
        // Act & Assert
        // Your test logic here
    }
}
```

## Available Fakers

### Model Fakers
- **UserFaker** - Creates User entities with realistic data
- **DepartmentFaker** - Creates Department lookup entities  
- **ParticipantFaker** - Creates Participant entities with realistic personal info
- **TrainingFaker** - Creates Training entities with proper date relationships
- **FacilityFaker** - Creates Facility lookup entities
- **DesignationFaker** - Creates job designation entities
- **SalaryScaleFaker** - Creates salary scale entities with proper min/max relationships
- **SponsorFaker** - Creates sponsor entities

### DTO Fakers
- **LoginDtoFaker** - Creates login request DTOs
- **RegisterDtoFaker** - Creates registration request DTOs with matching passwords
- **ChangePasswordDtoFaker** - Creates password change DTOs
- **AuthResponseDtoFaker** - Creates authentication response DTOs
- **UserDtoFaker** - Creates user display DTOs

## Best Practices

1. **Use specific creation methods** when you need specific data states
2. **Create realistic relationships** - ensure foreign keys and relationships make sense
3. **Use CreateMany()** for bulk data scenarios
4. **Extend fakers** by adding new specific creation methods as needed
5. **Keep fakers focused** - one faker per entity/DTO type

## Adding New Fakers

To add a new faker:

1. Create a new class inheriting from `BaseFakerConfig<T>`
2. Implement the `Create()` method
3. Add specialized creation methods as needed
4. Place in appropriate folder (Models/ or DTO/)

Example:
```csharp
public class NewEntityFaker : BaseFakerConfig<NewEntity>
{
    private readonly Faker<NewEntity> _faker;

    public NewEntityFaker()
    {
        _faker = new Faker<NewEntity>()
            .RuleFor(x => x.Property1, f => f.Lorem.Word())
            .RuleFor(x => x.Property2, f => f.Random.Int(1, 100));
    }

    public override NewEntity Create()
    {
        return _faker.Generate();
    }

    public NewEntity CreateWithSpecificValue(string value)
    {
        return _faker.Clone()
            .RuleFor(x => x.Property1, value)
            .Generate();
    }
}
```