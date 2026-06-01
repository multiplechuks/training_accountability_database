import { useState } from "react";
import type { Stage4AdmissionDto } from "@/types";
import { LoadingSpinner } from "@/components/ui";

interface Props {
  onComplete: (data: Stage4AdmissionDto) => void;
  onBack: () => void;
  loading?: boolean;
  initialData?: Partial<Stage4AdmissionDto>;
}

export default function Stage4Admission({ onComplete, onBack, loading, initialData }: Props) {
  const [formData, setFormData] = useState<Stage4AdmissionDto>({
    institution: initialData?.institution || "",
    program: initialData?.program || "",
    specialty: initialData?.specialty || "",
    countryOfStudy: initialData?.countryOfStudy || "Malawi",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    duration: initialData?.duration || 0,
    modeOfStudy: initialData?.modeOfStudy || "Full-time",
    campusType: initialData?.campusType || "Main Campus",
    designationFK: initialData?.designationFK,
    salaryScaleFK: initialData?.salaryScaleFK,
    departmentFK: initialData?.departmentFK,
    facilityFK: initialData?.facilityFK,
    payrollDate: initialData?.payrollDate || "",
    studyLeaveDate: initialData?.studyLeaveDate || "",
    allowanceStoppageDate: initialData?.allowanceStoppageDate || "",
    needingTravel: initialData?.needingTravel || false,
    departureDate: initialData?.departureDate || "",
    arrivalDate: initialData?.arrivalDate || "",
    sponsorFK: initialData?.sponsorFK,
    registrationDate: initialData?.registrationDate || new Date().toISOString().split("T")[0],
    trainingStatus: initialData?.trainingStatus || "Active",
    financialYear: initialData?.financialYear || new Date().getFullYear().toString()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "number" ? (value ? parseInt(value) : 0) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Training Institution */}
        <div className="col-12">
          <h5 className="border-bottom pb-2">Training Institution & Program</h5>
        </div>

        <div className="col-md-6">
          <label htmlFor="institution" className="form-label">Institution *</label>
          <input
            type="text"
            id="institution"
            name="institution"
            className="form-control"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g., University of Malawi"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="program" className="form-label">Program *</label>
          <input
            type="text"
            id="program"
            name="program"
            className="form-control"
            value={formData.program}
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
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="countryOfStudy" className="form-label">Country of Study *</label>
          <input
            type="text"
            id="countryOfStudy"
            name="countryOfStudy"
            className="form-control"
            value={formData.countryOfStudy}
            onChange={handleChange}
            required
          />
        </div>

        {/* Study Period */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Study Period</h5>
        </div>

        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">End Date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="form-control"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="duration" className="form-label">Duration (months) *</label>
          <input
            type="number"
            id="duration"
            name="duration"
            className="form-control"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="modeOfStudy" className="form-label">Mode of Study *</label>
          <select
            id="modeOfStudy"
            name="modeOfStudy"
            className="form-select"
            value={formData.modeOfStudy}
            onChange={handleChange}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Distance">Distance</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="campusType" className="form-label">Campus Type *</label>
          <select
            id="campusType"
            name="campusType"
            className="form-select"
            value={formData.campusType}
            onChange={handleChange}
            required
          >
            <option value="Main Campus">Main Campus</option>
            <option value="Branch">Branch</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {/* Administrative Dates */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Administrative Details</h5>
        </div>

        <div className="col-md-4">
          <label htmlFor="registrationDate" className="form-label">Registration Date *</label>
          <input
            type="date"
            id="registrationDate"
            name="registrationDate"
            className="form-control"
            value={formData.registrationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="financialYear" className="form-label">Financial Year *</label>
          <input
            type="text"
            id="financialYear"
            name="financialYear"
            className="form-control"
            value={formData.financialYear}
            onChange={handleChange}
            placeholder="2026"
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="trainingStatus" className="form-label">Training Status *</label>
          <select
            id="trainingStatus"
            name="trainingStatus"
            className="form-select"
            value={formData.trainingStatus}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="studyLeaveDate" className="form-label">Study Leave Date</label>
          <input
            type="date"
            id="studyLeaveDate"
            name="studyLeaveDate"
            className="form-control"
            value={formData.studyLeaveDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="payrollDate" className="form-label">Payroll Date</label>
          <input
            type="date"
            id="payrollDate"
            name="payrollDate"
            className="form-control"
            value={formData.payrollDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="allowanceStoppageDate" className="form-label">Allowance Stoppage Date</label>
          <input
            type="date"
            id="allowanceStoppageDate"
            name="allowanceStoppageDate"
            className="form-control"
            value={formData.allowanceStoppageDate}
            onChange={handleChange}
          />
        </div>

        {/* Travel Requirements */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Travel Details</h5>
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              id="needingTravel"
              name="needingTravel"
              className="form-check-input"
              checked={formData.needingTravel}
              onChange={handleChange}
            />
            <label htmlFor="needingTravel" className="form-check-label">
              Requires Travel Arrangements
            </label>
          </div>
        </div>

        {formData.needingTravel && (
          <>
            <div className="col-md-6">
              <label htmlFor="departureDate" className="form-label">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                className="form-control"
                value={formData.departureDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="arrivalDate" className="form-label">Arrival Date</label>
              <input
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                className="form-control"
                value={formData.arrivalDate}
                onChange={handleChange}
              />
            </div>
          </>
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
                "Next: Bonding →"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
