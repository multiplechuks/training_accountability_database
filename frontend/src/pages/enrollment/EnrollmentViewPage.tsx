import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { getEnrollment } from "@/api/enrollment";
import { NavigationRoutes } from "@/constants";
import type { ParticipantEnrollmentResponseDto } from "@/types";

export default function EnrollmentViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<ParticipantEnrollmentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!id) {
        setError("No enrollment ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getEnrollment(parseInt(id));
        setEnrollment(data);
      } catch (err: unknown) {
        const errorMsg = 
          (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) 
            ? String(err.response.data.message)
            : (err instanceof Error) 
              ? err.message 
              : "Failed to load enrollment details. Please try again.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "badge bg-success";
      case "completed":
        return "badge bg-secondary";
      case "pending":
        return "badge bg-warning";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const handleEdit = () => {
    if (enrollment && enrollment.pk) {
      navigate(NavigationRoutes.ENROLLMENT_EDIT(enrollment.pk));
    }
  };

  const handleManageAllowances = () => {
    if (enrollment && enrollment.participant && enrollment.training) {
      // Navigate to allowance create page with participant and training pre-selected
      navigate(`/allowances/create?participantId=${enrollment.participant.pk}&trainingId=${enrollment.training.pk}`);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Enrollment Details</h1>
          <p className="page-subtitle">View enrollment information</p>
        </div>
        <div className="d-flex justify-content-center align-items-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading enrollment details...</span>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Enrollment Details</h1>
          <p className="page-subtitle">View enrollment information</p>
        </div>
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error || "Enrollment not found"}
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(NavigationRoutes.ENROLLMENTS)}
        >
          ← Back to Enrollments
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="page-title">Enrollment Details</h1>
            <p className="page-subtitle">View and manage enrollment information</p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success" 
              onClick={handleManageAllowances}
              title="Manage Allowances"
            >
              💰 Manage Allowances
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleEdit}
            >
              ✏️ Edit Enrollment
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate(NavigationRoutes.ENROLLMENTS)}
            >
              ← Back to List
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Participant Information */}
        <div className="col-md-6 mb-4">
          <Card>
            <CardHeader 
              title="Participant Information" 
              subtitle="Details about the enrolled participant"
            />
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <div className="avatar me-3" style={{ fontSize: "1.5rem", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#007bff", color: "white", borderRadius: "50%" }}>
                  {enrollment.participant?.firstname?.[0]}{enrollment.participant?.lastname?.[0]}
                </div>
                <div>
                  <h5 className="mb-1">{enrollment.participant?.fullName}</h5>
                  <p className="text-muted mb-0">{enrollment.participant?.email}</p>
                </div>
              </div>
              
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">ID Number</label>
                  <div className="fw-bold">{enrollment.participant?.idNo}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Phone</label>
                  <div className="fw-bold">{enrollment.participant?.phone}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">ID Type</label>
                  <div className="fw-bold">National ID</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Title</label>
                  <div className="fw-bold">{enrollment.participant?.title}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Training Information */}
        <div className="col-md-6 mb-4">
          <Card>
            <CardHeader 
              title="Training Program" 
              subtitle="Details about the training program"
            />
            <CardBody>
              <div className="mb-3">
                <label className="form-label text-muted">Program</label>
                <div className="fw-bold fs-5">{enrollment.training?.program}</div>
              </div>
              
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <label className="form-label text-muted">Institution</label>
                  <div className="fw-bold">{enrollment.training?.institution}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Country</label>
                  <div className="fw-bold">{enrollment.training?.countryOfStudy}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Duration</label>
                  <div className="fw-bold">{enrollment.duration} months</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Mode of Study</label>
                  <div className="fw-bold">{enrollment.modeOfStudy}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Campus Type</label>
                  <div className="fw-bold">{enrollment.campusType}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="row">
        {/* Enrollment Details */}
        <div className="col-md-6 mb-4">
          <Card>
            <CardHeader 
              title="Enrollment Details" 
              subtitle="Specific enrollment information"
            />
            <CardBody>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Status</label>
                  <div>
                    <span className={getStatusBadgeClass(enrollment.trainingStatus)}>
                      {enrollment.trainingStatus}
                    </span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Registration Date</label>
                  <div className="fw-bold">{enrollment.registrationDate && formatDate(enrollment.registrationDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Start Date</label>
                  <div className="fw-bold">{formatDate(enrollment.startDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">End Date</label>
                  <div className="fw-bold">{formatDate(enrollment.endDate)}</div>
                </div>
                {enrollment.studyLeaveDate && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Study Leave Date</label>
                    <div className="fw-bold">{formatDate(enrollment.studyLeaveDate)}</div>
                  </div>
                )}
                <div className="col-sm-6 mb-3">
                  <label className="form-label text-muted">Financial Year</label>
                  <div className="fw-bold">{enrollment.financialYear}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="col-md-6 mb-4">
          <Card>
            <CardHeader 
              title="Additional Information" 
              subtitle="Extra details and dates"
            />
            <CardBody>
              <div className="row">
                {enrollment.departureDate && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Departure Date</label>
                    <div className="fw-bold">{formatDate(enrollment.departureDate)}</div>
                  </div>
                )}
                {enrollment.arrivalDate && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Arrival Date</label>
                    <div className="fw-bold">{formatDate(enrollment.arrivalDate)}</div>
                  </div>
                )}
                {enrollment.dateBondSigned && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Bond Signing Date</label>
                    <div className="fw-bold">{formatDate(enrollment.dateBondSigned)}</div>
                  </div>
                )}
                {enrollment.bondServingPeriod && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Bond Serving Period</label>
                    <div className="fw-bold">{enrollment.bondServingPeriod}</div>
                  </div>
                )}
                {enrollment.department && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Department</label>
                    <div className="fw-bold">{enrollment.department.name}</div>
                  </div>
                )}
                {enrollment.facility && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Facility</label>
                    <div className="fw-bold">{enrollment.facility.name}</div>
                  </div>
                )}
                {enrollment.designation && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Designation</label>
                    <div className="fw-bold">{enrollment.designation.name}</div>
                  </div>
                )}
                {enrollment.sponsor && (
                  <div className="col-sm-6 mb-3">
                    <label className="form-label text-muted">Sponsor</label>
                    <div className="fw-bold">{enrollment.sponsor.name}</div>
                  </div>
                )}
              </div>
              
              {(!enrollment.departureDate && !enrollment.arrivalDate && 
                !enrollment.dateBondSigned && !enrollment.bondServingPeriod &&
                !enrollment.department && !enrollment.facility &&
                !enrollment.designation && !enrollment.sponsor) && (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-info-circle fs-1 d-block mb-2"></i>
                  No additional information available
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Audit Information */}
      <Card>
        <CardHeader 
          title="Audit Information" 
          subtitle="Creation and modification details"
        />
        <CardBody>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label text-muted">Created At</label>
              <div className="fw-bold">{enrollment.CreatedAt && formatDate(enrollment.CreatedAt)}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted">Last Updated</label>
              <div className="fw-bold">{enrollment.UpdatedAt && formatDate(enrollment.UpdatedAt)}</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
