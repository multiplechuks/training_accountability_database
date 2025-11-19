using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public abstract class BaseEntity
{
    [Key]
    public int PK { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string UpdatedBy { get; set; } = string.Empty;

    public bool Deleted { get; set; } = false;
}
