using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Admission : BaseEntity
{
    public int NominationFK { get; set; }

    public DateTime AdmissionDate { get; set; }

    public int? AdmissionProgramFK { get; set; }

    public int? ModeOfStudyFK { get; set; }

    // Release letter dates
    public DateTime? ReleaseStartDate { get; set; }
    public DateTime? ReleaseEndDate { get; set; }

    // Release letter file upload
    [MaxLength(500)]
    public string? ReleaseLetterPath { get; set; }

    [MaxLength(255)]
    public string? ReleaseLetterOriginalName { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Nomination Nomination { get; set; } = null!;
    public virtual AdmissionProgram? AdmissionProgram { get; set; }
    public virtual ModeOfStudy? ModeOfStudy { get; set; }
}
