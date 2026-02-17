import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { enrollmentWizard } from "@/api/enrollment";
import type { EnrollmentProgressDto } from "@/types";
import { Card, CardHeader, CardBody } from "@/components/ui";

export default function EnrollmentCompletePage() {
  const { progressId } = useParams<{ progressId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<EnrollmentProgressDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progressId) {
      loadProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await enrollmentWizard.getProgress(parseInt(progressId!));
      setProgress(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load enrollment progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="wizard-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading enrollment details...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="container mt-5">
        <Card>
          <CardBody>
            <div className="text-center py-5">
              <p className="text-danger">Enrollment progress not found</p>
              <button className="btn btn-primary" onClick={() => navigate("/enrollments")}>
                Go to Enrollments
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <Card className="enrollment-wizard-card">
        <CardHeader>
          <h2 className="mb-0">Enrollment Complete</h2>
        </CardHeader>
        <CardBody>
          <div className="enrollment-complete-message">
            <div className="success-icon">
              ✓
            </div>
            <h3 className="text-success mb-3">Enrollment Successfully Completed!</h3>
            <p className="lead mb-4">
              The enrollment process has been completed for participant{" "}
              <strong>#{progress.participantId}</strong>
            </p>

            <div className="card bg-light mb-4">
              <div className="card-body">
                <h5 className="card-title">Enrollment Summary</h5>
                <div className="row text-start mt-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Progress ID:</strong> {progress.id}
                    </p>
                    <p>
                      <strong>Participant ID:</strong> {progress.participantId}
                    </p>
                    <p>
                      <strong>Current Stage:</strong>{" "}
                      <span className="badge bg-success">
                        Stage {progress.currentStep}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${progress.enrollmentStatus === "Complete" ? "bg-success" : "bg-warning"}`}>
                        {progress.enrollmentStatus}
                      </span>
                    </p>
                    <p>
                      <strong>Started:</strong>{" "}
                      {new Date(progress.lastUpdated).toLocaleDateString("en-MW")}
                    </p>
                    <p>
                      <strong>Completed:</strong>{" "}
                      {progress.completedDate
                        ? new Date(progress.completedDate).toLocaleDateString("en-MW")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {progress.notes && (
                  <div className="mt-3">
                    <strong>Notes:</strong>
                    <p className="mb-0 text-muted">{progress.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="alert alert-info">
              <strong>Next Steps:</strong>
              <ul className="mb-0 mt-2 text-start">
                <li>View the participant's full profile and enrollment details</li>
                <li>Print enrollment documents if needed</li>
                <li>Set up payment schedules for training costs</li>
                <li>Track bond compliance and service obligations</li>
              </ul>
            </div>

            <div className="d-flex gap-3 justify-content-center mt-4">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/participants/${progress.participantId}`)}
              >
                View Participant Profile
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/enrollments")}
              >
                View All Enrollments
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/participants/new")}
              >
                Enroll Another Participant
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
