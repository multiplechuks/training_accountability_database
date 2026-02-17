using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

/// <summary>
/// Lookup table for extension reason categories (Form 5)
/// </summary>
public class ExtensionReason : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Lookup table for nomination statuses (Form 2)
/// </summary>
public class NominationStatus : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty; // Accepted, Deferred, Rejected, Pending

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Lookup table for travel modes (Form 4)
/// </summary>
public class TravelMode : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty; // Air, Road, Rail, Sea

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Lookup table for study modes (Form 3)
/// </summary>
public class StudyMode : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty; // Full-time, Part-time, Online, Distance, Hybrid

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Lookup table for specialties (Form 3)
/// </summary>
public class Specialty : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Lookup table for qualifications (Form 2)
/// </summary>
public class Qualification : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty; // Diploma, Degree, Masters, PhD, etc.

    [MaxLength(10)]
    public string Level { get; set; } = string.Empty; // UG, PG, Doctoral

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}
