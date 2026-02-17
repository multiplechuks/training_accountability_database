using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class TrainingTransfer : BaseEntity
{
    // Foreign Keys
    public int ParticipantFK { get; set; }
    public int TrainingFK { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? TransferReason { get; set; }

    [MaxLength(50)]
    public string TransferStatus { get; set; } = string.Empty;

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Training Training { get; set; } = null!;
}
