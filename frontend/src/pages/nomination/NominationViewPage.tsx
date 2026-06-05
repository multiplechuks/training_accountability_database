import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNomination } from "../../api/training";
import { formatTableDate } from "@/utils";
import { LoadingSpinner } from "@/components/ui";
import type { NominationResponseDto } from "@/types";
import { NavigationRoutes } from "@/constants";

const STATUS_BADGE_CLASS: Record<string, string> = {
  Approved: "badge bg-success",
  Pending: "badge bg-warning text-dark",
  Rejected: "badge bg-danger",
  Deferred: "badge bg-secondary",
};

function statusBadge(status: string) {
  return STATUS_BADGE_CLASS[status] ?? "badge bg-light text-dark";
}

export default function NominationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nomination, setNomination] = useState<NominationResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError("No ID provided."); setLoading(false); return; }
    getNomination(parseInt(id, 10))
      .then(setNomination)
      .catch(() => setError("Failed to load nomination."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-content">
        <LoadingSpinner centered />
      </div>
    );
  }

  if (error || !nomination) {
    return (
      <div className="page-content">
        <div className="alert alert-danger">{error ?? "Nomination not found."}</div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(NavigationRoutes.NOMINATIONS)}>
          ← Back to Nominations
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title d-flex align-items-center gap-2">
            {nomination.participantName}
            <span className={statusBadge(nomination.nominationStatus)}>
              {nomination.nominationStatus}
            </span>
          </h1>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(NavigationRoutes.NOMINATION_PROGRESS(nomination.pk))}
          >
            Edit
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(NavigationRoutes.NOMINATIONS)}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Core nomination details */}
          <div className="card mb-4">
            <div className="card-header fw-semibold">Nomination Details</div>
            <div className="card-body">
              <dl className="row mb-0" style={{ rowGap: "0.75rem" }}>
                <dt className="col-sm-4 text-muted">Participant</dt>
                <dd className="col-sm-8 mb-0">
                  <strong>{nomination.participantName ?? `#${nomination.participantFK}`}</strong>
                </dd>

                <dt className="col-sm-4 text-muted">Nominated Programme</dt>
                <dd className="col-sm-8 mb-0">
                  {nomination.nominatedProgramName ?? <span className="text-muted">Not specified</span>}
                </dd>

                <dt className="col-sm-4 text-muted">Qualification</dt>
                <dd className="col-sm-8 mb-0">
                  {nomination.qualificationName ?? <span className="text-muted">Not specified</span>}
                </dd>

                <dt className="col-sm-4 text-muted">Year of Nomination</dt>
                <dd className="col-sm-8 mb-0">
                  {nomination.yearOfNomination ?? <span className="text-muted">Not specified</span>}
                </dd>

                <dt className="col-sm-4 text-muted">Sponsor Type</dt>
                <dd className="col-sm-8 mb-0">
                  {nomination.sponsorTypeName ?? <span className="text-muted">Not specified</span>}
                </dd>

                <dt className="col-sm-4 text-muted">Nomination Date</dt>
                <dd className="col-sm-8 mb-0">{formatTableDate(nomination.nominationDate)}</dd>

                {nomination.professionalBody && (
                  <>
                    <dt className="col-sm-4 text-muted">Professional Body</dt>
                    <dd className="col-sm-8 mb-0">{nomination.professionalBody}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Status & approval */}
          <div className="card mb-4">
            <div className="card-header fw-semibold">Status &amp; Approval</div>
            <div className="card-body">
              <dl className="row mb-0" style={{ rowGap: "0.75rem" }}>
                <dt className="col-sm-4 text-muted">Status</dt>
                <dd className="col-sm-8 mb-0">
                  <span className={statusBadge(nomination.nominationStatus)}>
                    {nomination.nominationStatus}
                  </span>
                </dd>

                {nomination.approvedBy && (
                  <>
                    <dt className="col-sm-4 text-muted">Approved By</dt>
                    <dd className="col-sm-8 mb-0">{nomination.approvedBy}</dd>
                  </>
                )}

                {nomination.approvalDate && (
                  <>
                    <dt className="col-sm-4 text-muted">Approval Date</dt>
                    <dd className="col-sm-8 mb-0">{formatTableDate(nomination.approvalDate)}</dd>
                  </>
                )}

                {nomination.statusReason && (
                  <>
                    <dt className="col-sm-4 text-muted">Reason</dt>
                    <dd className="col-sm-8 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {nomination.statusReason}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Budget */}
          {nomination.estimatedBudget != null && (
            <div className="card mb-4">
              <div className="card-header fw-semibold">Budget</div>
              <div className="card-body">
                <dl className="row mb-0" style={{ rowGap: "0.75rem" }}>
                  <dt className="col-sm-4 text-muted">Estimated Budget</dt>
                  <dd className="col-sm-8 mb-0">
                    {nomination.currency ? `${nomination.currency} ` : ""}
                    {nomination.estimatedBudget.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          )}

          {/* Notes */}
          {nomination.notes && (
            <div className="card">
              <div className="card-header fw-semibold">Notes</div>
              <div className="card-body">
                <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{nomination.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Record info */}
          <div className="card mb-3">
            <div className="card-header fw-semibold">Record Info</div>
            <div className="card-body">
              <dl className="row mb-0" style={{ rowGap: "0.5rem", fontSize: "0.875rem" }}>
                <dt className="col-6 text-muted">Recorded</dt>
                <dd className="col-6 mb-0">{formatTableDate(nomination.createdAt)}</dd>

                <dt className="col-6 text-muted">Admission</dt>
                <dd className="col-6 mb-0">
                  {nomination.hasAdmission
                    ? <span className="badge bg-info">Admitted</span>
                    : <span className="text-muted">None</span>}
                </dd>
              </dl>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="card-header fw-semibold">Actions</div>
            <div className="card-body d-grid gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(NavigationRoutes.NOMINATION_PROGRESS(nomination.pk))}
              >
                Edit Nomination
              </button>
              {nomination.nominationStatus === "Approved" && !nomination.hasAdmission && (
                <button
                  className="btn btn-success"
                  onClick={() => navigate(`/training/enroll/${nomination.pk}`)}
                >
                  Record Admission
                </button>
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(NavigationRoutes.NOMINATIONS)}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
