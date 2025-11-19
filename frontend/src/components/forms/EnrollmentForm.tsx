import React, { useState } from "react";
import { ParticipantEnrollmentDto } from "../../types/interfaces";
import { Stepper, Step } from "../ui";
import SearchableSelect from "../ui/SearchableSelect";
import {
  searchDepartmentsForSelect,
  searchDesignationsForSelect,
  searchFacilitiesForSelect,
  searchParticipantsForSelect,
  searchSalaryScalesForSelect,
  searchSponsorsForSelect,
  searchTrainingsForSelect
} from "../../api/searchHelpers";

interface EnrollmentFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: ParticipantEnrollmentDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EnrollmentForm({ onSubmit, onCancel, loading = false }: EnrollmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ParticipantEnrollmentDto>({
    participantFK: 0,
    trainingFK: 0,
    startDate: "",
    endDate: "",
    duration: 0,
    needingTravel: false,
    modeOfStudy: "FULL_TIME",
    registrationDate: new Date().toISOString().split("T")[0],
    trainingStatus: "PENDING",
    financialYear: new Date().getFullYear().toString(),
    campusType: "MAIN"
  });

  // Define stepper steps
  const steps: Step[] = [
    {
      id: "participant-training",
      title: "Participant & Training",
      description: "Select participant and training program"
    },
    {
      id: "employment",
      title: "Employment Information",
      description: "Work details and employment info"
    },
    {
      id: "study-details",
      title: "Study Details",
      description: "Dates, duration and travel requirements"
    },
    {
      id: "bond-sponsor",
      title: "Bond & Sponsorship",
      description: "Bond information and sponsor details",
      isOptional: true
    },
    {
      id: "finalization",
      title: "Review & Submit",
      description: "Review all information and submit"
    }
  ];

  const updateFormData = (field: keyof ParticipantEnrollmentDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.requestAnimationFrame(() => {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    });
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Participant & Training Selection
        return formData.participantFK > 0 && formData.trainingFK > 0;
      case 1: // Employment Information
        return true; // Optional fields
      case 2: // Study Details
        return formData.startDate !== "" && formData.endDate !== "" && formData.duration > 0;
      case 3: // Bond & Sponsorship
        return true; // Optional fields
      case 4: // Review & Submit
        return isStepValid(0) && isStepValid(2);
      default:
        return true;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key from submitting the form on non-final steps
    if (e.key === "Enter" && currentStep < steps.length - 1) {
      e.preventDefault();
      if (canProceed) {
        nextStep();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow submission on the final step
    if (currentStep === steps.length - 1) {
      if (isStepValid(4)) {
        onSubmit(formData);
      }
    } else {
      // For other steps, treat form submission as "Next" action
      if (canProceed) {
        nextStep();
      }
    }
  };

  const canProceed = isStepValid(currentStep);

  return (
    <div className="enrollment-form-with-stepper">
      {/* Stepper */}
      <Stepper 
        steps={steps.map((step, index) => ({
          ...step,
          isCompleted: index < currentStep || (index <= currentStep && isStepValid(index)),
          isActive: index === currentStep
        }))}
        currentStep={currentStep}
        onStepClick={goToStep}
        allowClickToNavigate={true}
      />

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        {/* Step 1: Participant & Training Selection */}
        {currentStep === 0 && (
          <div className="form-step active">
            <div className="form-step-header">
              <h2 className="form-step-title">Participant & Training Selection</h2>
              <p className="form-step-description">
                Choose the participant who will be enrolled and select the training program they will attend.
              </p>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Participant</label>
                  <SearchableSelect
                    value={formData.participantFK}
                    onChange={(value: number | undefined) => {
                      updateFormData("participantFK", value || 0);
                    }}
                    placeholder="Search and select participant..."
                    onSearch={searchParticipantsForSelect}
                    minSearchLength={2}
                  />
                  <small className="form-text text-muted">
                    Type to search by name, email, or national ID
                  </small>
                </div>
              </div>
              
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Training / Program</label>
                  <SearchableSelect
                    value={formData.trainingFK}
                    onChange={(value: number | undefined) => {
                      updateFormData("trainingFK", value || 0);
                    }}
                    placeholder="Search and select training..."
                    onSearch={searchTrainingsForSelect}
                    minSearchLength={2}
                  />
                  <small className="form-text text-muted">
                    Type to search for training programs
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Employment Information */}
        {currentStep === 1 && (
          <div className="form-step active">
            <div className="form-step-header">
              <h2 className="form-step-title">Employment Information</h2>
              <p className="form-step-description">
                Provide employment details including designation, department, and facility information.
              </p>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <SearchableSelect
                    value={formData.designationFK}
                    onChange={(value: number | undefined) => updateFormData("designationFK", value)}
                    placeholder="Select designation..."
                    onSearch={searchDesignationsForSelect}
                    minSearchLength={1}
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Salary Scale</label>
                  <SearchableSelect
                    // options={salaryScales}
                    value={formData.salaryScaleFK}
                    onChange={(value: number | undefined) => updateFormData("salaryScaleFK", value)}
                    placeholder="Select salary scale..."
                    onSearch={searchSalaryScalesForSelect}
                    minSearchLength={1}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <SearchableSelect
                    value={formData.departmentFK}
                    onChange={(value: number | undefined) => updateFormData("departmentFK", value)}
                    placeholder="Select department..."
                    onSearch={searchDepartmentsForSelect}
                    minSearchLength={1}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Facility</label>
                  <SearchableSelect
                    value={formData.facilityFK}
                    onChange={(value: number | undefined) => updateFormData("facilityFK", value)}
                    placeholder="Select facility..."
                    onSearch={searchFacilitiesForSelect}
                    minSearchLength={1}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label className="form-label">Payroll Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.payrollDate || ""}
                    onChange={(e) => updateFormData("payrollDate", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label className="form-label">Study Leave Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.studyLeaveDate || ""}
                    onChange={(e) => updateFormData("studyLeaveDate", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label className="form-label">Allowance Stoppage Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.allowanceStoppageDate || ""}
                    onChange={(e) => updateFormData("allowanceStoppageDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Study Details */}
        {currentStep === 2 && (
          <div className="form-step active">
            <div className="form-step-header">
              <h2 className="form-step-title">Study Details</h2>
              <p className="form-step-description">
                Specify training/program dates, duration, and travel requirements.
              </p>
            </div>

            <div className="row">
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label className="form-label required">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => updateFormData("startDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label className="form-label required">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => updateFormData("endDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label className="form-label required">Duration (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => updateFormData("duration", parseInt(e.target.value))}
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="travel-section">
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="needingTravel"
                  className="form-check-input"
                  checked={formData.needingTravel}
                  onChange={(e) => updateFormData("needingTravel", e.target.checked)}
                />
                <label htmlFor="needingTravel" className="form-check-label">
                  Participant requires travel arrangements
                </label>
              </div>

              {formData.needingTravel && (
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Departure Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.departureDate || ""}
                        onChange={(e) => updateFormData("departureDate", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Arrival Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.arrivalDate || ""}
                        onChange={(e) => updateFormData("arrivalDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Bond & Sponsorship */}
        {currentStep === 3 && (
          <div className="form-step active">
            <div className="form-step-header">
              <h2 className="form-step-title">Bond & Sponsorship Information</h2>
              <p className="form-step-description">
                Optional: Provide bond details and sponsorship information if applicable.
              </p>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Date Bond Signed</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dateBondSigned || ""}
                    onChange={(e) => updateFormData("dateBondSigned", e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Bond Serving Period</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.bondServingPeriod || ""}
                    onChange={(e) => updateFormData("bondServingPeriod", e.target.value)}
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label">Sponsor</label>
                  <SearchableSelect
                    value={formData.sponsorFK}
                    onChange={(value: number | undefined) => updateFormData("sponsorFK", value)}
                    placeholder="Select sponsor..."
                    onSearch={searchSponsorsForSelect}
                    minSearchLength={1}
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Mode of Study</label>
                  <select
                    className="form-control"
                    value={formData.modeOfStudy}
                    onChange={(e) => updateFormData("modeOfStudy", e.target.value)}
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="ONLINE">Online</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Finalization */}
        {currentStep === 4 && (
          <div className="form-step active">
            <div className="form-step-header">
              <h2 className="form-step-title">Review & Submit</h2>
              <p className="form-step-description">
                Review all information and complete the enrollment process.
              </p>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Registration Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.registrationDate}
                    onChange={(e) => updateFormData("registrationDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Training Status</label>
                  <select
                    className="form-control"
                    value={formData.trainingStatus}
                    onChange={(e) => updateFormData("trainingStatus", e.target.value)}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Financial Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.financialYear}
                    onChange={(e) => updateFormData("financialYear", e.target.value)}
                    required
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>
              
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label className="form-label required">Campus Type</label>
                  <select
                    className="form-control"
                    value={formData.campusType}
                    onChange={(e) => updateFormData("campusType", e.target.value)}
                    required
                  >
                    <option value="MAIN">Main Campus</option>
                    <option value="SATELLITE">Satellite Campus</option>
                    <option value="ONLINE">Online</option>
                    <option value="EXTERNAL">External</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary Review */}
            <div className="enrollment-summary mt-4 p-3 bg-light rounded">
              <h5>Enrollment Summary</h5>
              <div className="row">
              <div className="col-12 col-sm-6">
                  <p><strong>Participant ID:</strong> {formData.participantFK || "Not selected"}</p>
                  <p><strong>Training ID:</strong> {formData.trainingFK || "Not selected"}</p>
                  <p><strong>Duration:</strong> {formData.duration} days</p>
                </div>
              <div className="col-12 col-sm-6">
                  <p><strong>Start Date:</strong> {formData.startDate || "Not set"}</p>
                  <p><strong>End Date:</strong> {formData.endDate || "Not set"}</p>
                  <p><strong>Status:</strong> {formData.trainingStatus}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation */}
        <div className="step-navigation">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={currentStep === 0 ? onCancel : prevStep}
            disabled={loading}
          >
            {currentStep === 0 ? "Cancel" : "Previous"}
          </button>

          <div className="step-info">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextStep}
              disabled={!canProceed || loading}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success"
              disabled={!canProceed || loading}
            >
              {loading ? "Submitting..." : "Submit Enrollment"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
