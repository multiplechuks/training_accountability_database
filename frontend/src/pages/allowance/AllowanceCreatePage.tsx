import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { getParticipant } from "@/api/participant";
import { getTraining } from "@/api/training";
import { getAllowanceTypesLookup } from "@/api/allowanceType";
import { getAllowanceStatusesLookup } from "@/api/allowanceStatus";
import { createAllowance } from "@/api/allowance";
import { NavigationRoutes } from "@/constants";
import {
  searchParticipantsForSelect,
  searchTrainingsForSelect
} from "@/api/searchHelpers";
import type { CreateAllowanceDto, AllowanceType, AllowanceStatus, ParticipantResponseDto, TrainingResponseDto } from "@/types";

interface AllowanceItem {
  id: string; // temporary ID for local tracking
  amount: number;
  startDate: string;
  endDate: string;
  allowanceTypeFK: number;
  statusFK: number;
}

export default function AllowanceCreatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const participantIdFromUrl = searchParams.get("participantId");
  const trainingIdFromUrl = searchParams.get("trainingId");

  const [selectedParticipant, setSelectedParticipant] = useState<number>(
    participantIdFromUrl ? parseInt(participantIdFromUrl) : 0
  );
  const [selectedTraining, setSelectedTraining] = useState<number>(
    trainingIdFromUrl ? parseInt(trainingIdFromUrl) : 0
  );
  const [allowances, setAllowances] = useState<AllowanceItem[]>([]);
  const [comments, setComments] = useState<string>("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);
  const [allowanceStatuses, setAllowanceStatuses] = useState<AllowanceStatus[]>([]);
  const [selectedParticipantData, setSelectedParticipantData] = useState<ParticipantResponseDto | null>(null);
  const [selectedTrainingData, setSelectedTrainingData] = useState<TrainingResponseDto | null>(null);

  // Modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [_successCount, setSuccessCount] = useState(0);

  // Fetch lookup data on component mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [allowanceTypesRes, allowanceStatusesRes] = await Promise.all([
          getAllowanceTypesLookup(),
          getAllowanceStatusesLookup()
        ]);
        setAllowanceTypes(allowanceTypesRes || []);
        setAllowanceStatuses(allowanceStatusesRes || []);
      } catch {
        // Set default values if API fails
        setAllowanceTypes([
          { pk: 1, name: "Tuition Fee", description: "Training program tuition fees" },
          { pk: 2, name: "Accommodation", description: "Monthly accommodation allowance" },
          { pk: 3, name: "Meal Allowance", description: "Monthly meal allowance" },
          { pk: 4, name: "Transport", description: "Monthly transport allowance" },
          { pk: 5, name: "Study Materials", description: "Books and study materials" }
        ]);
        setAllowanceStatuses([
          { pk: 1, name: "Pending", description: "Allowance is pending approval" },
          { pk: 2, name: "Approved", description: "Allowance has been approved for payment" },
          { pk: 3, name: "Paid", description: "Allowance has been paid to participant" },
          { pk: 4, name: "Rejected", description: "Allowance request has been rejected" },
          { pk: 5, name: "On Hold", description: "Allowance processing is on hold" }
        ]);
      }
    };

    fetchLookupData();
  }, []);

  // Fetch participant and training data if URL parameters are provided
  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      try {
        if (participantIdFromUrl) {
          const participantData = await getParticipant(parseInt(participantIdFromUrl));
          setSelectedParticipantData(participantData);
        }
        
        if (trainingIdFromUrl) {
          const trainingData = await getTraining(parseInt(trainingIdFromUrl));
          setSelectedTrainingData(trainingData);
        }
      } catch {
        setModalMessage("Error loading participant or training data. Please check the URL parameters.");
        setShowErrorModal(true);
      } finally {
        setInitialLoading(false);
      }
    };

    if (participantIdFromUrl || trainingIdFromUrl) {
      fetchInitialData();
    }
  }, [participantIdFromUrl, trainingIdFromUrl]);

  // Reset allowances when participant or training changes
  useEffect(() => {
    setAllowances([]);
    setComments("");
  }, [selectedParticipant, selectedTraining]);

  const addAllowance = () => {
    const newAllowance: AllowanceItem = {
      id: Date.now().toString(),
      amount: 0,
      startDate: "",
      endDate: "",
      statusFK: 1, // Default to Pending
      allowanceTypeFK: 0
    };

    setAllowances(prev => [...prev, newAllowance]);
    setIsEditing(newAllowance.id);
  };

  const deleteAllowance = (id: string) => {
    setAllowances(prev => prev.filter(allowance => allowance.id !== id));
    if (isEditing === id) {
      setIsEditing(null);
    }
  };

  const updateAllowance = (id: string, field: keyof AllowanceItem, value: string | number) => {
    setAllowances(prev => prev.map(allowance =>
      allowance.id === id ? { ...allowance, [field]: value } : allowance
    ));
  };

  const validateAllowance = (allowance: AllowanceItem): boolean => {
    return !!(
      allowance.allowanceTypeFK > 0 &&
      allowance.amount > 0 &&
      allowance.startDate &&
      allowance.endDate &&
      new Date(allowance.endDate) > new Date(allowance.startDate)
    );
  };

  const handleSubmit = async () => {
    if (allowances.length === 0) {
      setModalMessage("Please add at least one allowance.");
      setShowErrorModal(true);
      return;
    }

    const invalidAllowances = allowances.filter(allowance => !validateAllowance(allowance));
    if (invalidAllowances.length > 0) {
      setModalMessage("Please complete all required fields for each allowance.");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      // Create allowances one by one
      const createdAllowances = [];
      for (const allowance of allowances) {
        const allowanceDto: CreateAllowanceDto = {
          amount: allowance.amount,
          startDate: allowance.startDate,
          endDate: allowance.endDate,
          comments: comments,
          trainingFK: selectedTraining,
          statusFK: allowance.statusFK,
          participantFK: selectedParticipant,
          allowanceTypeFK: allowance.allowanceTypeFK
        };

        const created = await createAllowance(allowanceDto);
        createdAllowances.push(created);
      }
      
      setSuccessCount(createdAllowances.length);
      setModalMessage(`Successfully created ${createdAllowances.length} allowance${createdAllowances.length !== 1 ? "s" : ""}!`);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const errorMsg = error && typeof error === "object" && "response" in error 
        ? (error.response as unknown as { data?: { message?: string } })?.data?.message || "Error creating allowances. Please try again."
        : "Error creating allowances. Please try again.";
      setModalMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (typeId: number) => {
    return allowanceTypes.find(type => type.pk === typeId)?.name || "";
  };

  const getStatusName = (statusId: number) => {
    return allowanceStatuses.find(status => status.pk === statusId)?.name || "";
  };

  const selectedParticipantObj = selectedParticipantData;
  const selectedTrainingObj = selectedTrainingData;

  if (initialLoading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading participant and training data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Create Training Allowances</h1>
        <p className="page-subtitle">Set up multiple allowances for a participant and training</p>
        {(participantIdFromUrl || trainingIdFromUrl) && (
          <div className="alert alert-info mt-3">
            <i className="bi bi-info-circle me-2"></i>
            Pre-selected from enrollment record. You can change the selection if needed.
          </div>
        )}
      </div>

      {/* Participant and Training Selection */}
      <Card className="mb-4">
        <CardHeader
          title="Select Participant and Training"
          subtitle="Choose the participant and training program for the allowances"
        />
        <CardBody>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="participant" className="form-label">
                Participant *
              </label>
              <SearchableSelect
                value={selectedParticipant}
                onChange={(value: number | undefined) => {
                  const participantId = value || 0;
                  setSelectedParticipant(participantId);
                  if (participantId === 0) {
                    setSelectedParticipantData(null);
                  } else {
                    // Fetch participant data when selected
                    getParticipant(participantId)
                      .then(setSelectedParticipantData)
                      .catch(() => {
                        // Silently handle error
                      });
                  }
                }}
                placeholder="Search and select participant..."
                onSearch={searchParticipantsForSelect}
                minSearchLength={2}
              />
              <small className="form-text text-muted">
                Type to search by name, email, or national ID
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="training" className="form-label">
                Training Program *
              </label>
              <SearchableSelect
                value={selectedTraining}
                onChange={(value: number | undefined) => {
                  const trainingId = value || 0;
                  setSelectedTraining(trainingId);
                  if (trainingId === 0) {
                    setSelectedTrainingData(null);
                  } else {
                    // Fetch training data when selected
                    getTraining(trainingId)
                      .then(setSelectedTrainingData)
                      .catch(() => {
                        // Silently handle error
                      });
                  }
                }}
                placeholder="Search and select training program..."
                onSearch={searchTrainingsForSelect}
                minSearchLength={2}
              />
              <small className="form-text text-muted">
                Type to search for training programs
              </small>
            </div>
          </div>

          {selectedParticipantObj && selectedTrainingObj && (
            <div className="alert alert-info mt-3">
              <strong>Selected:</strong> {selectedParticipantObj.fullName || `${selectedParticipantObj.firstname} ${selectedParticipantObj.lastname}`} - {selectedTrainingObj.program}
              <br />
              <small className="text-muted">
                Institution: {selectedTrainingObj.institution} | Duration: {selectedTrainingObj.duration} months
              </small>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Allowances Table */}
      {selectedParticipant > 0 && selectedTraining > 0 && (
        <Card>
          <CardHeader
            title="Allowances"
            subtitle="Add and manage allowances for the selected participant and training"
          />
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div></div>
              <button
                type="button"
                onClick={addAllowance}
                className="btn btn-primary"
                disabled={loading}
              >
                ➕ Add Allowance
              </button>
            </div>
            {allowances.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
                <p>No allowances added yet. Click "Add Allowance" to get started.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Allowance Type</th>
                        <th>Amount (BWP)</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allowances.map((allowance) => (
                        <tr key={allowance.id} className={isEditing === allowance.id ? "table-active" : ""}>
                          <td>
                            {isEditing === allowance.id ? (
                              <select
                                value={allowance.allowanceTypeFK}
                                onChange={(e) => updateAllowance(allowance.id, "allowanceTypeFK", parseInt(e.target.value))}
                                className="form-select form-select-sm"
                                required
                              >
                                <option value={0}>Select Type</option>
                                {allowanceTypes.map((type) => (
                                  <option key={type.pk} value={type.pk}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={!allowance.allowanceTypeFK ? "text-danger" : ""}>
                                {getTypeName(allowance.allowanceTypeFK) || "Not selected"}
                              </span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <input
                                type="number"
                                // min="0"
                                step="0.01"
                                value={allowance.amount === 0 ? "" : allowance.amount}
                                onChange={(e) => updateAllowance(allowance.id, "amount", e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                className="form-control form-control-sm"
                                placeholder="0.00"
                                required
                              />
                            ) : (
                              <span className={allowance.amount <= 0 ? "text-danger" : ""}>
                                {allowance.amount > 0 ? `P${allowance.amount.toFixed(2)}` : "Not set"}
                              </span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <input
                                type="date"
                                value={allowance.startDate}
                                onChange={(e) => updateAllowance(allowance.id, "startDate", e.target.value)}
                                className="form-control form-control-sm"
                                required
                              />
                            ) : (
                              <span className={!allowance.startDate ? "text-danger" : ""}>
                                {allowance.startDate || "Not set"}
                              </span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <input
                                type="date"
                                value={allowance.endDate}
                                onChange={(e) => updateAllowance(allowance.id, "endDate", e.target.value)}
                                className="form-control form-control-sm"
                                required
                              />
                            ) : (
                              <span className={!allowance.endDate ? "text-danger" : ""}>
                                {allowance.endDate || "Not set"}
                              </span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <select
                                value={allowance.statusFK}
                                onChange={(e) => updateAllowance(allowance.id, "statusFK", parseInt(e.target.value))}
                                className="form-select form-select-sm"
                                required
                              >
                                {allowanceStatuses.map((status) => (
                                  <option key={status.pk} value={status.pk}>
                                    {status.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`badge ${allowance.statusFK === 1 ? "bg-warning" : allowance.statusFK === 2 ? "bg-success" : allowance.statusFK === 3 ? "bg-primary" : allowance.statusFK === 4 ? "bg-danger" : "bg-secondary"}`}>
                                {getStatusName(allowance.statusFK)}
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="btn-group btn-group-sm">
                              {isEditing === allowance.id ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setIsEditing(null)}
                                    className="btn btn-success"
                                    title="Save"
                                  >
                                    ✅
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setIsEditing(allowance.id)}
                                    className="btn btn-outline-primary"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteAllowance(allowance.id)}
                                className="btn btn-outline-danger"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Global Comments Section */}
                <div className="mt-4 pt-3 border-top">
                  <div className="mb-3">
                    <label htmlFor="globalComments" className="form-label">
                      Comments
                    </label>
                    <textarea
                      id="globalComments"
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="form-control"
                      placeholder="Add comments for all allowances..."
                    />
                    <div className="form-text">
                      These comments will apply to all allowances for this participant and training.
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div className="text-muted">
                    Total allowances: {allowances.length}
                    <br />
                    <small>At least 1 allowance is required to save</small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAllowances([]);
                        setComments("");
                        setSelectedParticipant(0);
                        setSelectedTraining(0);
                      }}
                      className="btn btn-outline-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn btn-primary"
                      disabled={loading || allowances.length === 0}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Creating Allowances...
                        </>
                      ) : (
                        `Create ${allowances.length} Allowance${allowances.length !== 1 ? "s" : ""}`
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      )}

      {/* Success Modal */}
      <ConfirmationModal
        show={showSuccessModal}
        title="Success!"
        message={modalMessage}
        confirmText="Go to Allowances List"
        confirmVariant="success"
        showCancel={false}
        icon="bi bi-check-circle-fill text-success"
        onConfirm={() => {
          setShowSuccessModal(false);
          navigate(NavigationRoutes.ALLOWANCES);
        }}
      />

      {/* Error Modal */}
      <ConfirmationModal
        show={showErrorModal}
        title="Error"
        message={modalMessage}
        confirmText="OK"
        confirmVariant="danger"
        showCancel={false}
        icon="bi bi-x-circle-fill text-danger"
        onConfirm={() => setShowErrorModal(false)}
      />
    </div>
  );
}

