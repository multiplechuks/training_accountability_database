import { useState } from "react";
import type { Stage5BondDto } from "@/types";
import { LoadingSpinner } from "@/components/ui";

interface Props {
  onComplete: (data: Stage5BondDto) => void;
  onBack: () => void;
  loading?: boolean;
  initialData?: Partial<Stage5BondDto>;
}

export default function Stage5Bonding({ onComplete, onBack, loading, initialData }: Props) {
  const [formData, setFormData] = useState<Stage5BondDto>({
    bondStartDate: initialData?.bondStartDate || "",
    bondEndDate: initialData?.bondEndDate || "",
    bondPeriodMonths: initialData?.bondPeriodMonths || 0,
    bondSigned: initialData?.bondSigned || false,
    dateSigned: initialData?.dateSigned || "",
    bondStatus: initialData?.bondStatus || "Pending",
    bondAmount: initialData?.bondAmount || 0,
    bondConditions: initialData?.bondConditions || "",
    inductionCompleted: initialData?.inductionCompleted || false,
    inductionDate: initialData?.inductionDate || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "number" ? (value ? parseFloat(value) : 0) : value
      }));
    }
  };

  // Calculate bond end date based on start date and period
  const calculateEndDate = () => {
    if (formData.bondStartDate && formData.bondPeriodMonths) {
      const startDate = new Date(formData.bondStartDate);
      startDate.setMonth(startDate.getMonth() + formData.bondPeriodMonths);
      const endDate = startDate.toISOString().split("T")[0];
      setFormData(prev => ({ ...prev, bondEndDate: endDate }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <div className="alert alert-info">
            <strong>Bond Agreement:</strong> This section captures the service bond obligations for the training participant.
          </div>
        </div>

        {/* Bond Period */}
        <div className="col-12">
          <h5 className="border-bottom pb-2">Bond Period</h5>
        </div>

        <div className="col-md-4">
          <label htmlFor="bondStartDate" className="form-label">Bond Start Date *</label>
          <input
            type="date"
            id="bondStartDate"
            name="bondStartDate"
            className="form-control"
            value={formData.bondStartDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="bondPeriodMonths" className="form-label">Bond Period (Months) *</label>
          <input
            type="number"
            id="bondPeriodMonths"
            name="bondPeriodMonths"
            className="form-control"
            value={formData.bondPeriodMonths}
            onChange={handleChange}
            onBlur={calculateEndDate}
            min="0"
            required
          />
          <div className="form-text">Common periods: 12, 24, 36, 48 months</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="bondEndDate" className="form-label">Bond End Date *</label>
          <input
            type="date"
            id="bondEndDate"
            name="bondEndDate"
            className="form-control"
            value={formData.bondEndDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bond Details */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Bond Details</h5>
        </div>

        <div className="col-md-6">
          <label htmlFor="bondAmount" className="form-label">Bond Amount (MWK) *</label>
          <input
            type="number"
            id="bondAmount"
            name="bondAmount"
            className="form-control"
            value={formData.bondAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="bondStatus" className="form-label">Bond Status *</label>
          <select
            id="bondStatus"
            name="bondStatus"
            className="form-select"
            value={formData.bondStatus}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Breached">Breached</option>
            <option value="Waived">Waived</option>
          </select>
        </div>

        <div className="col-12">
          <label htmlFor="bondConditions" className="form-label">Bond Conditions</label>
          <textarea
            id="bondConditions"
            name="bondConditions"
            className="form-control"
            rows={4}
            value={formData.bondConditions}
            onChange={handleChange}
            placeholder="Specify any special conditions or terms of the bond agreement..."
          />
        </div>

        {/* Signing Status */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Signing & Induction</h5>
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              id="bondSigned"
              name="bondSigned"
              className="form-check-input"
              checked={formData.bondSigned}
              onChange={handleChange}
            />
            <label htmlFor="bondSigned" className="form-check-label">
              Bond Agreement Signed
            </label>
          </div>
        </div>

        {formData.bondSigned && (
          <div className="col-md-6">
            <label htmlFor="dateSigned" className="form-label">Date Signed</label>
            <input
              type="date"
              id="dateSigned"
              name="dateSigned"
              className="form-control"
              value={formData.dateSigned}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="col-12 mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="inductionCompleted"
              name="inductionCompleted"
              className="form-check-input"
              checked={formData.inductionCompleted}
              onChange={handleChange}
            />
            <label htmlFor="inductionCompleted" className="form-check-label">
              Induction Completed
            </label>
          </div>
        </div>

        {formData.inductionCompleted && (
          <div className="col-md-6">
            <label htmlFor="inductionDate" className="form-label">Induction Date</label>
            <input
              type="date"
              id="inductionDate"
              name="inductionDate"
              className="form-control"
              value={formData.inductionDate}
              onChange={handleChange}
            />
          </div>
        )}

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
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Next: Training Costs →"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
