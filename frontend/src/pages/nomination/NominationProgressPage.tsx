import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEnrollmentProgressById, cancelEnrollment } from "../../api/nomination";
import NominationWizard from "../../components/nomination/NominationWizard";
import type { EnrollmentProgressDto } from "../../types/nomination";

type Stage6Allowance = {
  allowanceTypeName?: string;
  amount?: number;
  frequency?: string;
  startDate?: string;
  endDate?: string;
};

type Stage6TrainingCostsData = {
  allowances?: Stage6Allowance[];
};

const getErrorMessage = (err: unknown) => {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message;
  }
  return err instanceof Error ? err.message : undefined;
};

export default function NominationProgressPage() {
  const { progressId } = useParams<{ progressId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<EnrollmentProgressDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEnrollmentProgressById(id);
      setProgress(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load enrollment progress");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (progressId) {
      loadProgress(parseInt(progressId, 10));
    }
  }, [progressId, loadProgress]);

  const handleComplete = () => {
    navigate("/nomination/list");
  };

  const handleCancel = async () => {
    if (!progressId) return;

    const reason = prompt("Please provide a reason for cancelling this enrollment:");
    if (!reason) return;

    try {
      await cancelEnrollment(parseInt(progressId, 10), { reason });
      navigate("/nomination/list");
    } catch (err: unknown) {
      alert(getErrorMessage(err) || "Failed to cancel enrollment");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading enrollment progress...</p>
        </div>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error || "Enrollment progress not found"}
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/nomination/list")}>
          Back to List
        </button>
      </div>
    );
  }

  if (progress.enrollmentStatus === "Completed") {
    const renderFormData = () => {
      const sections = [];

      // Stage 2: Next of Kin Data
      if (progress.stage2_NextOfKinData) {
        try {
          const data = JSON.parse(progress.stage2_NextOfKinData);
          sections.push(
            <div key="stage2" className="mb-4">
              <h5 className="border-bottom pb-2">Stage 2: Next of Kin</h5>
              <div className="row">
                <div className="col-md-6"><strong>Name:</strong> {data.nextOfKinName}</div>
                <div className="col-md-6"><strong>Relationship:</strong> {data.nextOfKinRelationship}</div>
                <div className="col-md-6"><strong>Contact:</strong> {data.nextOfKinContactNo}</div>
              </div>
            </div>
          );
        } catch (_err) {
          void _err;
        }
      }

      // Stage 3: Nomination Data
      if (progress.stage3_NominationData) {
        try {
          const data = JSON.parse(progress.stage3_NominationData);
          sections.push(
            <div key="stage3" className="mb-4">
              <h5 className="border-bottom pb-2">Stage 3: Nomination</h5>
              <div className="row">
                {data.currentQualifications && data.currentQualifications.length > 0 && (
                  <div className="col-md-12 mb-2">
                    <strong>Current Qualifications:</strong>{" "}
                    {data.currentQualifications.map((qual: string, idx: number) => (
                      <span key={idx} className="badge bg-secondary me-2">{qual}</span>
                    ))}
                  </div>
                )}
                <div className="col-md-6"><strong>Nominated Program:</strong> {data.nominatedProgram}</div>
                <div className="col-md-6"><strong>Sponsor Type:</strong> {data.sponsorType}</div>
                <div className="col-md-6"><strong>Year of Nomination:</strong> {data.yearOfNomination}</div>
                <div className="col-md-6"><strong>Estimated Budget:</strong> {data.estimatedBudget ? `P${data.estimatedBudget.toLocaleString()}` : "N/A"}</div>
                <div className="col-md-6"><strong>Professional Body:</strong> {data.professionalBody}</div>
              </div>
            </div>
          );
        } catch (_err) {
          void _err;
        }
      }

      // Stage 4: Admission Data
      if (progress.stage4_AdmissionData) {
        try {
          const data = JSON.parse(progress.stage4_AdmissionData);
          sections.push(
            <div key="stage4" className="mb-4">
              <h5 className="border-bottom pb-2">Stage 4: Admission</h5>
              <div className="row">
                <div className="col-md-6"><strong>Date of Admission:</strong> {data.dateOfAdmission ? new Date(data.dateOfAdmission).toLocaleDateString() : "N/A"}</div>
                <div className="col-md-6"><strong>Program Name:</strong> {data.programName || "N/A"}</div>
                {data.institution && <div className="col-md-6"><strong>Institution:</strong> {data.institution}</div>}
                {data.country && <div className="col-md-6"><strong>Country:</strong> {data.country}</div>}
                {data.modeOfStudy && <div className="col-md-6"><strong>Mode of Study:</strong> {data.modeOfStudy}</div>}
                {data.releaseStartDate && <div className="col-md-6"><strong>Release Start Date:</strong> {new Date(data.releaseStartDate).toLocaleDateString()}</div>}
                {data.releaseEndDate && <div className="col-md-6"><strong>Release End Date:</strong> {new Date(data.releaseEndDate).toLocaleDateString()}</div>}
                <div className="col-md-6"><strong>Start Date:</strong> {data.startDate ? new Date(data.startDate).toLocaleDateString() : "N/A"}</div>
                <div className="col-md-6"><strong>End Date:</strong> {data.endDate ? new Date(data.endDate).toLocaleDateString() : "N/A"}</div>
                <div className="col-md-6"><strong>Length of Study (months):</strong> {data.lengthOfStudy || "N/A"}</div>
              </div>
            </div>
          );
        } catch (_err) {
          void _err;
        }
      }

      // Stage 5: Bonding Data
      if (progress.stage5_BondingData) {
        try {
          const data = JSON.parse(progress.stage5_BondingData);
          sections.push(
            <div key="stage5" className="mb-4">
              <h5 className="border-bottom pb-2">Stage 5: Bonding</h5>
              <div className="row">
                <div className="col-md-6"><strong>Bond Signed:</strong> {data.bondSigned || "N/A"}</div>
                <div className="col-md-6"><strong>Date Signed:</strong> {data.dateSigned ? new Date(data.dateSigned).toLocaleDateString() : "N/A"}</div>
                {data.bondSigned === "No" && data.reasonsNotSigned && (
                  <div className="col-md-12"><strong>Reasons Not Signed:</strong> {data.reasonsNotSigned}</div>
                )}
                <div className="col-md-6"><strong>Departure Date:</strong> {data.departureDate ? new Date(data.departureDate).toLocaleDateString() : "N/A"}</div>
                <div className="col-md-6"><strong>Travel Mode:</strong> {data.travelMode || "N/A"}</div>
              </div>
            </div>
          );
        } catch (_err) {
          void _err;
        }
      }

      // Stage 6: Training Costs Data
      if (progress.stage6_TrainingCostsData) {
        try {
          const data = JSON.parse(progress.stage6_TrainingCostsData) as Stage6TrainingCostsData;
          sections.push(
            <div key="stage6" className="mb-4">
              <h5 className="border-bottom pb-2">Stage 6: Training Costs</h5>
              {data.allowances && Array.isArray(data.allowances) ? (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Allowance Type</th>
                        <th>Amount</th>
                        <th>Frequency</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.allowances.map((allowance, index) => (
                        <tr key={index}>
                          <td>{allowance.allowanceTypeName || "N/A"}</td>
                          <td>{allowance.amount}</td>
                          <td>{allowance.frequency}</td>
                          <td>{allowance.startDate ? new Date(allowance.startDate).toLocaleDateString() : "N/A"}</td>
                          <td>{allowance.endDate ? new Date(allowance.endDate).toLocaleDateString() : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No allowance data available</p>
              )}
            </div>
          );
        } catch (_err) {
          void _err;
        }
      }

      return sections.length > 0 ? sections : <p className="text-muted">No detailed form data available</p>;
    };

    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-success">
              <i className="bi bi-check-circle me-2"></i>
              Enrollment Completed
            </h2>
            <p className="card-text">
              This enrollment was completed on {new Date(progress.completedDate!).toLocaleDateString()}.
            </p>

            <div className="mt-4">
              <h4>Form Data</h4>
              <hr />
              {renderFormData()}
            </div>

            {progress.notes && (
              <div className="mt-3">
                <h5>Additional Notes:</h5>
                <p>{progress.notes}</p>
              </div>
            )}

            <button className="btn btn-primary mt-3" onClick={() => navigate("/nomination/list")}>
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (progress.enrollmentStatus === "Cancelled") {
    return (
      <div className="container mt-4">
        <div className="card border-danger">
          <div className="card-body">
            <h2 className="card-title text-danger">
              <i className="bi bi-x-circle me-2"></i>
              Enrollment Cancelled
            </h2>
            <p className="card-text">This enrollment has been cancelled.</p>

            {progress.notes && (
              <div className="mt-3">
                <h5>Reason:</h5>
                <p>{progress.notes}</p>
              </div>
            )}

            <button className="btn btn-primary mt-3" onClick={() => navigate("/nomination/list")}>
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/nomination/list")}>
          <i className="bi bi-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      <NominationWizard
        progressId={progress.id}
        initialStep={progress.currentStep}
        initialData={progress}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
