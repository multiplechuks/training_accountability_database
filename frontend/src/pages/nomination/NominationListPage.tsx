import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { getNominations, deleteNomination, updateNominationStatus } from "@/api/training";
import { formatTableDate } from "@/utils";
import { LoadingSpinner } from "@/components/ui";
import type { NominationResponseDto, PaginatedResponse, UpdateNominationStatusDto } from "@/types";
import { NavigationRoutes } from "@/constants";

const STATUSES = ["Pending", "Approved", "Rejected", "Deferred"];

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "Approved": return "badge badge-success";
    case "Rejected": return "badge badge-danger";
    case "Deferred": return "badge badge-warning";
    default: return "badge badge-secondary";
  }
};

export default function NominationListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<PaginatedResponse<NominationResponseDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [toDelete, setToDelete] = useState<NominationResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusModal, setStatusModal] = useState<NominationStatusModalState | null>(null);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getNominations(page, pageSize, search || undefined);
      setData(result);
    } catch {
      setError("Failed to load nominations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await deleteNomination(toDelete.pk);
      setSuccessMessage("Nomination deleted successfully.");
      setToDelete(null);
      loadData();
    } catch {
      setError("Failed to delete nomination.");
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const openStatusModal = (n: NominationResponseDto) => {
    setStatusModal({
      nomination: n,
      status: n.nominationStatus,
      statusReason: n.statusReason ?? "",
      approvedBy: n.approvedBy ?? "",
      approvalDate: n.approvalDate ? n.approvalDate.split("T")[0] : "",
    });
  };

  const handleStatusSave = async () => {
    if (!statusModal) return;
    setIsSavingStatus(true);
    try {
      const dto: UpdateNominationStatusDto = {
        status: statusModal.status,
        statusReason: statusModal.statusReason || undefined,
        approvedBy: statusModal.approvedBy || undefined,
        approvalDate: statusModal.approvalDate || undefined,
      };
      await updateNominationStatus(statusModal.nomination.pk, dto);
      setSuccessMessage(`Status updated to "${statusModal.status}".`);
      setStatusModal(null);
      loadData();
    } catch {
      setError("Failed to update nomination status.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const nominations = (data?.data ?? []).filter(
    (n) => !statusFilter || n.nominationStatus === statusFilter
  );

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Nominations</h1>
        <p className="page-subtitle">Manage participant training nominations</p>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible mb-3" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)} />
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible mb-3" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      <Card>
        <CardHeader
          title="Nomination Records"
          subtitle={`${data?.totalCount ?? 0} total`}
          actions={
            <button
              className="btn btn-primary"
              onClick={() => navigate("/nomination/progress/new")}
            >
              ➕ New Nomination
            </button>
          }
        />
        <CardBody>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <input
              className="form-control"
              style={{ maxWidth: 300 }}
              placeholder="Search participant, program..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select
              className="form-select"
              style={{ maxWidth: 200 }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <LoadingSpinner />
            </div>
          ) : nominations.length === 0 ? (
            <div className="alert alert-info">No nominations found matching the current filters.</div>
          ) : (
            <div className="table-container">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Program</th>
                    <th>Year</th>
                    <th>Sponsor</th>
                    <th>
                    Status
                    <div className="text-muted fw-normal" style={{ fontSize: "0.7rem" }}>click to change</div>
                  </th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nominations.map((n) => (
                    <tr key={n.pk}>
                      <td>{n.participantName ?? `#${n.participantFK}`}</td>
                      <td>{n.nominatedProgramName ?? "—"}</td>
                      <td>{n.yearOfNomination ?? "—"}</td>
                      <td>{n.sponsorTypeName ?? "—"}</td>
                      <td>
                        <button
                          className={`${statusBadgeClass(n.nominationStatus)} border-0`}
                          style={{ cursor: "pointer" }}
                          title="Click to change status"
                          onClick={() => openStatusModal(n)}
                        >
                          {n.nominationStatus}
                        </button>
                      </td>
                      <td>
                        {formatTableDate(n.nominationDate)}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="View nomination"
                            onClick={() => navigate(NavigationRoutes.NOMINATION_VIEW(n.pk))}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit nomination"
                            onClick={() => navigate(`/nomination/progress/${n.pk}`)}
                          >
                            ✏️ Edit
                          </button>
                          {n.nominationStatus === "Approved" && !n.hasAdmission && (
                            <button
                              className="btn btn-sm btn-success"
                              title="Enroll in a training programme"
                              onClick={() => navigate(`/training/enroll/${n.pk}`)}
                            >
                              🎓 Enroll
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete nomination"
                            onClick={() => setToDelete(n)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination">
                <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage((p) => p - 1)}>Previous</button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">Page {page} of {totalPages}</span>
                </li>
                <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage((p) => p + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmationModal
        show={!!toDelete}
        message={`Are you sure you want to delete the nomination for ${toDelete?.participantName ?? "this participant"}?`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

      {/* Status Change Modal — backdrop */}
      {statusModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
          onClick={() => !isSavingStatus && setStatusModal(null)}
        />
      )}

      {/* Status Change Modal — dialog */}
      {statusModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "90%",
              maxWidth: 480,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Change Nomination Status</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setStatusModal(null)}
                disabled={isSavingStatus}
              />
            </div>

            {/* Body */}
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <p className="text-muted small mb-3">
                <strong>{statusModal.nomination.participantName}</strong>
                {statusModal.nomination.nominatedProgramName && (
                  <> &mdash; {statusModal.nomination.nominatedProgramName}</>
                )}
              </p>

              <div className="mb-3">
                <label className="form-label">Status <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={statusModal.status}
                  onChange={(e) => setStatusModal((m) => m ? { ...m, status: e.target.value } : m)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {(statusModal.status === "Rejected" || statusModal.status === "Deferred") && (
                <div className="mb-3">
                  <label className="form-label">Reason <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder={`Reason for ${statusModal.status.toLowerCase()}ing this nomination...`}
                    value={statusModal.statusReason}
                    onChange={(e) => setStatusModal((m) => m ? { ...m, statusReason: e.target.value } : m)}
                  />
                </div>
              )}

              {statusModal.status === "Approved" && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Approved By</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name of approver"
                      value={statusModal.approvedBy}
                      onChange={(e) => setStatusModal((m) => m ? { ...m, approvedBy: e.target.value } : m)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Approval Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={statusModal.approvalDate}
                      onChange={(e) => setStatusModal((m) => m ? { ...m, approvalDate: e.target.value } : m)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setStatusModal(null)}
                disabled={isSavingStatus}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStatusSave}
                disabled={isSavingStatus || ((statusModal.status === "Rejected" || statusModal.status === "Deferred") && !statusModal.statusReason.trim())}
              >
                {isSavingStatus ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

