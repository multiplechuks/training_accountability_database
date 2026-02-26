import { useState, useEffect } from "react";
import SearchableSelect from "../../ui/SearchableSelect";
import { searchParticipantsForSelect } from "../../../api/searchHelpers";
import type { Form1_ParticipantProfileData } from "../../../types/nomination";

interface Form1Props {
  data: Form1_ParticipantProfileData;
  onDataChange: (data: Form1_ParticipantProfileData) => void;
  onNext: () => void;
  onSave: () => void;
  loading: boolean;
}

export default function Form1_ParticipantProfile({ data, onDataChange, onNext, onSave, loading }: Form1Props) {
  const [mode, setMode] = useState<"select" | "create">(data.participantId ? "select" : "create");

  // Sync mode with data changes
  useEffect(() => {
    if (data.participantId && data.participantId > 0) {
      setMode("select");
    }
  }, [data.participantId]);

  const isValidForSelect = data.participantId && data.participantId > 0;
  const isValidForCreate = 
    data.firstname && data.firstname.trim() !== "" &&
    data.lastname && data.lastname.trim() !== "" &&
    data.idNo && data.idNo.trim() !== "" &&
    data.sex && data.sex !== "" &&
    data.dob && data.dob !== "" &&
    data.phone && data.phone.trim() !== "" &&
    data.email && data.email.trim() !== "";

  const isValid = mode === "select" ? isValidForSelect : isValidForCreate;

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          <h3>Stage 1: Participant Profile</h3>
          <p className="text-muted">Select an existing participant or create a new one</p>

          {/* Mode Selection */}
          <div className="btn-group mb-4" role="group">
            <button
              type="button"
              className={`btn ${mode === "select" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("select")}
            >
              Select Existing
            </button>
            <button
              type="button"
              className={`btn ${mode === "create" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("create")}
            >
              Create New
            </button>
          </div>

          {/* Select Existing Participant */}
          {mode === "select" && (
            <div>
              <div className="form-group">
                <label className="required" htmlFor="participantFK">Select Participant</label>
                <SearchableSelect
                  value={data.participantId}
                  onChange={(value: number | undefined) => onDataChange({ ...data, participantId: value })}
                  placeholder="Search by name, email, or ID number..."
                  onSearch={searchParticipantsForSelect}
                  minSearchLength={2}
                />
                <small className="form-text text-muted">
                  Type at least 2 characters to search
                </small>
              </div>
            </div>
          )}

          {/* Create New Participant */}
          {mode === "create" && (
            <div>
              <h5>Participant Information</h5>
              <hr />

              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <select
                      id="title"
                      className="form-control"
                      value={data.title || ""}
                      onChange={(e) => onDataChange({ ...data, title: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="required" htmlFor="firstname">First Name</label>
                    <input
                      type="text"
                      id="firstname"
                      className="form-control"
                      value={data.firstname || ""}
                      onChange={(e) => onDataChange({ ...data, firstname: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="middlename">Middle Name</label>
                    <input
                      type="text"
                      id="middlename"
                      className="form-control"
                      value={data.middlename || ""}
                      onChange={(e) => onDataChange({ ...data, middlename: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="required" htmlFor="lastname">Last Name</label>
                    <input
                      type="text"
                      id="lastname"
                      className="form-control"
                      value={data.lastname || ""}
                      onChange={(e) => onDataChange({ ...data, lastname: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="required" htmlFor="idType">ID Type</label>
                    <select
                      id="idType"
                      className="form-control"
                      value={data.idType || "NATIONAL_ID"}
                      onChange={(e) => onDataChange({ ...data, idType: e.target.value })}
                      required
                    >
                      <option value="NATIONAL_ID">National ID</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="DRIVERS_LICENSE">Driver's License</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="required" htmlFor="idNo">ID Number</label>
                    <input
                      type="text"
                      id="idNo"
                      className="form-control"
                      value={data.idNo || ""}
                      onChange={(e) => onDataChange({ ...data, idNo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="required" htmlFor="dob">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      className="form-control"
                      value={data.dob || ""}
                      onChange={(e) => onDataChange({ ...data, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="required" htmlFor="sex">Gender</label>
                    <select
                      id="sex"
                      className="form-control"
                      value={data.sex || ""}
                      onChange={(e) => onDataChange({ ...data, sex: e.target.value })}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="required" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      value={data.phone || ""}
                      onChange={(e) => onDataChange({ ...data, phone: e.target.value })}
                      placeholder="+267 71234567"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="workTelephone">Work Telephone</label>
                    <input
                      type="tel"
                      id="workTelephone"
                      className="form-control"
                      value={data.workTelephone || ""}
                      onChange={(e) => onDataChange({ ...data, workTelephone: e.target.value })}
                      placeholder="+267 3123456"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="required" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={data.email || ""}
                      onChange={(e) => onDataChange({ ...data, email: e.target.value })}
                      placeholder="participant@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <h5 className="mt-3">Employment Information</h5>
              <hr />

              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="designationFK">Current Scale/Designation</label>
                    <input
                      type="text"
                      id="designationFK"
                      className="form-control"
                      value={data.designationFK || ""}
                      onChange={(e) => onDataChange({ ...data, designationFK: e.target.value})}
                      placeholder="e.g., D1, C2"
                    />
                    <small className="form-text text-muted">Enter salary scale number</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="departmentOrFacility">Department/Facility</label>
                    <input
                      type="text"
                      id="departmentOrFacility"
                      className="form-control"
                      value={data.departmentOrFacility || ""}
                      onChange={(e) => onDataChange({ ...data, departmentOrFacility: e.target.value })}
                      placeholder="e.g., Nursing"
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="dutyStation">Duty Station</label>
                    <input
                      type="text"
                      id="dutyStation"
                      className="form-control"
                      value={data.dutyStation || ""}
                      onChange={(e) => onDataChange({ ...data, dutyStation: e.target.value })}
                      placeholder="e.g., Princess Marina Hospital"
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="postalAddress">Postal Address</label>
                    <input
                      type="text"
                      id="postalAddress"
                      className="form-control"
                      value={data.postalAddress || ""}
                      onChange={(e) => onDataChange({ ...data, postalAddress: e.target.value })}
                      placeholder="P.O. Box 1234, City"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions mt-4">
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
              disabled={!isValid || loading}
            >
              {loading ? "Processing..." : "Next: Next of Kin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
