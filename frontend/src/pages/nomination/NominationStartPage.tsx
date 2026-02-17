import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startEnrollment } from "../../api/nomination";

export default function NominationStartPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown) => {
    if (err && typeof err === "object" && "response" in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      return response?.data?.message;
    }
    return err instanceof Error ? err.message : undefined;
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await startEnrollment();
      navigate(`/nomination/progress/${response.progressId}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to start enrollment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Start New Nomination</h2>
              
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <div className="alert alert-info">
                <h5>Nomination Process Overview</h5>
                <p>The nomination process consists of 7 stages:</p>
                <ol>
                  <li><strong>Participant Profile</strong> - Select an existing participant or create a new one</li>
                  <li><strong>Next of Kin</strong> - Emergency contact information</li>
                  <li><strong>Nomination</strong> - Current qualifications, nominated program, sponsor type, and professional body</li>
                  <li><strong>Admission</strong> - Admission date, program details, start/end dates, and length of study</li>
                  <li><strong>Bonding</strong> - Bond agreement, signing details, and travel mode</li>
                  <li><strong>Training Costs</strong> - Travel costs, pre-departure allowances, and payment frequency</li>
                  <li><strong>Completion</strong> - Review all information and finalize the nomination</li>
                </ol>
                <p className="mb-0">You can save your progress at any stage and return later to complete the process.</p>
              </div>

              <div className="mb-4">
                <h5>Start New Nomination</h5>
                <p className="text-muted">Begin the nomination process. You can select an existing participant or create a new one in Stage 1.</p>
                
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleStart}
                  disabled={loading}
                >
                  {loading ? "Starting..." : "Start Nomination Process"}
                </button>
              </div>

              <div className="mt-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/nomination/list")}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
