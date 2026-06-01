import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdmission } from "@/api/admission";
import { formatTableDate } from "@/utils";
import { LoadingSpinner } from "@/components/ui";
import type { AdmissionResponseDto } from "@/types";
import { NavigationRoutes } from "@/constants";

export default function AdmissionViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState<AdmissionResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError("No ID provided."); setLoading(false); return; }
    getAdmission(parseInt(id))
      .then(setAdmission)
      .catch(() => setError("Failed to load admission."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-content">
        <LoadingSpinner centered />
      </div>
    );
  }

  if (error || !admission) {
    return (
      <div className="page-content">
        <div className="alert alert-danger">{error ?? "Admission not found."}</div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(NavigationRoutes.ADMISSIONS)}>← Back to Admissions</button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">{admission.participantName}</h1>
          <p className="page-subtitle">Admission #{admission.pk}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => navigate(`/admission/edit/${admission.pk}`)}>Edit</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate(NavigationRoutes.ADMISSIONS)}>← Back</button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header fw-semibold">Admission Details</div>
            <div className="card-body">
              <dl className="row mb-0" style={{ rowGap: "0.75rem" }}>
                <dt className="col-sm-4 text-muted">Participant</dt>
                <dd className="col-sm-8 mb-0"><strong>{admission.participantName}</strong></dd>

                <dt className="col-sm-4 text-muted">Admission Date</dt>
                <dd className="col-sm-8 mb-0">{formatTableDate(admission.admissionDate)}</dd>

                <dt className="col-sm-4 text-muted">Programme</dt>
                <dd className="col-sm-8 mb-0">{admission.admissionProgramName ?? <span className="text-muted">Not specified</span>}</dd>

                <dt className="col-sm-4 text-muted">Mode of Study</dt>
                <dd className="col-sm-8 mb-0">{admission.modeOfStudyName ?? <span className="text-muted">Not specified</span>}</dd>

                <dt className="col-sm-4 text-muted">Release Start</dt>
                <dd className="col-sm-8 mb-0">{formatTableDate(admission.releaseStartDate)}</dd>

                <dt className="col-sm-4 text-muted">Release End</dt>
                <dd className="col-sm-8 mb-0">{formatTableDate(admission.releaseEndDate)}</dd>

                {admission.notes && (
                  <>
                    <dt className="col-sm-4 text-muted">Notes</dt>
                    <dd className="col-sm-8 mb-0" style={{ whiteSpace: "pre-wrap" }}>{admission.notes}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {admission.releaseLetterOriginalName && (
            <div className="card mb-3">
              <div className="card-header fw-semibold">Release Letter</div>
              <div className="card-body">
                {admission.releaseLetterPath
                  ? <a href={admission.releaseLetterPath} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm w-100">
                      📄 {admission.releaseLetterOriginalName}
                    </a>
                  : <span className="text-muted">{admission.releaseLetterOriginalName}</span>}
              </div>
            </div>
          )}
          <div className="card">
            <div className="card-header fw-semibold">Record Info</div>
            <div className="card-body">
              <dl className="row mb-0" style={{ rowGap: "0.5rem" }}>
                <dt className="col-6 text-muted" style={{ fontSize: "0.85rem" }}>Admission ID</dt>
                <dd className="col-6 mb-0" style={{ fontSize: "0.85rem" }}>#{admission.pk}</dd>
                <dt className="col-6 text-muted" style={{ fontSize: "0.85rem" }}>Nomination Ref</dt>
                <dd className="col-6 mb-0" style={{ fontSize: "0.85rem" }}>#{admission.nominationFK}</dd>
                <dt className="col-6 text-muted" style={{ fontSize: "0.85rem" }}>Recorded</dt>
                <dd className="col-6 mb-0" style={{ fontSize: "0.85rem" }}>{formatTableDate(admission.createdAt)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
