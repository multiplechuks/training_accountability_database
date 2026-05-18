import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody, StatCard } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { getAdmissions, deleteAdmission } from "@/api/enrollment";
import type { AdmissionResponseDto, PaginatedResponse } from "@/types";
import { NavigationRoutes } from "@/constants";

export default function EnrollmentListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admissions, setAdmissions] = useState<AdmissionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdmissionResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<AdmissionResponseDto> = await getAdmissions(currentPage, pageSize, searchTerm || undefined);
      setAdmissions(response.data ?? []);
      setTotalCount(response.totalCount ?? 0);
    } catch {
      setError("Failed to load enrolments. Please try again.");
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await deleteAdmission(toDelete.pk);
      setSuccessMessage("Enrolment deleted successfully.");
      setToDelete(null);
      fetchAdmissions();
    } catch {
      setError("Failed to delete enrolment.");
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString("en-GB") : "—";
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Enrolments</h1>
          <p className="page-subtitle">Participants currently enrolled in training programmes</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(NavigationRoutes.NOMINATIONS)}>
          + Enrol from Nominations
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)} />
        </div>
      )}

      <div className="content-grid">
        <StatCard title="Total Enrolments" value={totalCount} subtitle="All time" color="primary" icon="🎓" />
      </div>

      <Card>
        <CardHeader title="Enrolment Records" subtitle={`${totalCount} total`} />
        <CardBody>
          <div className="mb-3">
            <input
              type="search"
              className="form-control"
              style={{ maxWidth: 320 }}
              placeholder="Search by participant or programme..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-container">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participant</th>
                  <th>Programme</th>
                  <th>Mode of Study</th>
                  <th>Admission Date</th>
                  <th>Release Period</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="spinner-border text-primary" role="status" />
                      <span className="ms-2">Loading...</span>
                    </td>
                  </tr>
                ) : admissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      {searchTerm ? "No enrolments match your search." : "No enrolments yet. Go to Nominations and enrol an approved nomination."}
                    </td>
                  </tr>
                ) : admissions.map((a) => (
                  <tr key={a.pk}>
                    <td className="text-muted" style={{ fontSize: "0.85rem" }}>{a.pk}</td>
                    <td><strong>{a.participantName}</strong></td>
                    <td>{a.admissionProgramName ?? <span className="text-muted">—</span>}</td>
                    <td>{a.modeOfStudyName ?? <span className="text-muted">—</span>}</td>
                    <td>{fmt(a.admissionDate)}</td>
                    <td>
                      {a.releaseStartDate && a.releaseEndDate
                        ? <span>{fmt(a.releaseStartDate)} – {fmt(a.releaseEndDate)}</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/enrollment/view/${a.pk}`)}>View</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/enrollment/edit/${a.pk}`)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(a)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted">Page {currentPage} of {totalPages} ({totalCount} total)</span>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-1" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                <button className="btn btn-sm btn-outline-secondary" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <ConfirmationModal
        show={!!toDelete}
        title="Delete Enrolment"
        message={toDelete ? `Delete enrolment for ${toDelete.participantName}? This cannot be undone.` : ""}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
