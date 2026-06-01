import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdmission, updateAdmission } from "@/api/admission";
import { getAllLookups } from "@/api/nomination";
import { LoadingSpinner } from "@/components/ui";
import type { AdmissionResponseDto, AdmissionProgramDto, LookupItemDto } from "@/types";
import { NavigationRoutes } from "@/constants";

interface EditForm {
  admissionDate: string;
  admissionProgramId: string;
  modeOfStudyId: string;
  releaseStartDate: string;
  releaseEndDate: string;
  notes: string;
}

export default function AdmissionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState<AdmissionResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({ admissionDate: "", admissionProgramId: "", modeOfStudyId: "", releaseStartDate: "", releaseEndDate: "", notes: "" });
  const [admissionPrograms, setAdmissionPrograms] = useState<AdmissionProgramDto[]>([]);
  const [modesOfStudy, setModesOfStudy] = useState<LookupItemDto[]>([]);

  useEffect(() => {
    if (!id) { setError("No ID provided."); setLoading(false); return; }
    Promise.all([getAdmission(parseInt(id)), getAllLookups()])
      .then(([a, all]) => {
        setAdmission(a);
        setAdmissionPrograms(all.admissionPrograms ?? []);
        setModesOfStudy(all.modesOfStudy ?? []);
        setForm({
          admissionDate: a.admissionDate ? a.admissionDate.slice(0, 10) : "",
          admissionProgramId: a.admissionProgramFK ? String(a.admissionProgramFK) : "",
          modeOfStudyId: a.modeOfStudyFK ? String(a.modeOfStudyFK) : "",
          releaseStartDate: a.releaseStartDate ? a.releaseStartDate.slice(0, 10) : "",
          releaseEndDate: a.releaseEndDate ? a.releaseEndDate.slice(0, 10) : "",
          notes: a.notes ?? "",
        });
      })
      .catch(() => setError("Failed to load admission."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admission) return;
    if (!form.admissionDate) { setError("Admission date is required."); return; }
    setSaving(true);
    setError(null);
    try {
      await updateAdmission(admission.pk, {
        admissionDate: form.admissionDate,
        admissionProgramId: form.admissionProgramId ? parseInt(form.admissionProgramId) : undefined,
        modeOfStudyId: form.modeOfStudyId ? parseInt(form.modeOfStudyId) : undefined,
        releaseStartDate: form.releaseStartDate || undefined,
        releaseEndDate: form.releaseEndDate || undefined,
        notes: form.notes || undefined,
      });
      navigate(`/admission/view/${admission.pk}`, { state: { message: "Admission updated successfully." } });
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <LoadingSpinner centered />
      </div>
    );
  }

  if (error && !admission) {
    return (
      <div className="page-content">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(NavigationRoutes.ADMISSIONS)}>← Back to Admissions</button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Admission</h1>
          {admission && <p className="page-subtitle">{admission.participantName} — Admission #{admission.pk}</p>}
        </div>
        <button className="btn btn-outline-secondary" disabled={saving}
          onClick={() => navigate(admission ? `/admission/view/${admission.pk}` : NavigationRoutes.ADMISSIONS)}>
          Cancel
        </button>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header fw-semibold">Programme &amp; Dates</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Admission Date <span className="text-danger">*</span></label>
                <input type="date" className="form-control" value={form.admissionDate} required
                  onChange={e => setForm(f => ({ ...f, admissionDate: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mode of Study</label>
                <select className="form-select" value={form.modeOfStudyId}
                  onChange={e => setForm(f => ({ ...f, modeOfStudyId: e.target.value }))}>
                  <option value="">— Select mode —</option>
                  {modesOfStudy.map(m => <option key={m.pk} value={m.pk}>{m.name}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Admission Programme</label>
                <select className="form-select" value={form.admissionProgramId}
                  onChange={e => setForm(f => ({ ...f, admissionProgramId: e.target.value }))}>
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
                <input type="date" className="form-control" value={form.releaseStartDate}
                  onChange={e => setForm(f => ({ ...f, releaseStartDate: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Release End Date</label>
                <input type="date" className="form-control" value={form.releaseEndDate}
                  onChange={e => setForm(f => ({ ...f, releaseEndDate: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header fw-semibold">Notes</div>
          <div className="card-body">
            <textarea className="form-control" rows={4} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes..." />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="btn btn-outline-secondary" disabled={saving}
            onClick={() => navigate(admission ? `/admission/view/${admission.pk}` : NavigationRoutes.ADMISSIONS)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
