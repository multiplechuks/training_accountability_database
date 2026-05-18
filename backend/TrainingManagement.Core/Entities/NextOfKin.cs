using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class NextOfKin : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    public int? RelationshipTypeFK { get; set; }

    [MaxLength(15)]
    public string? Phone { get; set; }

    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(50)]
    public string? IdNumber { get; set; }

    // One-to-one with Participant
    public int ParticipantFK { get; set; }

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual RelationshipType? RelationshipType { get; set; }
}
