import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getParticipants, getParticipant } from "@/api/participant";
import { getNominationsByParticipant } from "@/api/training";
import { getAdmissionByNomination } from "@/api/admission";
import { getAllowancesByParticipant } from "@/api/allowance";
import { formatTableDate } from "@/utils";
import type {
  ParticipantResponseDto,
  AllowanceResponseDto,
  NominationWithAdmission,
} from "@/types";
import { NavigationRoutes } from "@/constants";
import { LoadingSpinner } from "@/components/ui";

const SESSION_KEY = "participantHistoryPK";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

const STATUS_BADGE: Record<string, string> = {
  Approved: "bg-success",
  Pending: "bg-warning text-dark",
  Rejected: "bg-danger",
  Deferred: "bg-secondary",
};

export default function ParticipantHistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ParticipantResponseDto[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [participant, setParticipant] = useState<ParticipantResponseDto | null>(null);
  const [nominationsWithAdmissions, setNominationsWithAdmissions] = useState<NominationWithAdmission[]>([]);
  const [allowances, setAllowances] = useState<AllowanceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const { pk, savedAt } = JSON.parse(raw);
      if (Date.now() - savedAt > SESSION_TTL_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
      getParticipant(pk).then(loadParticipantHistory).catch(() => sessionStorage.removeItem(SESSION_KEY));
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const res = await getParticipants(1, 10, searchTerm.trim());
      setSearchResults(res.data ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [searchTerm]);

  const loadParticipantHistory = async (p: ParticipantResponseDto) => {
    setParticipant(p);
    setSearchResults([]);
    setSearchTerm("");
    setHasSearched(false);
    setError(null);
    setLoading(true);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ pk: p.pk, savedAt: Date.now() }));
    try {
      const [nominations, allowanceList] = await Promise.all([
        getNominationsByParticipant(p.pk),
        getAllowancesByParticipant(p.pk),
      ]);

      const withAdmissions: NominationWithAdmission[] = await Promise.all(
        nominations.map(async (nom) => {
          if (!nom.hasAdmission) return { nomination: nom, admission: null };
          try {
            const adm = await getAdmissionByNomination(nom.pk);
            return { nomination: nom, admission: adm };
          } catch {
            return { nomination: nom, admission: null };
          }
        })
      );

      // Sort newest nomination first
      withAdmissions.sort((a, b) =>
        (b.nomination.yearOfNomination ?? 0) - (a.nomination.yearOfNomination ?? 0)
      );

      setNominationsWithAdmissions(withAdmissions);
      setAllowances(Array.isArray(allowanceList) ? allowanceList : []);
    } catch {
      setError("Failed to load participant history.");
    } finally {
      setLoading(false);
    }
  };

  const totalAllowanceAmount = allowances.reduce((sum, a) => sum + (a.amount ?? 0), 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Participant History</h1>
          <p className="page-subtitle">Search for a participant to view their full training record</p>
        </div>
      </div>

      {/* Search box */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex gap-2">
            <input
              type="search"
              className="form-control"
              placeholder="Search by name, ID number, or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setHasSearched(false); setSearchResults([]); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" style={{ whiteSpace: "nowrap" }} onClick={handleSearch} disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <ul className="list-group mt-2 shadow-sm">
              {searchResults.map((p) => (
                <li
                  key={p.pk}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => loadParticipantHistory(p)}
                >
                  <div>
                    <strong>{p.firstname} {p.lastname}</strong>
                    {p.idNumber && <span className="text-muted ms-2 small">{p.idNumber}</span>}
                  </div>
                  <div className="text-muted small">{p.department ?? p.dutyStation ?? ""}</div>
                </li>
              ))}
            </ul>
          )}

          {hasSearched && !searching && searchResults.length === 0 && (
            <p className="text-muted mt-2 mb-0 small">No results. Try a different name or ID.</p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <LoadingSpinner centered message="Loading training history..." />
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Participant profile + history */}
      {participant && !loading && (
        <>
          {/* Participant profile card */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex align-items-start gap-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 56, height: 56, fontSize: "1.25rem", fontWeight: 700 }}
                >
                  {participant.firstname?.[0]}{participant.lastname?.[0]}
                </div>
                <div className="flex-grow-1">
                  <h4 className="mb-1">
                    {participant.title ? `${participant.title} ` : ""}
                    {participant.firstname} {participant.middlename ? `${participant.middlename} ` : ""}{participant.lastname}
                  </h4>
                  <div className="d-flex flex-wrap gap-3 text-muted small mt-1">
                    {participant.idNumber && <span>ID: {participant.idNumber}</span>}
                    {participant.email && <span>{participant.email}</span>}
                    {participant.phone && <span>{participant.phone}</span>}
                    {participant.department && <span>{participant.department}</span>}
                    {participant.dutyStation && <span>{participant.dutyStation}</span>}
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 flex-shrink-0">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`${NavigationRoutes.ALLOWANCE_CREATE}?participantId=${participant.pk}`)}
                  >
                    + Add Allowance
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate(NavigationRoutes.PARTICIPANT_DETAILS(participant.pk))}
                  >
                    View Profile
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => { setParticipant(null); setNominationsWithAdmissions([]); setAllowances([]); sessionStorage.removeItem(SESSION_KEY); }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card text-center">
                <div className="card-body py-3">
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e40af" }}>
                    {nominationsWithAdmissions.length}
                  </div>
                  <div className="text-muted small">Nominations</div>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card text-center">
                <div className="card-body py-3">
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#059669" }}>
                    {nominationsWithAdmissions.filter((n) => n.admission).length}
                  </div>
                  <div className="text-muted small">Admissions</div>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card text-center">
                <div className="card-body py-3">
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#7c3aed" }}>
                    {allowances.length}
                  </div>
                  <div className="text-muted small">
                    Allowances
                    {totalAllowanceAmount > 0 && (
                      <span className="d-block" style={{ fontSize: "0.75rem" }}>
                        MWK {totalAllowanceAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Training timeline */}
          {nominationsWithAdmissions.length === 0 ? (
            <div className="card">
              <div className="card-body text-center text-muted py-5">
                No nominations found for this participant.
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h5 className="mb-3 fw-semibold">Training History</h5>
              <div className="d-flex flex-column gap-3">
                {nominationsWithAdmissions.map(({ nomination, admission }) => {
                  const admissionAllowances = allowances.filter(
                    (a) => admission && (a.admissionFK === admission.pk || a.trainingFK === admission.pk)
                  );
                  return (
                    <div key={nomination.pk} className="card">
                      <div className="card-body">
                        {/* Nomination header */}
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <strong>
                                {nomination.nominatedProgramName ?? `Nomination #${nomination.pk}`}
                              </strong>
                              <span className={`badge ${STATUS_BADGE[nomination.nominationStatus] ?? "bg-secondary"}`}>
                                {nomination.nominationStatus}
                              </span>
                              {nomination.yearOfNomination && (
                                <span className="badge bg-light text-dark border">{nomination.yearOfNomination}</span>
                              )}
                            </div>
                            <div className="text-muted small mt-1 d-flex flex-wrap gap-3">
                              {nomination.qualificationName && <span>Qualification: {nomination.qualificationName}</span>}
                              {nomination.sponsorTypeName && <span>Sponsor: {nomination.sponsorTypeName}</span>}
                              {nomination.nominationDate && <span>Nominated: {formatTableDate(nomination.nominationDate)}</span>}
                              {nomination.estimatedBudget != null && (
                                <span>Budget: {nomination.currency ?? "MWK"} {nomination.estimatedBudget.toLocaleString()}</span>
                              )}
                            </div>
                            {nomination.statusReason && (
                              <div className="text-muted small mt-1">Reason: {nomination.statusReason}</div>
                            )}
                          </div>
                          <button
                            className="btn btn-sm btn-outline-secondary flex-shrink-0"
                            onClick={() => navigate(`/nomination/view/${nomination.pk}`)}
                          >
                            View Nomination
                          </button>
                        </div>

                        {/* Admission section */}
                        {admission ? (
                          <div
                            className="rounded p-3 mt-2"
                            style={{ background: "#f0fdf4", borderLeft: "3px solid #059669" }}
                          >
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                              <div>
                                <div className="fw-semibold text-success small mb-1">ADMITTED</div>
                                <div className="d-flex flex-wrap gap-3 small">
                                  <span>
                                    <span className="text-muted">Admitted:</span> {formatTableDate(admission.admissionDate)}
                                  </span>
                                  {admission.admissionProgramName && (
                                    <span>
                                      <span className="text-muted">Programme:</span> {admission.admissionProgramName}
                                    </span>
                                  )}
                                  {admission.admissionProgramCountry && (
                                    <span>
                                      <span className="text-muted">Country:</span> {admission.admissionProgramCountry}
                                    </span>
                                  )}
                                  {admission.admissionProgramInstitution && (
                                    <span>
                                      <span className="text-muted">Institution:</span> {admission.admissionProgramInstitution}
                                    </span>
                                  )}
                                  {admission.modeOfStudyName && (
                                    <span>
                                      <span className="text-muted">Mode:</span> {admission.modeOfStudyName}
                                    </span>
                                  )}
                                  {admission.releaseStartDate && admission.releaseEndDate && (
                                    <span>
                                      <span className="text-muted">Release:</span>{" "}
                                      {formatTableDate(admission.releaseStartDate)} – {formatTableDate(admission.releaseEndDate)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="d-flex gap-2 flex-shrink-0">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => navigate(`${NavigationRoutes.ALLOWANCE_CREATE}?participantId=${participant.pk}&admissionId=${admission.pk}`)}
                                >
                                  + Allowance
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => navigate(`/admission/view/${admission.pk}`)}
                                >
                                  View Admission
                                </button>
                              </div>
                            </div>

                            {/* Allowances for this admission */}
                            {admissionAllowances.length > 0 && (
                              <div className="mt-3">
                                <div className="text-muted small fw-semibold mb-2">Allowances</div>
                                <div className="d-flex flex-wrap gap-2">
                                  {admissionAllowances.map((alw) => (
                                    <span
                                      key={alw.pk}
                                      className="badge bg-light text-dark border small"
                                      title={`${formatTableDate(alw.startDate)} – ${formatTableDate(alw.endDate)}`}
                                    >
                                      {alw.allowanceType?.name ?? `Allowance #${alw.pk}`}
                                      {" · "}
                                      MWK {(alw.amount ?? 0).toLocaleString()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          nomination.nominationStatus === "Approved" && (
                            <div
                              className="rounded p-3 mt-2 d-flex align-items-center justify-content-between gap-2"
                              style={{ background: "#fffbeb", borderLeft: "3px solid #f59e0b" }}
                            >
                              <span className="small text-warning-emphasis">Approved but not yet admitted.</span>
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => navigate(`/training/enroll/${nomination.pk}`)}
                              >
                                + Record Admission
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Standalone allowances (not linked to an admission) */}
          {(() => {
            const unlinked = allowances.filter(
              (a) => !nominationsWithAdmissions.some(
                (n) => n.admission && (a.admissionFK === n.admission.pk || a.trainingFK === n.admission.pk)
              )
            );
            if (unlinked.length === 0) return null;
            return (
              <div className="card">
                <div className="card-header fw-semibold">Other Allowances</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm mb-0">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Period</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unlinked.map((a) => (
                          <tr key={a.pk}>
                            <td>{a.allowanceType?.name ?? "—"}</td>
                            <td>MWK {(a.amount ?? 0).toLocaleString()}</td>
                            <td>{formatTableDate(a.startDate)} – {formatTableDate(a.endDate)}</td>
                            <td>{a.allowanceStatus?.name ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
