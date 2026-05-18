import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/ui/SearchableSelect";
import { searchParticipantsForSelect } from "../../api/searchHelpers";

export default function NominationStartPage() {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState<number | undefined>();

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Start New Nomination</h2>

              <div className="mb-4">
                <label className="form-label">Select Participant <span className="text-danger">*</span></label>
                <SearchableSelect
                  onSearch={searchParticipantsForSelect}
                  value={participantId}
                  onChange={setParticipantId}
                  placeholder="Search participant..."
                  searchable
                  preloadOptions
                />
                <small className="text-muted">
                  Select an existing participant or <a href="/participants/new">create a new one</a> first.
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  disabled={!participantId}
                  onClick={() => navigate(`/nomination/progress/new?participantId=${participantId}`)}
                >
                  Continue
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/nomination/list")}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
