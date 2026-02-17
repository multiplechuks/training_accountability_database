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
  modeOfStudy: string;
  campusType: string;
}

interface FormErrors {
  institution?: string;
  program?: string;
  countryOfStudy?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  modeOfStudy?: string;
  campusType?: string;
}

const initialFormData: FormData = {
  institution: "",
  program: "",
  countryOfStudy: "",
  startDate: "",
  endDate: "",
  duration: 0,
  modeOfStudy: "",
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

const campusTypeOptions = [
  { value: "", label: "Select Campus Type" },
  { value: "Main Campus", label: "Main Campus" },
  { value: "Satellite Campus", label: "Satellite Campus" },
  { value: "Online Campus", label: "Online Campus" },
  { value: "External Location", label: "External Location" }
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
        modeOfStudy: training.modeOfStudy,
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
      modeOfStudy: formData.modeOfStudy,
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
            <div className="col-md-4">
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
            
            <div className="col-md-4">
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
            
            <div className="col-md-4">
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
