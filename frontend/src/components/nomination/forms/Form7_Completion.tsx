import type { Form7_CompletionData } from "../../../types/nomination";

interface Form7Props {
  data: Form7_CompletionData;
  onDataChange: (data: Form7_CompletionData) => void;
  onComplete: () => void;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form7_Completion({ data, onDataChange, onComplete, onBack, onSave, loading }: Form7Props) {
  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 7: Completion & Review</h3>
          <p className="text-muted">Review all information and finalize enrollment</p>

          <div className="form-group">
            <label htmlFor="completionNotes">Final Notes</label>
            <textarea
              id="completionNotes"
              className="form-control"
              rows={4}
              value={data.completionNotes || ""}
              onChange={(e) => onDataChange({ ...data, completionNotes: e.target.value })}
              placeholder="Add any final notes or comments..."
            />
          </div>

          <div className="alert alert-info mt-3">
            <strong>Ready to Complete!</strong>
            <p className="mb-0">Please review all the information entered in the previous stages before finalizing this enrollment.</p>
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
              className="btn btn-success"
              onClick={onComplete}
              disabled={loading}
            >
              {loading ? "Completing..." : "Complete Enrollment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
