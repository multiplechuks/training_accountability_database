import type { Form5_BondingData } from "../../../types/nomination";

interface Form5Props {
  data: Form5_BondingData;
  onDataChange: (data: Form5_BondingData) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form5_Bonding({ data, onDataChange, onNext, onBack, onSave, loading }: Form5Props) {
  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 5: Bonding</h3>
          <p className="text-muted">Bond agreement and travel information</p>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="bondSigned">Bond Signed</label>
                <select
                  id="bondSigned"
                  className="form-control"
                  value={data.bondSigned || ""}
                  onChange={(e) => onDataChange({ ...data, bondSigned: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dateSigned">Date Signed</label>
                <input
                  type="date"
                  id="dateSigned"
                  className="form-control"
                  value={data.dateSigned || ""}
                  onChange={(e) => onDataChange({ ...data, dateSigned: e.target.value })}
                  disabled={data.bondSigned === "No"}
                />
              </div>
            </div>
          </div>

          {data.bondSigned === "No" && (
            <div className="form-group">
              <label htmlFor="reasonsNotSigned">Reasons Not Signed</label>
              <select
                id="reasonsNotSigned"
                className="form-control"
                value={data.reasonsNotSigned || ""}
                onChange={(e) => onDataChange({ ...data, reasonsNotSigned: e.target.value })}
              >
                <option value="">Select reason...</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Declined">Declined</option>
                <option value="Documentation Issues">Documentation Issues</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="departureDate">Departure Date</label>
                <input
                  type="date"
                  id="departureDate"
                  className="form-control"
                  value={data.departureDate || ""}
                  onChange={(e) => onDataChange({ ...data, departureDate: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="travelMode">Travel Mode</label>
                <select
                  id="travelMode"
                  className="form-control"
                  value={data.travelMode || ""}
                  onChange={(e) => onDataChange({ ...data, travelMode: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Road">Road</option>
                  <option value="Air">Air</option>
                  <option value="Rail">Rail</option>
                  <option value="Not Applicable">Not Applicable</option>
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
              {loading ? "Processing..." : "Next: Training Costs"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
