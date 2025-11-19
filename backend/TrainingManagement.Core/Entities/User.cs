using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TrainingManagement.Core.Entities;

public class User : IdentityUser<int>
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    [MaxLength(200)]
    public string? ProfilePictureUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string UpdatedBy { get; set; } = string.Empty;

    public bool Deleted { get; set; } = false;

    public string FullName => $"{FirstName} {LastName}";
}

public class ApplicationRole : IdentityRole<int>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string UpdatedBy { get; set; } = string.Empty;

    public bool Deleted { get; set; } = false;
}
