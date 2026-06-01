import { useState, useEffect, useMemo } from "react";
import type { Form6_TrainingCostsData, AllowanceItem } from "../../../types/nomination";
import type { AllowanceType, AllowanceStatus } from "../../../types";
import { getAllowanceTypesLookup } from "../../../api/allowanceType";
import { getAllowanceStatusesLookup } from "../../../api/allowanceStatus";
import { LoadingSpinner } from "../../../components/ui";

interface Form6Props {
  data: Form6_TrainingCostsData;
  onDataChange: (data: Form6_TrainingCostsData) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form6_TrainingCosts({ data, onDataChange, onNext, onBack, onSave, loading }: Form6Props) {
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);
  const [allowanceStatuses, setAllowanceStatuses] = useState<AllowanceStatus[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const allowances = useMemo(() => data.allowances || [], [data.allowances]);

  useEffect(() => {
    loadAllowanceTypes();
    loadAllowanceStatuses();
  }, []);

  const loadAllowanceTypes = async () => {
    try {
      setLoadingTypes(true);
      setLoadError(null);
      const types = await getAllowanceTypesLookup();
      setAllowanceTypes(types);
    } catch (_error) {
      setLoadError("Failed to load allowance types.");
    } finally {
      setLoadingTypes(false);
    }
  };

  const loadAllowanceStatuses = async () => {
    try {
      setLoadError(null);
      const statuses = await getAllowanceStatusesLookup();
      setAllowanceStatuses(statuses);
    } catch (_error) {
      setLoadError("Failed to load allowance statuses.");
    }
  };

  // Populate allowance type names for existing allowances when types are loaded
  useEffect(() => {
    if (allowanceTypes.length > 0 && allowances.length > 0) {
      const updated = allowances.map(allowance => {
        if (allowance.allowanceTypeFK && !allowance.allowanceTypeName) {
          const type = allowanceTypes.find(t => t.pk === allowance.allowanceTypeFK);
          return {
            ...allowance,
            allowanceTypeName: type?.name || "",
            frequency: type?.frequency || allowance.frequency
          };
        }
        return allowance;
      });
      
      // Only update if there were changes
      if (JSON.stringify(updated) !== JSON.stringify(allowances)) {
        onDataChange({ ...data, allowances: updated });
      }
    }
  }, [allowanceTypes, allowances, data, onDataChange]);

  const addAllowance = () => {
    const newAllowance: AllowanceItem = {
      allowanceTypeFK: 0,
      allowanceTypeName: "",
      statusFK: allowanceStatuses.length > 0 ? allowanceStatuses[0].pk : 1,
      amount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      frequency: "Monthly",
      comments: ""
    };

    onDataChange({
      ...data,
      allowances: [...allowances, newAllowance]
    });
  };

  const updateAllowance = (index: number, field: keyof AllowanceItem, value: string) => {
    const updated = [...allowances];

    // If allowance type is changed, update the frequency from the selected type
    if (field === "allowanceTypeFK") {
      const selectedType = allowanceTypes.find(t => t.pk === parseInt(value, 10));
      updated[index] = {
        ...updated[index],
        [field]: parseInt(value, 10),
        allowanceTypeName: selectedType?.name,
        frequency: selectedType?.frequency || "Monthly"
      };
    } else if (field === "statusFK") {
      updated[index] = {
        ...updated[index],
        [field]: parseInt(value, 10)
      };
    } else if (field === "amount") {
      if (value === "") {
        updated[index] = {
          ...updated[index],
          [field]: 0
        };
      } else {
        const parsedAmount = parseFloat(value);
        updated[index] = {
          ...updated[index],
          [field]: Number.isNaN(parsedAmount) ? 0 : parsedAmount
        };
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }

    onDataChange({
      ...data,
      allowances: updated
    });
  };

  const removeAllowance = (index: number) => {
    const updated = allowances.filter((_, i) => i !== index);
    onDataChange({
      ...data,
      allowances: updated
    });
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 6: Training Costs & Allowances</h3>
          <p className="text-muted">Add multiple allowances for this participant</p>

          {loadError && (
            <div className="alert alert-warning">
              {loadError}
            </div>
          )}

          {loadingTypes ? (
            <LoadingSpinner centered />
          ) : (
            <>
              {allowances.map((allowance, index) => (
                <div key={index} className="card mb-3 border-secondary">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Allowance {index + 1}</h5>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeAllowance(index)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="required" htmlFor={`allowanceType-${index}`}>Allowance Type</label>
                          <select
                            id={`allowanceType-${index}`}
                            className="form-control"
                            value={allowance.allowanceTypeFK}
                            onChange={(e) => updateAllowance(index, "allowanceTypeFK", e.target.value)}
                            required
                          >
                            <option value={0}>Select Allowance Type...</option>
                            {allowanceTypes.map(type => (
                              <option key={type.pk} value={type.pk}>
                                {type.name} {type.frequency && `(${type.frequency})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="required" htmlFor={`status-${index}`}>Status</label>
                          <select
                            id={`status-${index}`}
                            className="form-control"
                            value={allowance.statusFK}
                            onChange={(e) => updateAllowance(index, "statusFK", e.target.value)}
                            required
                          >
                            {allowanceStatuses.map(status => (
                              <option key={status.pk} value={status.pk}>
                                {status.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="required" htmlFor={`amount-${index}`}>Amount</label>
                          <input
                            type="number"
                            id={`amount-${index}`}
                            className="form-control"
                            value={allowance.amount === 0 ? "" : allowance.amount}
                            onChange={(e) => updateAllowance(index, "amount", e.target.value)}
                            placeholder="Enter amount"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="required" htmlFor={`startDate-${index}`}>Start Date</label>
                          <input
                            type="date"
                            id={`startDate-${index}`}
                            className="form-control"
                            value={allowance.startDate}
                            onChange={(e) => updateAllowance(index, "startDate", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="required" htmlFor={`endDate-${index}`}>End Date</label>
                          <input
                            type="date"
                            id={`endDate-${index}`}
                            className="form-control"
                            value={allowance.endDate}
                            onChange={(e) => updateAllowance(index, "endDate", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor={`frequency-${index}`}>Frequency</label>
                          <input
                            type="text"
                            id={`frequency-${index}`}
                            className="form-control"
                            value={allowance.frequency}
                            readOnly
                            disabled
                          />
                          <small className="form-text text-muted">
                            Frequency is auto-set from allowance type
                          </small>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label htmlFor={`comments-${index}`}>Comments</label>
                          <textarea
                            id={`comments-${index}`}
                            className="form-control"
                            value={allowance.comments || ""}
                            onChange={(e) => updateAllowance(index, "comments", e.target.value)}
                            rows={2}
                            placeholder="Optional comments..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mb-4">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addAllowance}
                  disabled={loading || loadingTypes}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Allowance
                </button>
              </div>
            </>
          )}

          <div className="form-actions mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={onSave}
              disabled={loading}
            >
              Save Progress
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNext}
              disabled={loading || allowances.length === 0 || allowances.some(a => a.allowanceTypeFK === 0)}
            >
              {loading ? "Processing..." : "Next: Completion"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

