import React, { useState, useEffect } from "react";
import { CreateTrainingDto, UpdateTrainingDto, TrainingResponseDto } from "@/types";
import { FormSection } from "@/components/forms";
import { formatInputDate } from "@/utils/dateFormatter";

interface TrainingFormProps {
  training?: TrainingResponseDto; // For edit mode
  onSubmit: (data: CreateTrainingDto | UpdateTrainingDto) => void;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

interface FormData {
  institution: string;
  program: string;
  countryOfStudy: string;
  startDate: string;
  endDate: string;
  duration: number;
  departureDate: string;
  arrivalDate: string;
  vacationEmploymentPeriod: string;
  resumptionDate: string;
  extensionPeriod: string;
  dateBondSigned: string;
  bondServingPeriod: string;
  sponsorFK: number;
  modeOfStudy: string;
  trainingStatus: string;
  financialYear: string;
  campusType: string;
}

interface FormErrors {
  institution?: string;
  program?: string;
  countryOfStudy?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  departureDate?: string;
  arrivalDate?: string;
  vacationEmploymentPeriod?: string;
  resumptionDate?: string;
  extensionPeriod?: string;
  dateBondSigned?: string;
  bondServingPeriod?: string;
  sponsorFK?: string;
  modeOfStudy?: string;
  trainingStatus?: string;
  financialYear?: string;
  campusType?: string;
}

const initialFormData: FormData = {
  institution: "",
  program: "",
  countryOfStudy: "",
  startDate: "",
  endDate: "",
  duration: 0,
  departureDate: "",
  arrivalDate: "",
  vacationEmploymentPeriod: "",
  resumptionDate: "",
  extensionPeriod: "",
  dateBondSigned: "",
  bondServingPeriod: "",
  sponsorFK: 0,
  modeOfStudy: "",
  trainingStatus: "Planning",
  financialYear: new Date().getFullYear().toString(),
  campusType: ""
};

const modeOfStudyOptions = [
  { value: "", label: "Select Mode of Study" },
  { value: "Full Time", label: "Full Time" },
  { value: "Part Time", label: "Part Time" },
  { value: "Online", label: "Online" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Distance Learning", label: "Distance Learning" }
];

const trainingStatusOptions = [
  { value: "Planning", label: "Planning" },
  { value: "Active", label: "Active" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Postponed", label: "Postponed" }
];

const campusTypeOptions = [
  { value: "", label: "Select Campus Type" },
  { value: "Main Campus", label: "Main Campus" },
  { value: "Satellite Campus", label: "Satellite Campus" },
  { value: "Online Campus", label: "Online Campus" },
  { value: "External Location", label: "External Location" }
];

const currentYear = new Date().getFullYear();
const financialYearOptions = [
  { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
  { value: currentYear.toString(), label: currentYear.toString() },
  { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() },
  { value: (currentYear + 2).toString(), label: (currentYear + 2).toString() }
];

export default function TrainingForm({ 
  training, 
  onSubmit, 
  onCancel, 
  loading = false, 
  isEditing = false 
}: TrainingFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form data if editing
  useEffect(() => {
    if (isEditing && training) {
      setFormData({
        institution: training.institution,
        program: training.program,
        countryOfStudy: training.countryOfStudy,
        startDate: formatInputDate(training.startDate),
        endDate: formatInputDate(training.endDate),
        duration: training.duration,
        departureDate: formatInputDate(training.departureDate),
        arrivalDate: formatInputDate(training.arrivalDate),
        vacationEmploymentPeriod: training.vacationEmploymentPeriod || "",
        resumptionDate: formatInputDate(training.resumptionDate),
        extensionPeriod: training.extensionPeriod || "",
        dateBondSigned: formatInputDate(training.dateBondSigned),
        bondServingPeriod: training.bondServingPeriod || "",
        sponsorFK: training.sponsorFK || 0,
        modeOfStudy: training.modeOfStudy,
        trainingStatus: training.trainingStatus,
        financialYear: training.financialYear,
        campusType: training.campusType
      });
    }
  }, [isEditing, training]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Auto-calculate duration when start and end dates are provided
    if (field === "startDate" || field === "endDate") {
      const updatedFormData = { ...formData, [field]: value };
      if (updatedFormData.startDate && updatedFormData.endDate) {
        const start = new Date(updatedFormData.startDate);
        const end = new Date(updatedFormData.endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
          setFormData(prev => ({ ...prev, duration: diffMonths }));
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required field validations
    if (!formData.institution.trim()) {
      newErrors.institution = "Institution is required";
    }
    
    if (!formData.program.trim()) {
      newErrors.program = "Program name is required";
    }
    
    if (!formData.countryOfStudy.trim()) {
      newErrors.countryOfStudy = "Country of study is required";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }
    
    if (!formData.modeOfStudy) {
      newErrors.modeOfStudy = "Mode of study is required";
    }
    
    if (!formData.trainingStatus) {
      newErrors.trainingStatus = "Training status is required";
    }
    
    if (!formData.financialYear) {
      newErrors.financialYear = "Financial year is required";
    }

    // Date validations
    if (formData.departureDate && formData.startDate) {
      if (new Date(formData.departureDate) > new Date(formData.startDate)) {
        newErrors.departureDate = "Departure date should be before or on start date";
      }
    }

    if (formData.arrivalDate && formData.endDate) {
      if (new Date(formData.arrivalDate) < new Date(formData.endDate)) {
        newErrors.arrivalDate = "Arrival date should be on or after end date";
      }
    }

    if (formData.resumptionDate && formData.endDate) {
      if (new Date(formData.resumptionDate) < new Date(formData.endDate)) {
        newErrors.resumptionDate = "Resumption date should be after end date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submissionData: CreateTrainingDto | UpdateTrainingDto = {
      institution: formData.institution.trim(),
      program: formData.program.trim(),
      countryOfStudy: formData.countryOfStudy.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      departureDate: formData.departureDate || undefined,
      arrivalDate: formData.arrivalDate || undefined,
      vacationEmploymentPeriod: formData.vacationEmploymentPeriod || undefined,
      resumptionDate: formData.resumptionDate || undefined,
      extensionPeriod: formData.extensionPeriod || undefined,
      dateBondSigned: formData.dateBondSigned || undefined,
      bondServingPeriod: formData.bondServingPeriod || undefined,
      sponsorFK: formData.sponsorFK > 0 ? formData.sponsorFK : undefined,
      modeOfStudy: formData.modeOfStudy,
      trainingStatus: formData.trainingStatus,
      financialYear: formData.financialYear,
      campusType: formData.campusType
    };

    onSubmit(submissionData);
  };

  return (
    <div className="training-form">
      <form onSubmit={handleSubmit}>
        <FormSection title="Training Information">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="institution" className="form-label">Institution <span className="text-danger">*</span></label>
              <input
                type="text"
                id="institution"
                className={`form-control ${errors.institution ? "is-invalid" : ""}`}
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="Enter institution name"
                disabled={loading}
                maxLength={200}
              />
              {errors.institution && <div className="invalid-feedback">{errors.institution}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="program" className="form-label">Program Name <span className="text-danger">*</span></label>
              <input
                type="text"
                id="program"
                className={`form-control ${errors.program ? "is-invalid" : ""}`}
                value={formData.program}
                onChange={(e) => handleInputChange("program", e.target.value)}
                placeholder="Enter program name"
                disabled={loading}
                maxLength={200}
              />
              {errors.program && <div className="invalid-feedback">{errors.program}</div>}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="countryOfStudy" className="form-label">Country of Study <span className="text-danger">*</span></label>
              <input
                type="text"
                id="countryOfStudy"
                className={`form-control ${errors.countryOfStudy ? "is-invalid" : ""}`}
                value={formData.countryOfStudy}
                onChange={(e) => handleInputChange("countryOfStudy", e.target.value)}
                placeholder="Enter country"
                disabled={loading}
                maxLength={100}
              />
              {errors.countryOfStudy && <div className="invalid-feedback">{errors.countryOfStudy}</div>}
            </div>
            
            <div className="col-md-4">
              <label htmlFor="modeOfStudy" className="form-label">Mode of Study <span className="text-danger">*</span></label>
              <select
                id="modeOfStudy"
                className={`form-select ${errors.modeOfStudy ? "is-invalid" : ""}`}
                value={formData.modeOfStudy}
                onChange={(e) => handleInputChange("modeOfStudy", e.target.value)}
                disabled={loading}
              >
                {modeOfStudyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.modeOfStudy && <div className="invalid-feedback">{errors.modeOfStudy}</div>}
            </div>
            
            <div className="col-md-4">
              <label htmlFor="campusType" className="form-label">Campus Type</label>
              <select
                id="campusType"
                className={`form-select ${errors.campusType ? "is-invalid" : ""}`}
                value={formData.campusType}
                onChange={(e) => handleInputChange("campusType", e.target.value)}
                disabled={loading}
              >
                {campusTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.campusType && <div className="invalid-feedback">{errors.campusType}</div>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Duration & Dates">
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="startDate" className="form-label">Start Date <span className="text-danger">*</span></label>
              <input
                type="date"
                id="startDate"
                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                disabled={loading}
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="endDate" className="form-label">End Date <span className="text-danger">*</span></label>
              <input
                type="date"
                id="endDate"
                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                disabled={loading}
              />
              {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="duration" className="form-label">Duration (Months) <span className="text-danger">*</span></label>
              <input
                type="number"
                id="duration"
                className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                value={formData.duration || ""}
                onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
                placeholder="Duration in months"
                disabled={loading}
                min="1"
                max="120"
              />
              {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="financialYear" className="form-label">Financial Year <span className="text-danger">*</span></label>
              <select
                id="financialYear"
                className={`form-select ${errors.financialYear ? "is-invalid" : ""}`}
                value={formData.financialYear}
                onChange={(e) => handleInputChange("financialYear", e.target.value)}
                disabled={loading}
              >
                {financialYearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.financialYear && <div className="invalid-feedback">{errors.financialYear}</div>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Travel & Administrative Dates">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="departureDate" className="form-label">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                className={`form-control ${errors.departureDate ? "is-invalid" : ""}`}
                value={formData.departureDate}
                onChange={(e) => handleInputChange("departureDate", e.target.value)}
                disabled={loading}
              />
              {errors.departureDate && <div className="invalid-feedback">{errors.departureDate}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="arrivalDate" className="form-label">Arrival Date</label>
              <input
                type="date"
                id="arrivalDate"
                className={`form-control ${errors.arrivalDate ? "is-invalid" : ""}`}
                value={formData.arrivalDate}
                onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                disabled={loading}
              />
              {errors.arrivalDate && <div className="invalid-feedback">{errors.arrivalDate}</div>}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="resumptionDate" className="form-label">Resumption Date</label>
              <input
                type="date"
                id="resumptionDate"
                className={`form-control ${errors.resumptionDate ? "is-invalid" : ""}`}
                value={formData.resumptionDate}
                onChange={(e) => handleInputChange("resumptionDate", e.target.value)}
                disabled={loading}
              />
              {errors.resumptionDate && <div className="invalid-feedback">{errors.resumptionDate}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="dateBondSigned" className="form-label">Date Bond Signed</label>
              <input
                type="date"
                id="dateBondSigned"
                className={`form-control ${errors.dateBondSigned ? "is-invalid" : ""}`}
                value={formData.dateBondSigned}
                onChange={(e) => handleInputChange("dateBondSigned", e.target.value)}
                disabled={loading}
              />
              {errors.dateBondSigned && <div className="invalid-feedback">{errors.dateBondSigned}</div>}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="vacationEmploymentPeriod" className="form-label">Vacation Employment Period</label>
              <input
                type="text"
                id="vacationEmploymentPeriod"
                className={`form-control ${errors.vacationEmploymentPeriod ? "is-invalid" : ""}`}
                value={formData.vacationEmploymentPeriod}
                onChange={(e) => handleInputChange("vacationEmploymentPeriod", e.target.value)}
                placeholder="e.g., 3 months"
                disabled={loading}
                maxLength={50}
              />
              {errors.vacationEmploymentPeriod && <div className="invalid-feedback">{errors.vacationEmploymentPeriod}</div>}
            </div>
            
            <div className="col-md-4">
              <label htmlFor="extensionPeriod" className="form-label">Extension Period</label>
              <input
                type="text"
                id="extensionPeriod"
                className={`form-control ${errors.extensionPeriod ? "is-invalid" : ""}`}
                value={formData.extensionPeriod}
                onChange={(e) => handleInputChange("extensionPeriod", e.target.value)}
                placeholder="e.g., 6 months"
                disabled={loading}
                maxLength={50}
              />
              {errors.extensionPeriod && <div className="invalid-feedback">{errors.extensionPeriod}</div>}
            </div>
            
            <div className="col-md-4">
              <label htmlFor="bondServingPeriod" className="form-label">Bond Serving Period</label>
              <input
                type="text"
                id="bondServingPeriod"
                className={`form-control ${errors.bondServingPeriod ? "is-invalid" : ""}`}
                value={formData.bondServingPeriod}
                onChange={(e) => handleInputChange("bondServingPeriod", e.target.value)}
                placeholder="e.g., 2 years"
                disabled={loading}
                maxLength={50}
              />
              {errors.bondServingPeriod && <div className="invalid-feedback">{errors.bondServingPeriod}</div>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Status & Administration">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="trainingStatus" className="form-label">Training Status <span className="text-danger">*</span></label>
              <select
                id="trainingStatus"
                className={`form-select ${errors.trainingStatus ? "is-invalid" : ""}`}
                value={formData.trainingStatus}
                onChange={(e) => handleInputChange("trainingStatus", e.target.value)}
                disabled={loading}
              >
                {trainingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.trainingStatus && <div className="invalid-feedback">{errors.trainingStatus}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="sponsorFK" className="form-label">Sponsor (Optional)</label>
              <select
                id="sponsorFK"
                className={`form-select ${errors.sponsorFK ? "is-invalid" : ""}`}
                value={formData.sponsorFK || ""}
                onChange={(e) => handleInputChange("sponsorFK", parseInt(e.target.value) || 0)}
                disabled={loading}
              >
                <option value="">Select Sponsor (Optional)</option>
                {/* TODO: Load sponsors from API */}
                <option value="1">Government of Botswana</option>
                <option value="2">World Bank</option>
                <option value="3">African Development Bank</option>
              </select>
              {errors.sponsorFK && <div className="invalid-feedback">{errors.sponsorFK}</div>}
            </div>
          </div>
        </FormSection>

        <div className="form-actions mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Update Training" : "Create Training"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
