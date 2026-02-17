import { useState } from "react";
import type { Form3_NominationData } from "../../../types/nomination";

interface Form3Props {
  data: Form3_NominationData;
  onDataChange: (data: Form3_NominationData) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form3_Nomination({ data, onDataChange, onNext, onBack, onSave, loading }: Form3Props) {
  const [newQualification, setNewQualification] = useState("");

  const addQualification = () => {
    if (newQualification.trim()) {
      const qualifications = data.currentQualifications || [];
      onDataChange({ 
        ...data, 
        currentQualifications: [...qualifications, newQualification.trim()] 
      });
      setNewQualification("");
    }
  };

  const removeQualification = (index: number) => {
    const qualifications = data.currentQualifications || [];
    onDataChange({ 
      ...data, 
      currentQualifications: qualifications.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 3: Nomination</h3>
          <p className="text-muted">Current qualifications and nominated program details</p>

          {/* Current Qualifications */}
          <div className="form-group">
            <label>Current Qualifications</label>
            <div className="input-group mb-2">
              <select
                className="form-control"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
              >
                <option value="">Select qualification...</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
                <option value="Degree">Degree</option>
                <option value="Honours">Honours</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addQualification}
                disabled={!newQualification}
              >
                Add
              </button>
            </div>
            {data.currentQualifications && data.currentQualifications.length > 0 && (
              <div className="mt-2">
                {data.currentQualifications.map((qual, index) => (
                  <span key={index} className="badge bg-primary me-2 mb-2">
                    {qual}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: "0.7rem" }}
                      onClick={() => removeQualification(index)}
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="nominatedProgram">Nominated Program</label>
                <input
                  type="text"
                  id="nominatedProgram"
                  className="form-control"
                  value={data.nominatedProgram || ""}
                  onChange={(e) => onDataChange({ ...data, nominatedProgram: e.target.value })}
                  placeholder="Enter the program you wish to study"
                />
                <small className="form-text text-muted">
                  Enter the name of the program you are nominating for
                </small>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="sponsorType">Type of Sponsor</label>
                <select
                  id="sponsorType"
                  className="form-control"
                  value={data.sponsorType || ""}
                  onChange={(e) => onDataChange({ ...data, sponsorType: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Govt Sponsor">Govt Sponsor</option>
                  <option value="Self Sponsored">Self Sponsored</option>
                  <option value="Organization">Organization</option>
                  <option value="Scholarship">Scholarship</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
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

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="estimatedBudget">Estimated Training Budget</label>
                <select
                  id="estimatedBudget"
                  className="form-control"
                  value={data.estimatedBudget || ""}
                  onChange={(e) => onDataChange({ ...data, estimatedBudget: parseFloat(e.target.value) })}
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
                <select
                  id="professionalBody"
                  className="form-control"
                  value={data.professionalBody || ""}
                  onChange={(e) => onDataChange({ ...data, professionalBody: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="BHPC">BHPC</option>
                  <option value="BMA">BMA</option>
                  <option value="BNC">BNC</option>
                  <option value="Other">Other</option>
                </select>
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
              {loading ? "Processing..." : "Next: Admission"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
