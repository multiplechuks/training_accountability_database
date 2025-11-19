import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import TrainingForm from "@/components/forms/TrainingForm";
import { createTraining } from "@/api/training";
import { NavigationRoutes } from "@/constants";
import type { CreateTrainingDto, UpdateTrainingDto } from "@/types";

export default function TrainingCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateTrainingDto | UpdateTrainingDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTraining = await createTraining(data as CreateTrainingDto);
      
      // Navigate back to trainings list
      navigate(NavigationRoutes.TRAININGS, {
        replace: true,
        state: { 
          message: `Training "${newTraining.program}" at ${newTraining.institution} created successfully!`,
          type: "success"
        }
      });
      
    } catch (err) {
      console.error("Error creating training:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to create training. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(NavigationRoutes.TRAININGS);
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
                onClick={() => navigate(NavigationRoutes.TRAININGS)}
              >
                Trainings
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Create New Training
            </li>
          </ol>
        </nav>
        
        <h1 className="page-title">Create New Training</h1>
        <p className="page-subtitle">Add a new training to the system</p>
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
          subtitle="Fill in the training details below. Fields marked with * are required."
        />
        <CardBody>
          <TrainingForm 
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