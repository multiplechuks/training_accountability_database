import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, IconCard, ConfirmationModal } from "@/components/ui";
import { FormSection } from "@/components/forms";
import { getTraining, deleteTraining } from "@/api/training";
import { NavigationRoutes } from "@/constants";
import { formatDetailDate, formatTableDate } from "@/utils/dateFormatter";
import type { TrainingResponseDto } from "@/types";

export default function TrainingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [training, setTraining] = useState<TrainingResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      if (!id) {
        setError("Invalid training ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getTraining(parseInt(id));
        setTraining(data);
      } catch (err) {
        console.error("Error fetching training:", err);
        setError("Failed to load training details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  const handleEdit = () => {
    if (training) {
      navigate(NavigationRoutes.TRAINING_EDIT(training.id));
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!training) return;

    try {
      setDeleteLoading(true);
      await deleteTraining(training.id);

      // Navigate back to trainings list
      navigate(NavigationRoutes.TRAININGS, {
        replace: true,
        state: {
          message: `Training "${training.program}" deleted successfully!`,
          type: "success"
        }
      });
    } catch (err) {
      console.error("Error deleting training:", err);
      setError("Failed to delete training. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in progress":
        return "badge bg-success";
      case "planning":
        return "badge bg-warning";
      case "completed":
        return "badge bg-secondary";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading training details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="page-content">
        <div className="page-header">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => navigate(NavigationRoutes.TRAININGS)}
                >
                  Trainings
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Training Details
              </li>
            </ol>
          </nav>
        </div>

        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error || "Training not found"}</p>
          <hr />
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(NavigationRoutes.TRAININGS)}
          >
            ← Back to Trainings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate(NavigationRoutes.TRAININGS)}
              >
                Training Programs
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {training.program}
            </li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="page-title">{training.program}</h1>
            <p className="page-subtitle">
              {training.institution} • {training.countryOfStudy} •
              <span className={getStatusBadgeClass(training.trainingStatus)}>
                {training.trainingStatus}
              </span>
            </p>
          </div>

          <div className="page-actions">
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <IconCard
            title="Program Information"
            description="View training details"
            icon="📚"
            onClick={handleEdit}
            hover={true}
          />
        </div>
        <div className="col-md-4">
          <IconCard
            title="Participants"
            description="Manage enrolled participants"
            icon="👥"
            onClick={() => navigate(NavigationRoutes.TRAINING_DETAILS(training.id) + "/participants")}
            hover={true}
          />
        </div>
        <div className="col-md-4">
          <IconCard
            title="Duration & Dates"
            description="Training schedule and timeline"
            icon="📅"
            onClick={handleEdit}
            hover={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <Card>
            <CardHeader
              title="Training Information"
              subtitle={`Created on ${formatTableDate(training.createdAt)}`}
            />
            <CardBody>
              <FormSection title="Program Details">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Institution</label>
                      <p className="form-value fw-bold">{training.institution}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Program Name</label>
                      <p className="form-value fw-bold">{training.program}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Country of Study</label>
                      <p className="form-value">{training.countryOfStudy}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Mode of Study</label>
                      <p className="form-value">{training.modeOfStudy}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Campus Type</label>
                      <p className="form-value">{training.campusType || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Duration & Timeline">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Start Date</label>
                      <p className="form-value">{formatDetailDate(training.startDate)}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">End Date</label>
                      <p className="form-value">{formatDetailDate(training.endDate)}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Duration</label>
                      <p className="form-value">{training.duration} months</p>
                    </div>
                  </div>
                </div>

                {(training.departureDate || training.arrivalDate || training.resumptionDate) && (
                  <div className="row">
                    {training.departureDate && (
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Departure Date</label>
                          <p className="form-value">{formatDetailDate(training.departureDate)}</p>
                        </div>
                      </div>
                    )}
                    {training.arrivalDate && (
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Arrival Date</label>
                          <p className="form-value">{formatDetailDate(training.arrivalDate)}</p>
                        </div>
                      </div>
                    )}
                    {training.resumptionDate && (
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Resumption Date</label>
                          <p className="form-value">{formatDetailDate(training.resumptionDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </FormSection>

              {(training.vacationEmploymentPeriod || training.extensionPeriod || training.bondServingPeriod) && (
                <FormSection title="Administrative Details">
                  <div className="row">
                    {training.vacationEmploymentPeriod && (
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Vacation Employment Period</label>
                          <p className="form-value">{training.vacationEmploymentPeriod}</p>
                        </div>
                      </div>
                    )}
                    {training.extensionPeriod && (
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Extension Period</label>
                          <p className="form-value">{training.extensionPeriod}</p>
                        </div>
                      </div>
                    )}
                    {training.bondServingPeriod && (
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Bond Serving Period</label>
                          <p className="form-value">{training.bondServingPeriod}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {training.dateBondSigned && (
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label text-muted">Date Bond Signed</label>
                          <p className="form-value">{formatDetailDate(training.dateBondSigned)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </FormSection>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card>
            <CardHeader title="Quick Actions" />
            <CardBody>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleEdit}
                >
                  ✏️ Edit Training Details
                </button>
                <button
                  className="btn btn-outline-info"
                  onClick={() => navigate(NavigationRoutes.TRAINING_DETAILS(training.id) + "/participants")}
                >
                  👥 View Participants
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => navigate(NavigationRoutes.ENROLLMENT_CREATE, {
                    state: { preselectedTraining: training.id }
                  })}
                >
                  ➕ Enroll Participants
                </button>
                <hr />
                <button
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  🗑️ Delete Training
                </button>
              </div>
            </CardBody>
          </Card>

          <Card className="mt-3">
            <CardHeader title="Program Status" />
            <CardBody>
              <div className="form-group mb-3">
                <label className="form-label text-muted">Current Status</label>
                <p>
                  <span className={getStatusBadgeClass(training.trainingStatus)}>
                    {training.trainingStatus}
                  </span>
                </p>
              </div>
              <div className="form-group mb-3">
                <label className="form-label text-muted">Financial Year</label>
                <p className="form-value">{training.financialYear}</p>
              </div>
              {training.sponsorFK && (
                <div className="form-group">
                  <label className="form-label text-muted">Sponsor</label>
                  <p className="form-value">Sponsor ID: {training.sponsorFK}</p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="mt-3">
            <CardHeader title="System Information" />
            <CardBody>
              <div className="form-group mb-3">
                <label className="form-label text-muted">Created</label>
                <p className="form-value small">{formatDetailDate(training.createdAt)}</p>
              </div>
              <div className="form-group">
                <label className="form-label text-muted">Last Updated</label>
                <p className="form-value small">{formatDetailDate(training.updatedAt)}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          show={showDeleteModal}
          message={`Are you sure you want to delete the training ${training.program} at ${training.institution}?`}
          confirmText="Delete Training"
          cancelText="Cancel"
          confirmVariant="danger"
          loading={deleteLoading}
          showWarning={true}
          warningMessage="This action cannot be undone. All associated enrollments and data will be permanently removed."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}