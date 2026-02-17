import type { Form2_NextOfKinData } from "../../../types/nomination";

interface Form2Props {
  data: Form2_NextOfKinData;
  onDataChange: (data: Form2_NextOfKinData) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form2_NextOfKin({ data, onDataChange, onNext, onBack, onSave, loading }: Form2Props) {
  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 2: Next of Kin</h3>
          <p className="text-muted">Emergency contact information</p>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="nextOfKinName">Full Name</label>
                <input
                  type="text"
                  id="nextOfKinName"
                  className="form-control"
                  value={data.nextOfKinName || ""}
                  onChange={(e) => onDataChange({ ...data, nextOfKinName: e.target.value })}
                  placeholder="Full name of next of kin"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="nextOfKinRelationship">Relationship</label>
                <input
                  type="text"
                  id="nextOfKinRelationship"
                  className="form-control"
                  value={data.nextOfKinRelationship || ""}
                  onChange={(e) => onDataChange({ ...data, nextOfKinRelationship: e.target.value })}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="nextOfKinContactNo">Contact Number</label>
                <input
                  type="tel"
                  id="nextOfKinContactNo"
                  className="form-control"
                  value={data.nextOfKinContactNo || ""}
                  onChange={(e) => onDataChange({ ...data, nextOfKinContactNo: e.target.value })}
                  placeholder="+267 71234567"
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
              {loading ? "Processing..." : "Next: Nomination"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
