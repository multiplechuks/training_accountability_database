using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Allowance : BaseEntity
{
    public decimal Amount { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [MaxLength(1000)]
    public string? Comments { get; set; }

    // Foreign Keys
    public int TrainingFK { get; set; }
    public int StatusFK { get; set; }
    public int ParticipantFK { get; set; }
    public int AllowanceTypeFK { get; set; }

    // Navigation properties
    public virtual Training Training { get; set; } = null!;
    public virtual AllowanceStatus AllowanceStatus { get; set; } = null!;
    public virtual Participant Participant { get; set; } = null!;
    public virtual AllowanceType AllowanceType { get; set; } = null!;
}

public class AllowanceType : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<Allowance> Allowances { get; set; } = new List<Allowance>();
}

public class AllowanceStatus : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<Allowance> Allowances { get; set; } = new List<Allowance>();
}
