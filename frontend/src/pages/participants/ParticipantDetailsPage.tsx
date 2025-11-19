import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, IconCard, ConfirmationModal } from "@/components/ui";
import { FormSection } from "@/components/forms";
import { getParticipant, deleteParticipant } from "@/api/participant";
import { NavigationRoutes } from "@/constants";
import type { ParticipantResponseDto } from "@/types";export default function ParticipantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [participant, setParticipant] = useState<ParticipantResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      if (!id) {
        setError("Invalid participant ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getParticipant(parseInt(id));
        setParticipant(data);
      } catch (err) {
        console.error("Error fetching participant:", err);
        setError("Failed to load participant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [id]);

  const handleEdit = () => {
    if (participant) {
      navigate(NavigationRoutes.PARTICIPANT_EDIT(participant.id));
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!participant) return;

    try {
      setDeleteLoading(true);
      await deleteParticipant(participant.id);
      
      // Navigate back to participants list
      navigate(NavigationRoutes.PARTICIPANTS, {
        replace: true,
        state: { 
          message: `Participant "${participant.fullName}" deleted successfully!`,
          type: "success"
        }
      });
    } catch (err) {
      console.error("Error deleting participant:", err);
      setError("Failed to delete participant. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading participant details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="page-content">
        <div className="page-header">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button 
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => navigate(NavigationRoutes.PARTICIPANTS)}
                >
                  Participants
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Participant Details
              </li>
            </ol>
          </nav>
        </div>

        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error || "Participant not found"}</p>
          <hr />
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate(NavigationRoutes.PARTICIPANTS)}
          >
            ← Back to Participants
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
                onClick={() => navigate(NavigationRoutes.PARTICIPANTS)}
              >
                Participants
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {participant.fullName}
            </li>
          </ol>
        </nav>
        
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="page-title">{participant.fullName}</h1>
            <p className="page-subtitle">Participant ID: {participant.id} | ID Number: {participant.idNo}</p>
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
        <div className="col-md-6">
          <IconCard
            title="Personal Information"
            description="View participant's personal details"
            icon={
              <div className="avatar avatar-lg">
                {getInitials(participant.firstname, participant.lastname)}
              </div>
            }
            onClick={handleEdit}
            hover={true}
          />
        </div>
        <div className="col-md-6">
          <IconCard
            title="Contact Details"
            description="Email and phone information"
            icon="📞"
            onClick={handleEdit}
            hover={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <Card>
            <CardHeader 
              title="Participant Information" 
              subtitle={`Created on ${formatDate(participant.createdAt)}`}
            />
            <CardBody>
              <FormSection title="Personal Information">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Title</label>
                      <p className="form-value">{participant.title || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Full Name</label>
                      <p className="form-value fw-bold">{participant.fullName}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">First Name</label>
                      <p className="form-value">{participant.firstname}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Middle Name</label>
                      <p className="form-value">{participant.middlename || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Last Name</label>
                      <p className="form-value">{participant.lastname}</p>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Identification & Demographics">
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">ID Type</label>
                      <p className="form-value">{participant.idType}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">ID Number</label>
                      <p className="form-value fw-bold">{participant.idNo}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Gender</label>
                      <p className="form-value">{participant.sex}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Date of Birth</label>
                      <p className="form-value">{formatDate(participant.dob)}</p>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Contact Information">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Phone Number</label>
                      <p className="form-value">
                        <a href={`tel:${participant.phone}`} className="text-decoration-none">
                          {participant.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label text-muted">Email Address</label>
                      <p className="form-value">
                        <a href={`mailto:${participant.email}`} className="text-decoration-none">
                          {participant.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </FormSection>
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
                  ✏️ Edit Information
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => navigate(NavigationRoutes.PARTICIPANT_ENROLLMENTS(participant.id))}
                >
                  📋 View Enrollments
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => navigate(NavigationRoutes.ENROLLMENT_CREATE, { 
                    state: { preselectedParticipant: participant.id }
                  })}
                >
                  ➕ Enroll in Training
                </button>
                <hr />
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  🗑️ Delete Participant
                </button>
              </div>
            </CardBody>
          </Card>

          <Card className="mt-3">
            <CardHeader title="System Information" />
            <CardBody>
              <div className="form-group mb-3">
                <label className="form-label text-muted">Created</label>
                <p className="form-value small">{formatDate(participant.createdAt)}</p>
              </div>
              <div className="form-group">
                <label className="form-label text-muted">Last Updated</label>
                <p className="form-value small">{formatDate(participant.updatedAt)}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          show={showDeleteModal}
          message={`Are you sure you want to delete the participant ${participant.fullName}?`}
          confirmText="Delete Participant"
          cancelText="Cancel"
          confirmVariant="danger"
          loading={deleteLoading}
          showWarning={true}
          warningMessage="This action cannot be undone. All associated data will be permanently removed."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}