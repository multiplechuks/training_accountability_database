import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import TrainingForm from "@/components/forms/TrainingForm";
import { getTraining, updateTraining } from "@/api/training";
import { NavigationRoutes } from "@/constants";
import type { TrainingResponseDto, CreateTrainingDto, UpdateTrainingDto } from "@/types";

export default function TrainingEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [training, setTraining] = useState<TrainingResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (data: CreateTrainingDto | UpdateTrainingDto) => {
    if (!training) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedTraining = await updateTraining(training.id, data as UpdateTrainingDto);
      
      // Navigate to training details page
      navigate(NavigationRoutes.TRAINING_DETAILS(training.id), {
        replace: true,
        state: { 
          message: `Training "${updatedTraining.program}" updated successfully!`,
          type: "success"
        }
      });
      
    } catch (err) {
      console.error("Error updating training:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to update training. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (training) {
      navigate(NavigationRoutes.TRAINING_DETAILS(training.id));
    } else {
      navigate(NavigationRoutes.TRAININGS);
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
                Edit Training
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
            <li className="breadcrumb-item">
              <button 
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate(NavigationRoutes.TRAINING_DETAILS(training.id))}
              >
                {training.program}
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Edit
            </li>
          </ol>
        </nav>
        
        <h1 className="page-title">Edit Training</h1>
        <p className="page-subtitle">Update {training.program} at {training.institution}</p>
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
          title="Training Information" 
          subtitle="Update the training details below. Fields marked with * are required."
        />
        <CardBody>
          <TrainingForm 
            training={training}
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