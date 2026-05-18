using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Title : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}

public class IdType : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}

public class RelationshipType : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public virtual ICollection<NextOfKin> NextOfKins { get; set; } = new List<NextOfKin>();
}

public class Department : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string? Code { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}

public class SalaryScale : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string Scale { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Grade { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}

public class DutyStation : BaseEntity
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string? Code { get; set; }

    [MaxLength(200)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}

public class SponsorType : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Nomination> Nominations { get; set; } = new List<Nomination>();
}


