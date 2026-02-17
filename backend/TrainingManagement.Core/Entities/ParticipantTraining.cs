using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class ParticipantTraining : BaseEntity
{
    // Foreign Keys
    public int ParticipantFK { get; set; }
    public int TrainingFK { get; set; }

    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string Status { get; set; } = string.Empty; // Active, Completed, Withdrawn, etc.

    public DateTime? CompletionDate { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Training Training { get; set; } = null!;
    public virtual ICollection<TrainingTransfer> TrainingTransfers { get; set; } = new List<TrainingTransfer>();
}
