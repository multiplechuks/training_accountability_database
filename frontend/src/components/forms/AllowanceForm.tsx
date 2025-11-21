import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import type { CreateAllowanceDto, AllowanceType, AllowanceStatus, ParticipantResponseDto, TrainingResponseDto } from "@/types";

interface AllowanceFormProps {
  onSubmit: (data: CreateAllowanceDto) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<CreateAllowanceDto>;
}

// Sample data for dropdowns
const sampleAllowanceTypes: AllowanceType[] = [
  { pk: 1, name: "Tuition Fee", description: "Training program tuition fees" },
  { pk: 2, name: "Accommodation", description: "Monthly accommodation allowance" },
  { pk: 3, name: "Meal Allowance", description: "Monthly meal allowance" },
  { pk: 4, name: "Transport", description: "Monthly transport allowance" },
  { pk: 5, name: "Study Materials", description: "Books and study materials" },
  { pk: 6, name: "Medical Insurance", description: "Health insurance coverage" },
  { pk: 7, name: "Travel Allowance", description: "Travel expenses and flights" }
];

const sampleAllowanceStatuses: AllowanceStatus[] = [
  { pk: 1, name: "Pending", description: "Allowance is pending approval" },
  { pk: 2, name: "Approved", description: "Allowance has been approved for payment" },
  { pk: 3, name: "Paid", description: "Allowance has been paid to participant" },
  { pk: 4, name: "Rejected", description: "Allowance request has been rejected" },
  { pk: 5, name: "On Hold", description: "Allowance processing is on hold" }
];

const sampleParticipants: ParticipantResponseDto[] = [
  {
    id: 1,
    title: "Mr",
    firstname: "John",
    lastname: "Doe",
    middlename: "Smith",
    idNo: "123456789",
    sex: "Male",
    dob: "1990-05-15",
    idType: "National ID",
    phone: "+267 71234567",
    email: "john.doe@email.com",
    fullName: "John Smith Doe",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Ms",
    firstname: "Jane",
    lastname: "Smith",
    middlename: "Marie",
    idNo: "987654321",
    sex: "Female",
    dob: "1985-08-22",
    idType: "National ID",
    phone: "+267 72345678",
    email: "jane.smith@email.com",
    fullName: "Jane Marie Smith",
    createdAt: "2024-02-25T14:20:00Z",
    updatedAt: "2024-02-25T14:20:00Z"
  },
  {
    id: 3,
    title: "Mr",
    firstname: "Michael",
    lastname: "Johnson",
    middlename: "Robert",
    idNo: "456789123",
    sex: "Male",
    dob: "1988-12-03",
    idType: "National ID",
    phone: "+267 73456789",
    email: "michael.johnson@email.com",
    fullName: "Michael Robert Johnson",
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2024-12-31T18:00:00Z"
  }
];

const sampleTrainings: TrainingResponseDto[] = [
  {
    id: 1,
    institution: "University of Botswana",
    program: "Master of Science in Computer Science",
    countryOfStudy: "Botswana",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    duration: 24,
    departureDate: "2024-01-28",
    arrivalDate: "2024-02-03",
    vacationEmploymentPeriod: "",
    resumptionDate: "",
    extensionPeriod: "",
    dateBondSigned: "",
    bondServingPeriod: "",
    sponsorFK: 1,
    modeOfStudy: "Full-time",
    registrationDate: "2024-01-15",
    trainingStatus: "Active",
    financialYear: "2024",
    campusType: "Main Campus",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    institution: "Botswana Institute of Technology",
    program: "Certificate in Project Management",
    countryOfStudy: "Botswana",
    startDate: "2024-03-15",
    endDate: "2024-11-30",
    duration: 8,
    departureDate: "",
    arrivalDate: "",
    vacationEmploymentPeriod: "",
    resumptionDate: "",
    extensionPeriod: "",
    dateBondSigned: "",
    bondServingPeriod: "",
    sponsorFK: 2,
    modeOfStudy: "Part-time",
    registrationDate: "2024-02-25",
    trainingStatus: "Active",
    financialYear: "2024",
    campusType: "Satellite Campus",
    createdAt: "2024-02-25T14:20:00Z",
    updatedAt: "2024-02-25T14:20:00Z"
  }
];

export default function AllowanceForm({ onSubmit, onCancel, loading = false, initialData }: AllowanceFormProps) {
  const [formData, setFormData] = useState<CreateAllowanceDto>({
    amount: initialData?.amount || 0,
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    comments: initialData?.comments || "",
    trainingFK: initialData?.trainingFK || 0,
    statusFK: initialData?.statusFK || 1, // Default to Pending
    participantFK: initialData?.participantFK || 0,
    allowanceTypeFK: initialData?.allowanceTypeFK || 0
  });

  const [errors, setErrors] = useState<Partial<CreateAllowanceDto>>({});
  const [allowanceTypes] = useState<AllowanceType[]>(sampleAllowanceTypes);
  const [allowanceStatuses] = useState<AllowanceStatus[]>(sampleAllowanceStatuses);
  const [participants] = useState<ParticipantResponseDto[]>(sampleParticipants);
  const [trainings] = useState<TrainingResponseDto[]>(sampleTrainings);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingResponseDto[]>(sampleTrainings);

  // Filter trainings based on selected participant
  useEffect(() => {
    if (formData.participantFK > 0) {
      // In a real app, you would fetch trainings for the selected participant
      // For now, we'll show all trainings
      setFilteredTrainings(trainings);
    } else {
      setFilteredTrainings([]);
    }
  }, [formData.participantFK, trainings]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateAllowanceDto> = {};

    if (!formData.participantFK) {
      newErrors.participantFK = 0; // Error marker
    }
    if (!formData.trainingFK) {
      newErrors.trainingFK = 0; // Error marker
    }
    if (!formData.allowanceTypeFK) {
      newErrors.allowanceTypeFK = 0; // Error marker
    }
    if (!formData.statusFK) {
      newErrors.statusFK = 0; // Error marker
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 0; // Error marker
    }
    if (!formData.startDate) {
      newErrors.startDate = ""; // Error marker
    }
    if (!formData.endDate) {
      newErrors.endDate = ""; // Error marker
    }

    // Validate that end date is after start date
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = ""; // Error marker
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateAllowanceDto, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field] !== undefined) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Card>
      <CardHeader 
        title="New Training Allowance" 
        subtitle="Complete the form below to create a new allowance"
      />
      <CardBody>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Participant and Training Selection */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label htmlFor="participant" className="form-label">
                Participant *
              </label>
              <select
                id="participant"
                value={formData.participantFK}
                onChange={(e) => handleInputChange("participantFK", parseInt(e.target.value))}
                className={`form-select ${
                  errors.participantFK !== undefined ? "is-invalid" : ""
                }`}
                required
              >
                <option value={0}>Select Participant</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.fullName} ({participant.idNo})
                  </option>
                ))}
              </select>
              {errors.participantFK !== undefined && (
                <div className="invalid-feedback">Please select a participant</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="training" className="form-label">
                Training Program *
              </label>
              <select
                id="training"
                value={formData.trainingFK}
                onChange={(e) => handleInputChange("trainingFK", parseInt(e.target.value))}
                className={`form-select ${
                  errors.trainingFK !== undefined ? "is-invalid" : ""
                }`}
                required
                disabled={!formData.participantFK}
              >
                <option value={0}>Select Training Program</option>
                {filteredTrainings.map((training) => (
                  <option key={training.id} value={training.id}>
                    {training.program} - {training.institution}
                  </option>
                ))}
              </select>
              {errors.trainingFK !== undefined && (
                <div className="invalid-feedback">Please select a training program</div>
              )}
            </div>
          </div>

          {/* Section 2: Allowance Details */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label htmlFor="allowanceType" className="form-label">
                Allowance Type *
              </label>
              <select
                id="allowanceType"
                value={formData.allowanceTypeFK}
                onChange={(e) => handleInputChange("allowanceTypeFK", parseInt(e.target.value))}
                className={`form-select ${
                  errors.allowanceTypeFK !== undefined ? "is-invalid" : ""
                }`}
                required
              >
                <option value={0}>Select Allowance Type</option>
                {allowanceTypes.map((type) => (
                  <option key={type.pk} value={type.pk}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.allowanceTypeFK !== undefined && (
                <div className="invalid-feedback">Please select an allowance type</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="status" className="form-label">
                Status *
              </label>
              <select
                id="status"
                value={formData.statusFK}
                onChange={(e) => handleInputChange("statusFK", parseInt(e.target.value))}
                className={`form-select ${
                  errors.statusFK !== undefined ? "is-invalid" : ""
                }`}
                required
              >
                <option value={0}>Select Status</option>
                {allowanceStatuses.map((status) => (
                  <option key={status.pk} value={status.pk}>
                    {status.name}
                  </option>
                ))}
              </select>
              {errors.statusFK !== undefined && (
                <div className="invalid-feedback">Please select a status</div>
              )}
            </div>
          </div>

          {/* Section 3: Amount and Period */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <label htmlFor="amount" className="form-label">
                Amount (BWP) *
              </label>
              <input
                type="number"
                id="amount"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                className={`form-control ${
                  errors.amount !== undefined ? "is-invalid" : ""
                }`}
                placeholder="0.00"
                required
              />
              {errors.amount !== undefined && (
                <div className="invalid-feedback">Please enter a valid amount</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`form-control ${
                  errors.startDate !== undefined ? "is-invalid" : ""
                }`}
                required
              />
              {errors.startDate !== undefined && (
                <div className="invalid-feedback">Please select a start date</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="endDate" className="form-label">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={`form-control ${
                  errors.endDate !== undefined ? "is-invalid" : ""
                }`}
                required
              />
              {errors.endDate !== undefined && (
                <div className="invalid-feedback">Please select a valid end date</div>
              )}
            </div>
          </div>

          {/* Section 4: Comments */}
          <div className="mb-4">
            <label htmlFor="comments" className="form-label">
              Comments
            </label>
            <textarea
              id="comments"
              rows={3}
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              className="form-control"
              placeholder="Additional notes or comments about this allowance..."
            />
          </div>

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline-secondary"
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
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Creating...
                </div>
              ) : (
                "Create Allowance"
              )}
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

