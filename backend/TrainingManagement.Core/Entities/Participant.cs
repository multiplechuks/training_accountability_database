using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class Participant : BaseEntity
{
    [MaxLength(10)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Firstname { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Lastname { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Middlename { get; set; }

    [Required]
    [MaxLength(20)]
    public string IdNo { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Sex { get; set; } = string.Empty;

    public DateTime Dob { get; set; }

    [MaxLength(20)]
    public string IdType { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    // Navigation properties
    public virtual ICollection<ParticipantEnrollment> ParticipantEnrollments { get; set; } = new List<ParticipantEnrollment>();
    public virtual ICollection<NextOfKin> NextOfKins { get; set; } = new List<NextOfKin>();
    public virtual ICollection<ParticipantTraining> ParticipantTrainings { get; set; } = new List<ParticipantTraining>();
    public virtual ICollection<TrainingTransfer> TrainingTransfers { get; set; } = new List<TrainingTransfer>();
    public virtual ICollection<Allowance> Allowances { get; set; } = new List<Allowance>();

    public string FullName => $"{Firstname} {Lastname}";
}
