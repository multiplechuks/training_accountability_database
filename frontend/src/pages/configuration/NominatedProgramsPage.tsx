import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import { LoadingSpinner } from "@/components/ui";

interface FormState {
  name: string;
  year: number;
  description: string;
}

const EMPTY_FORM: FormState = { name: "", year: new Date().getFullYear(), description: "" };

const getErrorMessage = (err: unknown) => {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message;
  }
  return err instanceof Error ? err.message : undefined;
};

export default function NominatedProgramDtosPage() {
  const [programs, setPrograms] = useState<NominatedProgramDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "">("");

  // Modal state
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
      if (yearFilter) params.append("year", String(yearFilter));
      const res = await axiosInstance.get(`${ApiUrls.lookups.NOMINATED_PROGRAMS}?${params}`);
      setPrograms(res.data);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load nominated programs");
    } finally {
      setLoading(false);
    }
  }, [search, yearFilter]);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (p: NominatedProgramDto) => {
    setEditingId(p.pk);
    setForm({ name: p.name, year: p.year, description: p.description ?? "" });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    if (!form.year || form.year < 2000) { setFormError("Valid year is required"); return; }
    try {
      setSaving(true);
      setFormError(null);
      if (editingId) {
        await axiosInstance.put(ApiUrls.lookups.NOMINATED_PROGRAM(editingId), {
          name: form.name.trim(),
          year: form.year,
          description: form.description.trim() || undefined,
        });
      } else {
        await axiosInstance.post(ApiUrls.lookups.NOMINATED_PROGRAMS, {
          name: form.name.trim(),
          year: form.year,
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

  const handleDelete = async (p: NominatedProgramDto) => {
    if (!confirm(`Delete "${p.name} (${p.year})"?`)) return;
    try {
      await axiosInstance.delete(ApiUrls.lookups.NOMINATED_PROGRAM(p.pk));
      loadPrograms();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete");
    }
  };

  const years = [...new Set(programs.map(p => p.year))].sort((a, b) => b - a);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Nominated Programs</h1>
          <p className="text-muted mb-0">Manage programs available for nomination by year</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Add Program
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 280 }}
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: 160 }}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value) : "")}
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner centered />
      ) : programs.length === 0 ? (
        <div className="alert alert-info">No nominated programs found. Add one to get started.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Description</th>
                <th style={{ width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {programs.map(p => (
                <tr key={p.pk}>
                  <td>{p.name}</td>
                  <td>{p.year}</td>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520, width: "90%", overflow: "visible", display: "block", position: "relative" }}
          >
            <div className="modal-header">
              <h3>{editingId ? "Edit Program" : "Add Program"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-content">
              {formError && <div className="alert alert-danger py-2 mb-3">{formError}</div>}
              <div className="mb-3">
                <label className="form-label">Program Name <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Bachelor of Medicine"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Year <span className="text-danger">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={form.year}
                  onChange={(e) => setForm(f => ({ ...f, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  min="2000"
                  max="2100"
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
            <div className="modal-actions" style={{ padding: "1rem 2rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
