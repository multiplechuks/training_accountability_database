using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class ParticipantEnrollment : BaseEntity
{
    // Employment Information (Section 2)
    public int? DesignationFK { get; set; }
    public int? SalaryScaleFK { get; set; }
    public int? DepartmentFK { get; set; }
    public int? FacilityFK { get; set; }

    public DateTime? PayrollDate { get; set; }
    public DateTime? StudyLeaveDate { get; set; }
    public DateTime? AllowanceStoppageDate { get; set; }

    // Study Information (Section 3)
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Duration { get; set; } // in months

    public bool NeedingTravel { get; set; } = false;
    public DateTime? DepartureDate { get; set; }
    public DateTime? ArrivalDate { get; set; }

    // Bond Section (Section 4)
    public DateTime? DateBondSigned { get; set; }
    [MaxLength(50)]
    public string? BondServingPeriod { get; set; }

    // Others (Section 5)
    public int? SponsorFK { get; set; }
    [MaxLength(50)]
    public string ModeOfStudy { get; set; } = string.Empty; // Full-time, Part-time, Distance, etc.
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    [MaxLength(50)]
    public string TrainingStatus { get; set; } = string.Empty; // Active, Completed, Withdrawn, etc.
    [MaxLength(20)]
    public string FinancialYear { get; set; } = string.Empty;
    [MaxLength(50)]
    public string CampusType { get; set; } = string.Empty; // Main Campus, Branch, Online, etc.

    // Foreign Keys
    public int ParticipantFK { get; set; }
    public int TrainingFK { get; set; }

    // Navigation properties
    public virtual Participant Participant { get; set; } = null!;
    public virtual Training Training { get; set; } = null!;
    public virtual Designation? Designation { get; set; }
    public virtual SalaryScale? SalaryScale { get; set; }
    public virtual Department? Department { get; set; }
    public virtual Facility? Facility { get; set; }
    public virtual Sponsor? Sponsor { get; set; }
    // public virtual Bond? Bond { get; set; } // Temporarily disabled until relationship is properly configured
}
