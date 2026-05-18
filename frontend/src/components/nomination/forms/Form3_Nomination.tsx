import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { getLookupItems } from "../../../api/nomination";
import { ApiUrls } from "../../../constants/apiUrls";
import type { LookupItemDto } from "../../../types";
import type { Form3_NominationData } from "../../../types/nomination";

interface NominatedProgramOption {
  pk: number;
  name: string;
  year: number;
  description?: string;
}

interface Form3Props {
  data: Form3_NominationData;
  onDataChange: (data: Form3_NominationData) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function Form3_Nomination({ data, onDataChange, onNext, onBack, loading }: Form3Props) {
  const [qualifications, setQualifications] = useState<LookupItemDto[]>([]);
  const [sponsorTypes, setSponsorTypes] = useState<LookupItemDto[]>([]);
  const [nominatedPrograms, setNominatedPrograms] = useState<NominatedProgramOption[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);

  useEffect(() => {
    const year = data.yearOfNomination;
    const url = year
      ? `${ApiUrls.lookups.NOMINATED_PROGRAMS}?year=${year}`
      : ApiUrls.lookups.NOMINATED_PROGRAMS;

    Promise.all([
      getLookupItems(ApiUrls.lookups.QUALIFICATIONS),
      getLookupItems(ApiUrls.lookups.SPONSOR_TYPES),
      axiosInstance.get(url).then(r => r.data),
    ])
      .then(([quals, sponsors, programs]) => {
        setQualifications(quals);
        setSponsorTypes(sponsors);
        setNominatedPrograms(programs);
      })
      .catch(() => { /* keep empty */ })
      .finally(() => setLookupsLoading(false));
  }, [data.yearOfNomination]);

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 3: Nomination</h3>
          <p className="text-muted">Qualification and nominated program details</p>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="yearOfNomination">Year of Nomination</label>
                <input
                  type="number"
                  id="yearOfNomination"
                  className="form-control"
                  value={data.yearOfNomination || new Date().getFullYear()}
                  onChange={(e) => onDataChange({ ...data, yearOfNomination: parseInt(e.target.value) })}
                  min="2000"
                  max="2100"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="qualificationId">Current Qualification</label>
                <select
                  id="qualificationId"
                  className="form-control"
                  value={data.qualificationId ?? ""}
                  onChange={(e) => onDataChange({ ...data, qualificationId: e.target.value ? parseInt(e.target.value) : undefined })}
                  disabled={lookupsLoading}
                >
                  <option value="">{lookupsLoading ? "Loading..." : "Select qualification..."}</option>
                  {qualifications.map(q => (
                    <option key={q.pk} value={q.pk}>{q.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="nominatedProgramId">Nominated Program</label>
                <select
                  id="nominatedProgramId"
                  className="form-control"
                  value={data.nominatedProgramId ?? ""}
                  onChange={(e) => onDataChange({ ...data, nominatedProgramId: e.target.value ? parseInt(e.target.value) : undefined })}
                  disabled={lookupsLoading}
                >
                  <option value="">{lookupsLoading ? "Loading..." : "Select program..."}</option>
                  {nominatedPrograms.map(p => (
                    <option key={p.pk} value={p.pk}>{p.name} ({p.year})</option>
                  ))}
                </select>
                {nominatedPrograms.length === 0 && !lookupsLoading && (
                  <small className="text-muted">No programs available for {data.yearOfNomination ?? "this year"}.</small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="sponsorTypeId">Type of Sponsor</label>
                <select
                  id="sponsorTypeId"
                  className="form-control"
                  value={data.sponsorTypeId ?? ""}
                  onChange={(e) => onDataChange({ ...data, sponsorTypeId: e.target.value ? parseInt(e.target.value) : undefined })}
                  disabled={lookupsLoading}
                >
                  <option value="">{lookupsLoading ? "Loading..." : "Select sponsor type..."}</option>
                  {sponsorTypes.map(s => (
                    <option key={s.pk} value={s.pk}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="estimatedBudget">Estimated Training Budget</label>
                <select
                  id="estimatedBudget"
                  className="form-control"
                  value={data.estimatedBudget ?? ""}
                  onChange={(e) => onDataChange({ ...data, estimatedBudget: e.target.value ? parseFloat(e.target.value) : undefined })}
                >
                  <option value="">Select amount...</option>
                  <option value="50000">P50,000</option>
                  <option value="100000">P100,000</option>
                  <option value="200000">P200,000</option>
                  <option value="500000">P500,000</option>
                  <option value="1000000">P1,000,000</option>
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="professionalBody">Professional Body</label>
                <input
                  type="text"
                  id="professionalBody"
                  className="form-control"
                  value={data.professionalBody ?? ""}
                  onChange={(e) => onDataChange({ ...data, professionalBody: e.target.value || undefined })}
                  placeholder="e.g. BHPC, BMA, BNC"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <input
                  type="text"
                  id="notes"
                  className="form-control"
                  value={data.notes ?? ""}
                  onChange={(e) => onDataChange({ ...data, notes: e.target.value || undefined })}
                  placeholder="Additional notes"
                />
              </div>
            </div>
          </div>

          <div className="form-actions mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNext}
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Nomination"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

