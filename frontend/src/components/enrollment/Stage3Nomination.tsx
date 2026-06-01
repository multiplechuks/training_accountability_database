import { useState } from "react";
import type { Stage3NominationDto } from "@/types";
import { LoadingSpinner } from "@/components/ui";

interface Props {
  onComplete: (data: Stage3NominationDto) => void;
  onBack: () => void;
  loading?: boolean;
  initialData?: Partial<Stage3NominationDto>;
}

export default function Stage3Nomination({ onComplete, onBack, loading, initialData }: Props) {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState<Stage3NominationDto>({
    currentQualifications: initialData?.currentQualifications || "",
    nominatedProgram: initialData?.nominatedProgram || "",
    specialty: initialData?.specialty || "",
    sponsorType: initialData?.sponsorType || "Government",
    sponsorFK: initialData?.sponsorFK,
    yearOfNomination: initialData?.yearOfNomination || currentYear,
    estimatedBudget: initialData?.estimatedBudget || 0,
    currency: initialData?.currency || "MWK",
    professionalBody: initialData?.professionalBody || "",
    nominationStatus: initialData?.nominationStatus || "Pending",
    statusReason: initialData?.statusReason || "",
    nominationDate: initialData?.nominationDate || new Date().toISOString().split("T")[0],
    approvalDate: initialData?.approvalDate || "",
    approvedBy: initialData?.approvedBy || "",
    notes: initialData?.notes || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Qualifications */}
        <div className="col-12">
          <h5 className="border-bottom pb-2">Current Qualifications</h5>
        </div>

        <div className="col-12">
          <label htmlFor="currentQualifications" className="form-label">Current Qualifications *</label>
          <textarea
            id="currentQualifications"
            name="currentQualifications"
            className="form-control"
            rows={3}
            value={formData.currentQualifications}
            onChange={handleChange}
            placeholder="List current qualifications (e.g., Bachelor of Medicine, Diploma in Nursing)"
            required
          />
        </div>

        {/* Program Details */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Nominated Training Program</h5>
        </div>

        <div className="col-md-6">
          <label htmlFor="nominatedProgram" className="form-label">Program Name *</label>
          <input
            type="text"
            id="nominatedProgram"
            name="nominatedProgram"
            className="form-control"
            value={formData.nominatedProgram}
            onChange={handleChange}
            placeholder="e.g., Master of Public Health"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="specialty" className="form-label">Specialty</label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            className="form-control"
            value={formData.specialty}
            onChange={handleChange}
            placeholder="e.g., Epidemiology, Surgery"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="yearOfNomination" className="form-label">Year of Nomination *</label>
          <input
            type="number"
            id="yearOfNomination"
            name="yearOfNomination"
            className="form-control"
            value={formData.yearOfNomination}
            onChange={handleChange}
            min="2020"
            max="2030"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="professionalBody" className="form-label">Professional Body</label>
          <input
            type="text"
            id="professionalBody"
            name="professionalBody"
            className="form-control"
            value={formData.professionalBody}
            onChange={handleChange}
            placeholder="e.g., Medical Council of Malawi"
          />
        </div>

        {/* Sponsorship */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Sponsorship Details</h5>
        </div>

        <div className="col-md-4">
          <label htmlFor="sponsorType" className="form-label">Sponsor Type *</label>
          <select
            id="sponsorType"
            name="sponsorType"
            className="form-select"
            value={formData.sponsorType}
            onChange={handleChange}
            required
          >
            <option value="Government">Government</option>
            <option value="Donor">Donor</option>
            <option value="Self-Funded">Self-Funded</option>
            <option value="Institutional">Institutional</option>
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="estimatedBudget" className="form-label">Estimated Budget *</label>
          <input
            type="number"
            id="estimatedBudget"
            name="estimatedBudget"
            className="form-control"
            value={formData.estimatedBudget}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="currency" className="form-label">Currency *</label>
          <select
            id="currency"
            name="currency"
            className="form-select"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="MWK">MWK (Malawian Kwacha)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
        </div>

        {/* Status */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Nomination Status</h5>
        </div>

        <div className="col-md-6">
          <label htmlFor="nominationStatus" className="form-label">Status *</label>
          <select
            id="nominationStatus"
            name="nominationStatus"
            className="form-select"
            value={formData.nominationStatus}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Deferred">Deferred</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="nominationDate" className="form-label">Nomination Date *</label>
          <input
            type="date"
            id="nominationDate"
            name="nominationDate"
            className="form-control"
            value={formData.nominationDate}
            onChange={handleChange}
            required
          />
        </div>

        {formData.nominationStatus === "Accepted" && (
          <>
            <div className="col-md-6">
              <label htmlFor="approvalDate" className="form-label">Approval Date</label>
              <input
                type="date"
                id="approvalDate"
                name="approvalDate"
                className="form-control"
                value={formData.approvalDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="approvedBy" className="form-label">Approved By</label>
              <input
                type="text"
                id="approvedBy"
                name="approvedBy"
                className="form-control"
                value={formData.approvedBy}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {(formData.nominationStatus === "Deferred" || formData.nominationStatus === "Rejected") && (
          <div className="col-12">
            <label htmlFor="statusReason" className="form-label">Reason</label>
            <textarea
              id="statusReason"
              name="statusReason"
              className="form-control"
              rows={2}
              value={formData.statusReason}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="col-12">
          <label htmlFor="notes" className="form-label">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
          />
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
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Next: Admission →"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
