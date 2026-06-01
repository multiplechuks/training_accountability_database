import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import { LoadingSpinner } from "@/components/ui";

interface FormState {
  name: string;
  country: string;
  institution: string;
  description: string;
}

const EMPTY_FORM: FormState = { name: "", country: "", institution: "", description: "" };

const getErrorMessage = (err: unknown) => {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message;
  }
  return err instanceof Error ? err.message : undefined;
};

export default function AdmissionProgramDtosPage() {
  const [programs, setPrograms] = useState<AdmissionProgramDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await axiosInstance.get(`${ApiUrls.lookups.ADMISSION_PROGRAMS}?${params}`);
      setPrograms(res.data);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load admission programs");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (p: AdmissionProgramDto) => {
    setEditingId(p.pk);
    setForm({ name: p.name, country: p.country ?? "", institution: p.institution ?? "", description: p.description ?? "" });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    try {
      setSaving(true);
      setFormError(null);
      if (editingId) {
        await axiosInstance.put(ApiUrls.lookups.ADMISSION_PROGRAM(editingId), {
          name: form.name.trim(),
          country: form.country.trim() || undefined,
          institution: form.institution.trim() || undefined,
          description: form.description.trim() || undefined,
        });
      } else {
        await axiosInstance.post(ApiUrls.lookups.ADMISSION_PROGRAMS, {
          name: form.name.trim(),
          country: form.country.trim() || undefined,
          institution: form.institution.trim() || undefined,
          description: form.description.trim() || undefined,
        });
      }
      setShowModal(false);
      loadPrograms();
    } catch (err) {
      setFormError(getErrorMessage(err) || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: AdmissionProgramDto) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await axiosInstance.delete(ApiUrls.lookups.ADMISSION_PROGRAM(p.pk));
      loadPrograms();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete");
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admission Programmes</h1>
          <p className="page-subtitle">Manage programmes that participants are admitted into</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Programme
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Search programmes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner centered />
      ) : programs.length === 0 ? (
        <div className="alert alert-info">No admission programmes found. Add one to get started.</div>
      ) : (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Programme Name</th>
                <th>Institution</th>
                <th>Country</th>
                <th>Description</th>
                <th style={{ width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {programs.map(p => (
                <tr key={p.pk}>
                  <td>{p.name}</td>
                  <td>{p.institution ?? <span className="text-muted">—</span>}</td>
                  <td>{p.country ?? <span className="text-muted">—</span>}</td>
                  <td className="text-muted">{p.description ?? "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal — backdrop */}
      {showModal && (
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
          onClick={() => !saving && setShowModal(false)}
        />
      )}

      {/* Modal — dialog */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050, pointerEvents: "none" }}>
          <div style={{ backgroundColor: "white", borderRadius: 8, width: "90%", maxWidth: 480, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", pointerEvents: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0, fontWeight: 600 }}>{editingId ? "Edit Programme" : "Add Programme"}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={saving} />
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              {formError && <div className="alert alert-danger py-2 mb-3">{formError}</div>}
              <div className="mb-3">
                <label className="form-label">Programme Name <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Bachelor of Medicine"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Institution</label>
                <input
                  className="form-control"
                  value={form.institution}
                  onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))}
                  placeholder="e.g. University of Botswana"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <input
                  className="form-control"
                  value={form.country}
                  onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))}
                  placeholder="e.g. Botswana"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  className="form-control"
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
