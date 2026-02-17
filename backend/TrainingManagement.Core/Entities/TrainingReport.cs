using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class TrainingReport : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string ReportTitle { get; set; } = string.Empty;

    [MaxLength(50)]
    public string ReportType { get; set; } = string.Empty;

    public DateTime ReportDate { get; set; }

    [MaxLength(2000)]
    public string ReportContent { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? FilePath { get; set; }

    [MaxLength(50)]
    public string ReportStatus { get; set; } = string.Empty;

    // Foreign Key
    public int TrainingFK { get; set; }

    // Navigation property
    public virtual Training Training { get; set; } = null!;
}
