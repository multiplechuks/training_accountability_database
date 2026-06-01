import { useState } from "react";
import type { Stage6TrainingCostDto, AllowanceItemDto } from "@/types";
import { LoadingSpinner } from "@/components/ui";

interface Props {
  onComplete: (data: Stage6TrainingCostDto) => void;
  onBack: () => void;
  loading?: boolean;
  initialData?: Partial<Stage6TrainingCostDto>;
}

export default function Stage6TrainingCosts({ onComplete, onBack, loading, initialData }: Props) {
  const [allowances, setAllowances] = useState<AllowanceItemDto[]>(
    initialData?.allowances || [
      {
        allowanceTypeFK: 1,
        allowanceTypeName: "Tuition Fees",
        amount: 0,
        startDate: "",
        endDate: "",
        frequency: "Once-Off",
        comments: "",
        statusFK: 1
      }
    ]
  );

  const allowanceTypes = [
    { id: 1, name: "Tuition Fees" },
    { id: 2, name: "Accommodation" },
    { id: 3, name: "Transport/Travel" },
    { id: 4, name: "Subsistence" },
    { id: 5, name: "Book Allowance" },
    { id: 6, name: "Research Grant" },
    { id: 7, name: "Conference Allowance" },
    { id: 8, name: "Other" }
  ];

  const handleAllowanceChange = (index: number, field: keyof AllowanceItemDto, value: unknown) => {
    const newAllowances = [...allowances];
    newAllowances[index] = { ...newAllowances[index], [field]: value };
    
    // Update name when type changes
    if (field === "allowanceTypeFK") {
      const type = allowanceTypes.find(t => t.id === parseInt(value as string));
      if (type) {
        newAllowances[index].allowanceTypeName = type.name;
      }
    }
    
    setAllowances(newAllowances);
  };

  const addAllowance = () => {
    setAllowances([
      ...allowances,
      {
        allowanceTypeFK: 1,
        allowanceTypeName: "Tuition Fees",
        amount: 0,
        startDate: "",
        endDate: "",
        frequency: "Once-Off",
        comments: "",
        statusFK: 1
      }
    ]);
  };

  const removeAllowance = (index: number) => {
    if (allowances.length > 1) {
      setAllowances(allowances.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return allowances.reduce((sum, allowance) => sum + (allowance.amount || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ allowances });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <div className="alert alert-warning">
            <strong>Final Stage:</strong> Add all training costs and allowances. After submitting, the enrollment will be marked as complete.
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="mb-0">Training Costs & Allowances</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={addAllowance}
            >
              + Add Allowance
            </button>
          </div>
        </div>

        {allowances.map((allowance, index) => (
          <div key={index} className="col-12">
            <div className="card mb-3">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <span className="fw-bold">Cost Item #{index + 1}</span>
                {allowances.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeAllowance(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Allowance Type *</label>
                    <select
                      className="form-select"
                      value={allowance.allowanceTypeFK}
                      onChange={(e) => handleAllowanceChange(index, "allowanceTypeFK", parseInt(e.target.value))}
                      required
                    >
                      {allowanceTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Amount (MWK) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={allowance.amount}
                      onChange={(e) => handleAllowanceChange(index, "amount", parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={allowance.startDate}
                      onChange={(e) => handleAllowanceChange(index, "startDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">End Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={allowance.endDate}
                      onChange={(e) => handleAllowanceChange(index, "endDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Frequency *</label>
                    <select
                      className="form-select"
                      value={allowance.frequency}
                      onChange={(e) => handleAllowanceChange(index, "frequency", e.target.value)}
                      required
                    >
                      <option value="Once-Off">Once-Off</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Comments</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={allowance.comments}
                      onChange={(e) => handleAllowanceChange(index, "comments", e.target.value)}
                      placeholder="Additional notes about this cost item..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Total Cost Summary */}
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Training Cost</h5>
                <h3 className="mb-0 text-primary">
                  MWK {calculateTotal().toLocaleString("en-MW", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="text-muted small mt-2">
                {allowances.length} cost item{allowances.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBack}
              disabled={loading}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || allowances.length === 0}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="me-2" />
                  Completing Enrollment...
                </>
              ) : (
                "Complete Enrollment ✓"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
