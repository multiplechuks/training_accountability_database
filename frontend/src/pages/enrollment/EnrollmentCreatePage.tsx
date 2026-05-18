import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { createAdmission } from "@/api/enrollment";
import { getNomination } from "@/api/training";
import { getAllLookups } from "@/api/nomination";
import type { NominationResponseDto, LookupItemDto, AdmissionProgramDto } from "@/types";
import { NavigationRoutes } from "@/constants";

export default function EnrollmentCreatePage() {
  const navigate = useNavigate();
  const { nominationId: pathNomId } = useParams<{ nominationId: string }>();
  const [searchParams] = useSearchParams();
  const queryNomId = searchParams.get("nominationId");
  const nomIdParam = pathNomId ?? queryNomId;

  const [nomination, setNomination] = useState<NominationResponseDto | null>(null);
  const [admissionPrograms, setAdmissionPrograms] = useState<AdmissionProgramDto[]>([]);
  const [modesOfStudy, setModesOfStudy] = useState<LookupItemDto[]>([]);
  const [loadingNomination, setLoadingNomination] = useState(!!nomIdParam);

  const [admissionDate, setAdmissionDate] = useState("");
  const [admissionProgramId, setAdmissionProgramId] = useState("");
  const [modeOfStudyId, setModeOfStudyId] = useState("");
  const [releaseStartDate, setReleaseStartDate] = useState("");
  const [releaseEndDate, setReleaseEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [releaseLetter, setReleaseLetter] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load nomination details and lookups
  useEffect(() => {
    const fetchLookups = getAllLookups().then((all) => {
      setAdmissionPrograms(all.admissionPrograms ?? []);
      setModesOfStudy(all.modesOfStudy ?? []);
    });

    if (!nomIdParam) {
      setLoadingNomination(false);
      return;
    }

    const fetchNomination = getNomination(parseInt(nomIdParam)).then((n) => {
      setNomination(n);
    }).catch(() => {
      setError("Could not load nomination details.");
    }).finally(() => setLoadingNomination(false));

    Promise.all([fetchLookups, fetchNomination]).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominationId = nomIdParam ? parseInt(nomIdParam) : 0;
    if (!nominationId) { setError("Nomination is required."); return; }
    if (!admissionDate) { setError("Admission date is required."); return; }

    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("nominationId", String(nominationId));
      formData.append("admissionDate", admissionDate);
      if (admissionProgramId) formData.append("admissionProgramId", admissionProgramId);
      if (modeOfStudyId) formData.append("modeOfStudyId", modeOfStudyId);
      if (releaseStartDate) formData.append("releaseStartDate", releaseStartDate);
      if (releaseEndDate) formData.append("releaseEndDate", releaseEndDate);
      if (notes) formData.append("notes", notes);
      if (releaseLetter) formData.append("releaseLetter", releaseLetter);

      await createAdmission(formData);
      navigate(NavigationRoutes.ENROLLMENTS, { state: { message: "Admission created successfully." } });
    } catch {
      setError("Failed to create admission. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingNomination) {
    return (
      <div className="page-content">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">New Admission</h1>
        <p className="page-subtitle">Record a training admission for an approved nomination</p>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {nomination && (
        <div className="alert alert-info mb-3">
          <strong>Nomination:</strong> {nomination.participantName}
          {nomination.nominatedProgramName && <> &mdash; {nomination.nominatedProgramName}</>}
          {nomination.yearOfNomination && <> ({nomination.yearOfNomination})</>}
          <span className={`ms-2 badge ${nomination.nominationStatus === "Approved" ? "badge-success" : "badge-secondary"}`}>
            {nomination.nominationStatus}
          </span>
        </div>
      )}

      <Card>
        <CardHeader title="Admission Details" />
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Admission Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Admission Programme</label>
                <select
                  className="form-select"
                  value={admissionProgramId}
                  onChange={(e) => setAdmissionProgramId(e.target.value)}
                >
                  <option value="">— Select programme —</option>
                  {admissionPrograms.map((p) => (
                    <option key={p.pk} value={p.pk}>
                      {p.name}{p.institution ? ` — ${p.institution}` : ""}{p.country ? ` (${p.country})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Mode of Study</label>
                <select
                  className="form-select"
                  value={modeOfStudyId}
                  onChange={(e) => setModeOfStudyId(e.target.value)}
                >
                  <option value="">— Select mode —</option>
                  {modesOfStudy.map((m) => (
                    <option key={m.pk} value={m.pk}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Release Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={releaseStartDate}
                  onChange={(e) => setReleaseStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Release End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={releaseEndDate}
                  onChange={(e) => setReleaseEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Release Letter</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setReleaseLetter(e.target.files?.[0] ?? null)}
                />
                <small className="form-text text-muted">Upload the official release letter (optional)</small>
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Admission"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

