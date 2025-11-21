import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import ParticipantForm from "@/components/forms/ParticipantForm";
import { getParticipant, updateParticipant } from "@/api/participant";
import { NavigationRoutes } from "@/constants";
import type { ParticipantResponseDto, CreateParticipantDto, UpdateParticipantDto } from "@/types";

export default function ParticipantEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [participant, setParticipant] = useState<ParticipantResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      } catch {
        setError("Failed to load participant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [id]);

  const handleSubmit = async (data: CreateParticipantDto | UpdateParticipantDto) => {
    if (!participant) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedParticipant = await updateParticipant(participant.id, data as UpdateParticipantDto);
      
      // Navigate to participant details page
      navigate(NavigationRoutes.PARTICIPANT_DETAILS(participant.id), {
        replace: true,
        state: { 
          message: `Participant "${updatedParticipant.fullName}" updated successfully!`,
          type: "success"
        }
      });
      
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to update participant. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (participant) {
      navigate(NavigationRoutes.PARTICIPANT_DETAILS(participant.id));
    } else {
      navigate(NavigationRoutes.PARTICIPANTS);
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
                Edit Participant
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
            <li className="breadcrumb-item">
              <button 
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate(NavigationRoutes.PARTICIPANT_DETAILS(participant.id))}
              >
                {participant.fullName}
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Edit
            </li>
          </ol>
        </nav>
        
        <h1 className="page-title">Edit Participant</h1>
        <p className="page-subtitle">Update {participant.fullName}'s information</p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <Card>
        <CardHeader 
          title="Participant Information" 
          subtitle="Update the participant's details below. Fields marked with * are required."
        />
        <CardBody>
          <ParticipantForm 
            participant={participant}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={saving}
            isEditing={true}
          />
        </CardBody>
      </Card>
    </div>
  );
}
