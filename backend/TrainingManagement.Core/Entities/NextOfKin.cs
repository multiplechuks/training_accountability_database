using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class NextOfKin : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Firstname { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Lastname { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Relationship { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string IdNo { get; set; } = string.Empty;

    // Foreign Key
    public int ParticipantFK { get; set; }

    // Navigation property
    public virtual Participant Participant { get; set; } = null!;

    public string FullName => $"{Firstname} {Lastname}";
}
