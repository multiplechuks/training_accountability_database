import { useState, useEffect, useRef } from "react";
import type { Form4_AdmissionData } from "../../../types/nomination";
import { searchTrainings } from "../../../api/training";
import type { TrainingResponseDto } from "../../../types";

interface Form4Props {
  data: Form4_AdmissionData;
  onDataChange: (data: Form4_AdmissionData) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form4_Admission({ data, onDataChange, onNext, onBack, onSave, loading }: Form4Props) {
  const [programSearch, setProgramSearch] = useState(data.programName || "");
  const [programOptions, setProgramOptions] = useState<TrainingResponseDto[]>([]);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const skipSearchRef = useRef(false);

  // Sync program search with prop changes
  useEffect(() => {
    setProgramSearch(data.programName || "");
  }, [data.programName]);

  // Search programs when user types
  useEffect(() => {
    const searchPrograms = async () => {
      if (skipSearchRef.current) {
        skipSearchRef.current = false;
        return;
      }
      if (programSearch.length >= 2) {
        try {
          setLoadingPrograms(true);
          const result = await searchTrainings(programSearch, 1, 20);
          setProgramOptions(result.data || []);
          setShowProgramDropdown(true);
        } catch (_error) {
          // Error searching programs - silently fail and show empty list
          setProgramOptions([]);
        } finally {
          setLoadingPrograms(false);
        }
      } else {
        setProgramOptions([]);
        setShowProgramDropdown(false);
      }
    };

    const timeoutId = setTimeout(searchPrograms, 300);
    return () => clearTimeout(timeoutId);
  }, [programSearch]);

  const selectProgram = (program: TrainingResponseDto) => {
    const programName = `${program.program} - ${program.institution}`;
    skipSearchRef.current = true;
    onDataChange({ 
      ...data, 
      programName: program.program,
      trainingFK: program.id,
      institution: program.institution,
      country: program.countryOfStudy || "N/A",
    });
    setProgramSearch(programName);
    setShowProgramDropdown(false);
  };

  const handleProgramInputChange = (value: string) => {
    setProgramSearch(value);
    // Clear trainingFK if user manually edits the program name
    onDataChange({ 
      ...data, 
      programName: value,
      trainingFK: undefined,
    });
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 4: Admission (Enrollment)</h3>
          <p className="text-muted">Program admission and study period details</p>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="dateOfAdmission">Date of Admission</label>
                <input
                  type="date"
                  id="dateOfAdmission"
                  className="form-control"
                  value={data.dateOfAdmission || ""}
                  onChange={(e) => onDataChange({ ...data, dateOfAdmission: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-8">
              <div className="form-group position-relative">
                <label htmlFor="programName">Search Program</label>
                <input
                  type="text"
                  id="programName"
                  className="form-control"
                  value={programSearch}
                  onChange={(e) => handleProgramInputChange(e.target.value)}
                  onFocus={() => {
                    if (programOptions.length > 0) setShowProgramDropdown(true);
                  }}
                  placeholder="Start typing to search programs or enter custom program name"
                />
                {loadingPrograms && (
                  <div className="position-absolute end-0 top-50 me-2">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                {showProgramDropdown && programOptions.length > 0 && (
                  <div 
                    className="dropdown-menu show w-100 position-absolute" 
                    style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
                  >
                    {programOptions.map((program) => (
                      <button
                        key={program.id}
                        type="button"
                        className="dropdown-item text-start"
                        onClick={() => selectProgram(program)}
                      >
                        <div className="fw-semibold">{program.program}</div>
                        <small className="text-muted">{program.institution}</small>
                      </button>
                    ))}
                  </div>
                )}
                <small className="form-text text-muted">
                  {programSearch.length >= 2 && programOptions.length === 0 && !loadingPrograms
                    ? "No matching programs found. Enter a custom program name."
                    : "Search and select the actual program admitted to"}
                </small>
              </div>
            </div>
          </div>

          {/* Display-only fields */}
          {data.trainingFK && (
            <div className="alert alert-info">
              <div className="row">
                <div className="col-md-4">
                  <strong>Program:</strong> {data.programName || "N/A"}
                </div>
                <div className="col-md-4">
                  <strong>Institution:</strong> {data.institution || "N/A"}
                </div>
                <div className="col-md-4">
                  <strong>Country:</strong> {data.country || "N/A"}
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="modeOfStudy">Mode of Study</label>
                <select
                  id="modeOfStudy"
                  className="form-control"
                  value={data.modeOfStudy || ""}
                  onChange={(e) => onDataChange({ ...data, modeOfStudy: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Online">Online</option>
                  <option value="Block Release">Block Release</option>
                  <option value="Distance Learning">Distance Learning</option>
                  <option value="Blended Learning">Blended Learning</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="releaseStartDate">Release Start Date</label>
                <input
                  type="date"
                  id="releaseStartDate"
                  className="form-control"
                  value={data.releaseStartDate || ""}
                  onChange={(e) => onDataChange({ ...data, releaseStartDate: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="releaseEndDate">Release End Date</label>
                <input
                  type="date"
                  id="releaseEndDate"
                  className="form-control"
                  value={data.releaseEndDate || ""}
                  onChange={(e) => onDataChange({ ...data, releaseEndDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={data.startDate || ""}
                  onChange={(e) => onDataChange({ ...data, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={data.endDate || ""}
                  onChange={(e) => onDataChange({ ...data, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="lengthOfStudy">Length of Study (months)</label>
                <input
                  type="number"
                  id="lengthOfStudy"
                  className="form-control"
                  value={data.lengthOfStudy || ""}
                  onChange={(e) => onDataChange({ ...data, lengthOfStudy: parseInt(e.target.value) })}
                  min="1"
                  placeholder="Enter duration"
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
              className="btn btn-outline-secondary me-2"
              onClick={onSave}
              disabled={loading}
            >
              Save Progress
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNext}
              disabled={loading}
            >
              {loading ? "Processing..." : "Next: Bonding"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
