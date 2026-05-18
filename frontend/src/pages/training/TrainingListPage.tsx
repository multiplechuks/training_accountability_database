import { Card, CardHeader, CardBody, StatCard } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdmissions, deleteAdmission, updateAdmission } from "@/api/enrollment";
import { getAllLookups } from "@/api/nomination";
import { NavigationRoutes } from "@/constants";
import type { AdmissionResponseDto, PaginatedResponse, AdmissionProgramDto, LookupItemDto } from "@/types";

interface EditForm {
  admissionDate: string;
  admissionProgramId: string;
  modeOfStudyId: string;
  releaseStartDate: string;
  releaseEndDate: string;
  notes: string;
}

export default function TrainingListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admissions, setAdmissions] = useState<AdmissionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdmissionResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View modal
  const [viewing, setViewing] = useState<AdmissionResponseDto | null>(null);

  // Edit modal
  const [editing, setEditing] = useState<AdmissionResponseDto | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ admissionDate: "", admissionProgramId: "", modeOfStudyId: "", releaseStartDate: "", releaseEndDate: "", notes: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [admissionPrograms, setAdmissionPrograms] = useState<AdmissionProgramDto[]>([]);
  const [modesOfStudy, setModesOfStudy] = useState<LookupItemDto[]>([]);
  const [lookupsLoaded, setLookupsLoaded] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const fetchAdmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<AdmissionResponseDto> = await getAdmissions(currentPage, pageSize, searchTerm || undefined);
      setAdmissions(response.data ?? []);
      setTotalCount(response.totalCount ?? 0);
    } catch {
      setError("Failed to load training enrollments. Please try again.");
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
      setSuccessMessage("Enrollment deleted successfully.");
      setToDelete(null);
      fetchAdmissions();
    } catch {
      setError("Failed to delete enrollment.");
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = async (a: AdmissionResponseDto) => {
    if (!lookupsLoaded) {
      const all = await getAllLookups();
      setAdmissionPrograms(all.admissionPrograms ?? []);
      setModesOfStudy(all.modesOfStudy ?? []);
      setLookupsLoaded(true);
    }
    setEditForm({
      admissionDate: a.admissionDate ? a.admissionDate.slice(0, 10) : "",
      admissionProgramId: a.admissionProgramFK ? String(a.admissionProgramFK) : "",
      modeOfStudyId: a.modeOfStudyFK ? String(a.modeOfStudyFK) : "",
      releaseStartDate: a.releaseStartDate ? a.releaseStartDate.slice(0, 10) : "",
      releaseEndDate: a.releaseEndDate ? a.releaseEndDate.slice(0, 10) : "",
      notes: a.notes ?? "",
    });
    setEditError(null);
    setEditing(a);
  };

  const handleEditSave = async () => {
    if (!editing) return;
    if (!editForm.admissionDate) { setEditError("Admission date is required."); return; }
    setEditSaving(true);
    setEditError(null);
    try {
      const updated = await updateAdmission(editing.pk, {
        admissionDate: editForm.admissionDate,
        admissionProgramId: editForm.admissionProgramId ? parseInt(editForm.admissionProgramId) : undefined,
        modeOfStudyId: editForm.modeOfStudyId ? parseInt(editForm.modeOfStudyId) : undefined,
        releaseStartDate: editForm.releaseStartDate || undefined,
        releaseEndDate: editForm.releaseEndDate || undefined,
        notes: editForm.notes || undefined,
      });
      setAdmissions(prev => prev.map(a => a.pk === updated.pk ? updated : a));
      setSuccessMessage("Enrolment updated successfully.");
      setEditing(null);
    } catch {
      setEditError("Failed to save changes. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-GB") : "—";

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Training Enrolments</h1>
        <p className="page-subtitle">People currently enrolled in training programmes</p>
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
        <CardHeader
          title="Enrolment Records"
          subtitle={`${totalCount} total enrolments`}
          actions={
            <button className="btn btn-sm btn-primary" onClick={() => navigate(NavigationRoutes.NOMINATIONS)}>
              ➕ Enrol from Nominations
            </button>
          }
        />
        <CardBody>
          <div className="mb-4">
            <input
              type="search"
              placeholder="Search enrolments..."
              className="form-input"
              style={{ maxWidth: "300px" }}
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
                  <th>Release Start</th>
                  <th>Release End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="spinner-border text-primary" role="status" />
                      <span className="ms-2">Loading...</span>
                    </td>
                  </tr>
                ) : admissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      {searchTerm ? "No enrolments match your search." : "No enrolments found. Approve nominations and enrol them from the Nominations page."}
                    </td>
                  </tr>
                ) : admissions.map((a) => (
                  <tr key={a.pk}>
                    <td>{a.pk}</td>
                    <td><strong>{a.participantName}</strong></td>
                    <td>{a.admissionProgramName ?? <span className="text-muted">—</span>}</td>
                    <td>{a.modeOfStudyName ?? <span className="text-muted">—</span>}</td>
                    <td>{formatDate(a.admissionDate)}</td>
                    <td>{formatDate(a.releaseStartDate)}</td>
                    <td>{formatDate(a.releaseEndDate)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" title="View details" onClick={() => setViewing(a)}>View</button>
                        <button className="btn btn-sm btn-outline-primary" title="Edit" onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => setToDelete(a)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted">
                Page {currentPage} of {totalPages} ({totalCount} total)
              </span>
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary me-1"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >Previous</button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >Next</button>
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

      {/* ── View Modal ── */}
      {viewing && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
          onClick={() => setViewing(null)} />
      )}
      {viewing && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050, pointerEvents: "none" }}>
          <div style={{ backgroundColor: "white", borderRadius: 8, width: "90%", maxWidth: 560, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", pointerEvents: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Enrolment Details</h5>
              <button type="button" className="btn-close" onClick={() => setViewing(null)} />
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <dl className="row mb-0" style={{ rowGap: "0.5rem" }}>
                <dt className="col-sm-4 text-muted">Participant</dt>
                <dd className="col-sm-8 mb-0"><strong>{viewing.participantName}</strong></dd>

                <dt className="col-sm-4 text-muted">Admission Date</dt>
                <dd className="col-sm-8 mb-0">{formatDate(viewing.admissionDate)}</dd>

                <dt className="col-sm-4 text-muted">Programme</dt>
                <dd className="col-sm-8 mb-0">{viewing.admissionProgramName ?? <span className="text-muted">—</span>}</dd>

                <dt className="col-sm-4 text-muted">Mode of Study</dt>
                <dd className="col-sm-8 mb-0">{viewing.modeOfStudyName ?? <span className="text-muted">—</span>}</dd>

                <dt className="col-sm-4 text-muted">Release Start</dt>
                <dd className="col-sm-8 mb-0">{formatDate(viewing.releaseStartDate)}</dd>

                <dt className="col-sm-4 text-muted">Release End</dt>
                <dd className="col-sm-8 mb-0">{formatDate(viewing.releaseEndDate)}</dd>

                {viewing.releaseLetterOriginalName && (
                  <>
                    <dt className="col-sm-4 text-muted">Release Letter</dt>
                    <dd className="col-sm-8 mb-0">
                      {viewing.releaseLetterPath
                        ? <a href={viewing.releaseLetterPath} target="_blank" rel="noopener noreferrer">{viewing.releaseLetterOriginalName}</a>
                        : viewing.releaseLetterOriginalName}
                    </dd>
                  </>
                )}

                {viewing.notes && (
                  <>
                    <dt className="col-sm-4 text-muted">Notes</dt>
                    <dd className="col-sm-8 mb-0" style={{ whiteSpace: "pre-wrap" }}>{viewing.notes}</dd>
                  </>
                )}

                <dt className="col-sm-4 text-muted">Recorded</dt>
                <dd className="col-sm-8 mb-0">{formatDate(viewing.createdAt)}</dd>
              </dl>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-primary" onClick={() => { setViewing(null); openEdit(viewing); }}>Edit</button>
              <button className="btn btn-outline-secondary" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
          onClick={() => !editSaving && setEditing(null)} />
      )}
      {editing && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050, pointerEvents: "none" }}>
          <div style={{ backgroundColor: "white", borderRadius: 8, width: "90%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", pointerEvents: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: 600 }}>Edit Enrolment</h5>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>{editing.participantName}</div>
              </div>
              <button type="button" className="btn-close" onClick={() => setEditing(null)} disabled={editSaving} />
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              {editError && <div className="alert alert-danger py-2 mb-3">{editError}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Admission Date <span className="text-danger">*</span></label>
                  <input type="date" className="form-control" value={editForm.admissionDate}
                    onChange={e => setEditForm(f => ({ ...f, admissionDate: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Mode of Study</label>
                  <select className="form-select" value={editForm.modeOfStudyId}
                    onChange={e => setEditForm(f => ({ ...f, modeOfStudyId: e.target.value }))}>
                    <option value="">— Select mode —</option>
                    {modesOfStudy.map(m => <option key={m.pk} value={m.pk}>{m.name}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Admission Programme</label>
                  <select className="form-select" value={editForm.admissionProgramId}
                    onChange={e => setEditForm(f => ({ ...f, admissionProgramId: e.target.value }))}>
                    <option value="">— Select programme —</option>
                    {admissionPrograms.map(p => (
                      <option key={p.pk} value={p.pk}>
                        {p.name}{p.institution ? ` — ${p.institution}` : ""}{p.country ? ` (${p.country})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Release Start Date</label>
                  <input type="date" className="form-control" value={editForm.releaseStartDate}
                    onChange={e => setEditForm(f => ({ ...f, releaseStartDate: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Release End Date</label>
                  <input type="date" className="form-control" value={editForm.releaseEndDate}
                    onChange={e => setEditForm(f => ({ ...f, releaseEndDate: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={3} value={editForm.notes}
                    onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Optional notes..." />
                </div>
              </div>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setEditing(null)} disabled={editSaving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
