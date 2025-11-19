import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import ParticipantForm from "@/components/forms/ParticipantForm";
import { createParticipant } from "@/api/participant";
import { NavigationRoutes } from "@/constants";
import type { CreateParticipantDto, UpdateParticipantDto } from "@/types";

export default function ParticipantCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateParticipantDto | UpdateParticipantDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const newParticipant = await createParticipant(data as CreateParticipantDto);
      
      // Navigate back to participants list or to the participant details
      navigate(NavigationRoutes.PARTICIPANTS, {
        replace: true,
        state: { 
          message: `Participant "${newParticipant.fullName}" created successfully!`,
          type: "success"
        }
      });
      
    } catch (err) {
      console.error("Error creating participant:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to create participant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(NavigationRoutes.PARTICIPANTS);
  };

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
              Create New Participant
            </li>
          </ol>
        </nav>
        
        <h1 className="page-title">Create New Participant</h1>
        <p className="page-subtitle">Add a new participant to the training management system</p>
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
          subtitle="Fill in the participant's details below. Fields marked with * are required."
        />
        <CardBody>
          <ParticipantForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            isEditing={false}
          />
        </CardBody>
      </Card>
    </div>
  );
}