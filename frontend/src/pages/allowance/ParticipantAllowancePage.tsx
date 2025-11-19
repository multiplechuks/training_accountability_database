import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import AllowanceForm from "@/components/forms/AllowanceForm";
import type { AllowanceResponseDto, CreateAllowanceDto, ParticipantResponseDto } from "@/types";

// Sample participant data
const sampleParticipant: ParticipantResponseDto = {
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
};

// Sample allowances for this participant
const sampleParticipantAllowances: AllowanceResponseDto[] = [
  {
    pk: 1,
    amount: 5000.00,
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    comments: "Monthly stipend allowance for living expenses",
    trainingFK: 1,
    statusFK: 2,
    participantFK: 1,
    allowanceTypeFK: 1,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedBy: "admin",
    created: "2024-01-15T10:30:00Z",
    modified: "2024-01-15T10:30:00Z",
    deleted: false,
    allowanceType: {
      pk: 1,
      name: "Accommodation",
      description: "Monthly accommodation allowance"
    },
    allowanceStatus: {
      pk: 2,
      name: "Approved",
      description: "Allowance has been approved for payment"
    }
  },
  {
    pk: 2,
    amount: 2500.00,
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    comments: "Monthly meal allowance",
    trainingFK: 1,
    statusFK: 3,
    participantFK: 1,
    allowanceTypeFK: 2,
    createdAt: "2024-01-15T10:35:00Z",
    updatedAt: "2024-02-01T09:00:00Z",
    createdBy: "admin",
    updatedBy: "finance",
    created: "2024-01-15T10:35:00Z",
    modified: "2024-02-01T09:00:00Z",
    deleted: false,
    allowanceType: {
      pk: 2,
      name: "Meal Allowance",
      description: "Monthly meal allowance"
    },
    allowanceStatus: {
      pk: 3,
      name: "Paid",
      description: "Allowance has been paid to participant"
    }
  }
];

interface ParticipantAllowancePageProps {
  participantId?: number;
}

export default function ParticipantAllowancePage({ participantId = 1 }: ParticipantAllowancePageProps) {
  const [participant, setParticipant] = useState<ParticipantResponseDto | null>(null);
  const [allowances, setAllowances] = useState<AllowanceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Simulate API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setParticipant(sampleParticipant);
      setAllowances(sampleParticipantAllowances);
      setLoading(false);
    };

    fetchData();
  }, [participantId]);

  const handleCreateAllowance = (data: CreateAllowanceDto) => {
    console.log("Creating allowance for participant:", data);
    // Here you would typically send to API
    
    // Simulate adding the new allowance
    const newAllowance: AllowanceResponseDto = {
      pk: allowances.length + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current-user",
      updatedBy: "current-user",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      deleted: false,
      allowanceType: {
        pk: data.allowanceTypeFK,
        name: "Sample Type",
        description: "Sample description"
      },
      allowanceStatus: {
        pk: data.statusFK,
        name: "Sample Status", 
        description: "Sample description"
      }
    };
    
    setAllowances(prev => [newAllowance, ...prev]);
    setShowForm(false);
    alert("Allowance created successfully!");
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "badge badge-success";
      case "approved":
        return "badge badge-primary";
      case "pending":
        return "badge badge-warning";
      case "rejected":
        return "badge badge-danger";
      case "on hold":
        return "badge badge-secondary";
      default:
        return "badge badge-light";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BW", {
      style: "currency",
      currency: "BWP"
    }).format(amount);
  };

  const getTotalAmount = () => {
    return allowances.reduce((total, allowance) => total + allowance.amount, 0);
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Participant Allowances</h1>
          <p className="page-subtitle">Manage allowances for participant</p>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "16rem" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Participant Not Found</h1>
          <p className="page-subtitle">The requested participant could not be found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Participant Allowances</h1>
        <p className="page-subtitle">Manage allowances for {participant.fullName}</p>
      </div>

      {/* Participant Information Card */}
      <Card className="mb-6">
        <CardHeader 
          title="Participant Information" 
          subtitle="Basic details and contact information"
        />
        <CardBody>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar avatar-lg bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center">
                    <span className="h5 mb-0 fw-semibold">
                      {participant.firstname[0]}{participant.lastname[0]}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="h6 mb-1">
                    {participant.fullName}
                  </div>
                  <div className="text-muted small">
                    {participant.idType}: {participant.idNo}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="text-muted small fw-medium mb-1">Contact Information</div>
              <div className="small">{participant.email}</div>
              <div className="small">{participant.phone}</div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="text-muted small fw-medium mb-1">Personal Details</div>
              <div className="small">Gender: {participant.sex}</div>
              <div className="small">DOB: {formatDate(participant.dob)}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Total Allowances</p>
                  <p className="h4 mb-0">{allowances.length}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-4 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Total Amount</p>
                  <p className="h4 mb-0">{formatAmount(getTotalAmount())}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-4 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Active</p>
                  <p className="h4 mb-0">
                    {allowances.filter(a => a.allowanceStatus?.name.toLowerCase() !== "rejected").length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "+ Add New Allowance"}
        </button>
        <button className="btn btn-secondary">
          Export Allowances
        </button>
      </div>

      {/* Allowance Form */}
      {showForm && (
        <div className="mb-4">
          <AllowanceForm 
            onSubmit={handleCreateAllowance}
            onCancel={handleCancelForm}
            initialData={{
              participantFK: participant.id
            }}
          />
        </div>
      )}

      {/* Allowances List */}
      <Card>
        <CardHeader 
          title="Allowance History" 
          subtitle={`${allowances.length} allowances found`}
        />
        <CardBody>
          {allowances.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-4">
                <svg className="mx-auto" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-muted">No allowances found for this participant</p>
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-3"
              >
                Add First Allowance
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Allowance Type</th>
                    <th>Amount</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Comments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allowances.map((allowance) => (
                    <tr key={allowance.pk}>
                      <td>
                        <div>
                          <div className="fw-medium">
                            {allowance.allowanceType?.name}
                          </div>
                          <div className="text-muted small">
                            {allowance.allowanceType?.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">
                          {formatAmount(allowance.amount)}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {formatDate(allowance.startDate)} - {formatDate(allowance.endDate)}
                        </div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(allowance.allowanceStatus?.name || "")}>
                          {allowance.allowanceStatus?.name}
                        </span>
                      </td>
                      <td>
                        <div className="small text-truncate" style={{ maxWidth: "200px" }}>
                          {allowance.comments || "No comments"}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-success">
                            Process
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
