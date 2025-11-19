import React, { useState, useEffect } from "react";
import { CreateParticipantDto, UpdateParticipantDto, ParticipantResponseDto } from "@/types";
import { FormSection } from "@/components/forms";

interface ParticipantFormProps {
  participant?: ParticipantResponseDto; // For edit mode
  onSubmit: (data: CreateParticipantDto | UpdateParticipantDto) => void;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

interface FormData {
  title: string;
  firstname: string;
  lastname: string;
  middlename: string;
  idNo: string;
  sex: string;
  dob: string;
  idType: string;
  phone: string;
  email: string;
}

interface FormErrors {
  title?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  idNo?: string;
  sex?: string;
  dob?: string;
  idType?: string;
  phone?: string;
  email?: string;
}

const initialFormData: FormData = {
  title: "",
  firstname: "",
  lastname: "",
  middlename: "",
  idNo: "",
  sex: "",
  dob: "",
  idType: "Omang",
  phone: "",
  email: ""
};

const titleOptions = [
  { value: "", label: "Select Title" },
  { value: "Mr", label: "Mr" },
  { value: "Ms", label: "Ms" },
  { value: "Mrs", label: "Mrs" },
  { value: "Dr", label: "Dr" },
  { value: "Prof", label: "Prof" }
];

const genderOptions = [
  { value: "", label: "Select Gender" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

const idTypeOptions = [
  { value: "Omang", label: "Omang" },
  { value: "Passport", label: "Passport" },
  { value: "Driver's License", label: "Driver's License" },
  { value: "Other", label: "Other" }
];

export default function ParticipantForm({ 
  participant, 
  onSubmit, 
  onCancel, 
  loading = false, 
  isEditing = false 
}: ParticipantFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form data if editing
  useEffect(() => {
    if (isEditing && participant) {
      setFormData({
        title: participant.title || "",
        firstname: participant.firstname,
        lastname: participant.lastname,
        middlename: participant.middlename || "",
        idNo: participant.idNo,
        sex: participant.sex,
        dob: participant.dob ? participant.dob.split("T")[0] : "", // Extract date part
        idType: participant.idType,
        phone: participant.phone,
        email: participant.email
      });
    }
  }, [isEditing, participant]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required field validations
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }
    
    if (!formData.idNo.trim()) {
      newErrors.idNo = "ID number is required";
    }
    
    if (!formData.sex) {
      newErrors.sex = "Gender is required";
    }
    
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) {
        newErrors.dob = "Date of birth must be in the past";
      }
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (formData.phone.trim()) {
      const phoneRegex = /^[\d\s+\-()]{8,}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submissionData = {
      title: formData.title || undefined,
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      middlename: formData.middlename.trim() || undefined,
      idNo: formData.idNo.trim(),
      sex: formData.sex,
      dob: formData.dob,
      idType: formData.idType,
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase()
    };

    onSubmit(submissionData);
  };

  return (
    <div className="participant-form">
      <form onSubmit={handleSubmit}>
        <FormSection title="Personal Information">
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="title" className="form-label">Title</label>
              <select
                id="title"
                className={`form-select ${errors.title ? "is-invalid" : ""}`}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={loading}
              >
                {titleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="firstname" className="form-label">First Name <span className="text-danger">*</span></label>
              <input
                type="text"
                id="firstname"
                className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                placeholder="Enter first name"
                disabled={loading}
                maxLength={50}
              />
              {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="middlename" className="form-label">Middle Name</label>
              <input
                type="text"
                id="middlename"
                className={`form-control ${errors.middlename ? "is-invalid" : ""}`}
                value={formData.middlename}
                onChange={(e) => handleInputChange("middlename", e.target.value)}
                placeholder="Enter middle name"
                disabled={loading}
                maxLength={50}
              />
              {errors.middlename && <div className="invalid-feedback">{errors.middlename}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="lastname" className="form-label">Last Name <span className="text-danger">*</span></label>
              <input
                type="text"
                id="lastname"
                className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                value={formData.lastname}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                placeholder="Enter last name"
                disabled={loading}
                maxLength={50}
              />
              {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Identification & Demographics">
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="idType" className="form-label">ID Type <span className="text-danger">*</span></label>
              <select
                id="idType"
                className={`form-select ${errors.idType ? "is-invalid" : ""}`}
                value={formData.idType}
                onChange={(e) => handleInputChange("idType", e.target.value)}
                disabled={loading}
              >
                {idTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.idType && <div className="invalid-feedback">{errors.idType}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="idNo" className="form-label">ID Number <span className="text-danger">*</span></label>
              <input
                type="text"
                id="idNo"
                className={`form-control ${errors.idNo ? "is-invalid" : ""}`}
                value={formData.idNo}
                onChange={(e) => handleInputChange("idNo", e.target.value)}
                placeholder="Enter ID number"
                disabled={loading}
                maxLength={20}
              />
              {errors.idNo && <div className="invalid-feedback">{errors.idNo}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="sex" className="form-label">Gender <span className="text-danger">*</span></label>
              <select
                id="sex"
                className={`form-select ${errors.sex ? "is-invalid" : ""}`}
                value={formData.sex}
                onChange={(e) => handleInputChange("sex", e.target.value)}
                disabled={loading}
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.sex && <div className="invalid-feedback">{errors.sex}</div>}
            </div>
            
            <div className="col-md-3">
              <label htmlFor="dob" className="form-label">Date of Birth <span className="text-danger">*</span></label>
              <input
                type="date"
                id="dob"
                className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                disabled={loading}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
              />
              {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone Number <span className="text-danger">*</span></label>
              <input
                type="tel"
                id="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="e.g., +267 71234567"
                disabled={loading}
                maxLength={20}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email Address <span className="text-danger">*</span></label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="participant@example.com"
                disabled={loading}
                maxLength={100}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
              isEditing ? "Update Participant" : "Create Participant"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
