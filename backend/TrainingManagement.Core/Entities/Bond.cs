using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Bond : BaseEntity
{
    public DateTime BondStartDate { get; set; }

    public DateTime BondEndDate { get; set; }

    public int BondPeriodMonths { get; set; }

    public bool BondSigned { get; set; } = false;

    public DateTime? DateSigned { get; set; }

    [MaxLength(50)]
    public string BondStatus { get; set; } = string.Empty;

    public decimal BondAmount { get; set; }

    [MaxLength(1000)]
    public string? BondConditions { get; set; }

    public DateTime? CompletionDate { get; set; }

    public bool InductionCompleted { get; set; } = false;

    public DateTime? InductionDate { get; set; }

    // Foreign Key
    public int ParticipantEnrollmentFK { get; set; }

    // Navigation property
    public virtual ParticipantEnrollment ParticipantEnrollment { get; set; } = null!;
}
