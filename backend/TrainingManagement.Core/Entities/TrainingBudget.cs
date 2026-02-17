using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Core.Entities;

public class TrainingBudget : BaseEntity
{
    public decimal AllocatedAmount { get; set; }

    public decimal SpentAmount { get; set; }

    public decimal RemainingAmount => AllocatedAmount - SpentAmount;

    [MaxLength(20)]
    public string FinancialYear { get; set; } = string.Empty;

    [MaxLength(100)]
    public string BudgetCategory { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Foreign Key
    public int TrainingFK { get; set; }

    // Navigation property
    public virtual Training Training { get; set; } = null!;
}
