import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { getParticipant } from "@/api/participant";
import { getAdmission } from "@/api/enrollment";
import { getAllowanceTypesLookup } from "@/api/allowanceType";
import { getAllowanceStatusesLookup } from "@/api/allowanceStatus";
import { createAllowance } from "@/api/allowance";
import { NavigationRoutes } from "@/constants";
import {
  searchParticipantsForSelect,
  searchAdmissionsForSelect,
} from "@/api/searchHelpers";
import type { CreateAllowanceDto, AllowanceType, AllowanceStatus, ParticipantResponseDto, AdmissionResponseDto } from "@/types";

interface AllowanceItem {
  id: string;
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
  const admissionIdFromUrl = searchParams.get("admissionId");

  const [selectedParticipant, setSelectedParticipant] = useState<number>(
    participantIdFromUrl ? parseInt(participantIdFromUrl) : 0
  );
  const [selectedAdmission, setSelectedAdmission] = useState<number>(
    admissionIdFromUrl ? parseInt(admissionIdFromUrl) : 0
  );
  const [allowances, setAllowances] = useState<AllowanceItem[]>([]);
  const [comments, setComments] = useState<string>("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);
  const [allowanceStatuses, setAllowanceStatuses] = useState<AllowanceStatus[]>([]);
  const [selectedParticipantData, setSelectedParticipantData] = useState<ParticipantResponseDto | null>(null);
  const [selectedAdmissionData, setSelectedAdmissionData] = useState<AdmissionResponseDto | null>(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [_successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [types, statuses] = await Promise.all([
          getAllowanceTypesLookup(),
          getAllowanceStatusesLookup(),
        ]);
        setAllowanceTypes(types ?? []);
        setAllowanceStatuses(statuses ?? []);
      } catch {
        setAllowanceTypes([
          { pk: 1, name: "Tuition Fee" },
          { pk: 2, name: "Accommodation" },
          { pk: 3, name: "Meal Allowance" },
          { pk: 4, name: "Transport" },
          { pk: 5, name: "Study Materials" },
        ]);
        setAllowanceStatuses([
          { pk: 1, name: "Pending" },
          { pk: 2, name: "Approved" },
          { pk: 3, name: "Paid" },
          { pk: 4, name: "Rejected" },
        ]);
      }
    };
    fetchLookupData();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      try {
        if (participantIdFromUrl) {
          const p = await getParticipant(parseInt(participantIdFromUrl));
          setSelectedParticipantData(p);
        }
        if (admissionIdFromUrl) {
          const a = await getAdmission(parseInt(admissionIdFromUrl));
          setSelectedAdmissionData(a);
        }
      } catch {
        setModalMessage("Error loading initial data. Please check the URL parameters.");
        setShowErrorModal(true);
      } finally {
        setInitialLoading(false);
      }
    };
    if (participantIdFromUrl || admissionIdFromUrl) {
      fetchInitialData();
    }
  }, [participantIdFromUrl, admissionIdFromUrl]);

  useEffect(() => {
    setAllowances([]);
    setComments("");
  }, [selectedParticipant, selectedAdmission]);

  const addAllowance = () => {
    const newAllowance: AllowanceItem = {
      id: Date.now().toString(),
      amount: 0,
      startDate: "",
      endDate: "",
      statusFK: 1,
      allowanceTypeFK: 0,
    };
    setAllowances((prev) => [...prev, newAllowance]);
    setIsEditing(newAllowance.id);
  };

  const deleteAllowance = (id: string) => {
    setAllowances((prev) => prev.filter((a) => a.id !== id));
    if (isEditing === id) setIsEditing(null);
  };

  const updateAllowance = (id: string, field: keyof AllowanceItem, value: string | number) => {
    setAllowances((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const validateAllowance = (allowance: AllowanceItem): boolean =>
    !!(allowance.allowanceTypeFK > 0 && allowance.amount > 0 && allowance.startDate && allowance.endDate && new Date(allowance.endDate) > new Date(allowance.startDate));

  const handleSubmit = async () => {
    if (allowances.length === 0) {
      setModalMessage("Please add at least one allowance.");
      setShowErrorModal(true);
      return;
    }
    if (allowances.some((a) => !validateAllowance(a))) {
      setModalMessage("Please complete all required fields for each allowance.");
      setShowErrorModal(true);
      return;
    }
    setLoading(true);
    try {
      const created = [];
      for (const allowance of allowances) {
        const dto: CreateAllowanceDto = {
          amount: allowance.amount,
          startDate: allowance.startDate,
          endDate: allowance.endDate,
          comments: comments,
          admissionFK: selectedAdmission > 0 ? selectedAdmission : undefined,
          statusFK: allowance.statusFK,
          participantFK: selectedParticipant,
          allowanceTypeFK: allowance.allowanceTypeFK,
        };
        created.push(await createAllowance(dto));
      }
      setSuccessCount(created.length);
      setModalMessage(`Successfully created ${created.length} allowance${created.length !== 1 ? "s" : ""}!`);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error.response as { data?: { message?: string } })?.data?.message ?? "Error creating allowances."
          : "Error creating allowances. Please try again.";
      setModalMessage(msg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (id: number) => allowanceTypes.find((t) => t.pk === id)?.name ?? "";
  const getStatusName = (id: number) => allowanceStatuses.find((s) => s.pk === id)?.name ?? "";

  if (initialLoading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Create Training Allowances</h1>
        <p className="page-subtitle">Set up allowances for a participant</p>
      </div>

      {/* Selection Card */}
      <Card className="mb-4">
        <CardHeader title="Select Participant and Admission" subtitle="Choose the participant and linked admission" />
        <CardBody>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Participant *</label>
              <SearchableSelect
                value={selectedParticipant}
                onChange={(value) => {
                  const pid = value ?? 0;
                  setSelectedParticipant(pid);
                  if (pid === 0) {
                    setSelectedParticipantData(null);
                  } else {
                    getParticipant(pid).then(setSelectedParticipantData).catch(() => undefined);
                  }
                }}
                placeholder="Search and select participant..."
                onSearch={searchParticipantsForSelect}
                minSearchLength={2}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Admission (optional)</label>
              <SearchableSelect
                value={selectedAdmission}
                onChange={(value) => {
                  const aid = value ?? 0;
                  setSelectedAdmission(aid);
                  if (aid === 0) {
                    setSelectedAdmissionData(null);
                  } else {
                    getAdmission(aid).then(setSelectedAdmissionData).catch(() => undefined);
                  }
                }}
                placeholder="Search and select admission..."
                onSearch={searchAdmissionsForSelect}
                minSearchLength={0}
                preloadOptions
              />
              <small className="form-text text-muted">Link allowances to a specific admission</small>
            </div>
          </div>

          {selectedParticipantData && (
            <div className="alert alert-info mt-2">
              <strong>Participant:</strong>{" "}
              {selectedParticipantData.fullName ?? `${selectedParticipantData.firstname} ${selectedParticipantData.lastname}`}
              {selectedAdmissionData && (
                <> &nbsp;|&nbsp; <strong>Admission #:</strong> {selectedAdmissionData.pk} — {selectedAdmissionData.admissionProgramName ?? "Program N/A"}</>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Allowances Table */}
      {selectedParticipant > 0 && (
        <Card>
          <CardHeader
            title="Allowances"
            subtitle="Add and manage allowances"
            actions={
              <button type="button" onClick={addAllowance} className="btn btn-primary" disabled={loading}>
                ➕ Add Allowance
              </button>
            }
          />
          <CardBody>
            {allowances.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: "3rem" }}>📦</div>
                <p>No allowances added yet. Click "Add Allowance" to get started.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
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
                              <select value={allowance.allowanceTypeFK} onChange={(e) => updateAllowance(allowance.id, "allowanceTypeFK", parseInt(e.target.value))} className="form-select form-select-sm" required>
                                <option value={0}>Select Type</option>
                                {allowanceTypes.map((t) => <option key={t.pk} value={t.pk}>{t.name}</option>)}
                              </select>
                            ) : (
                              <span className={!allowance.allowanceTypeFK ? "text-danger" : ""}>{getTypeName(allowance.allowanceTypeFK) || "Not selected"}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <input type="number" step="0.01" value={allowance.amount || ""} onChange={(e) => updateAllowance(allowance.id, "amount", parseFloat(e.target.value) || 0)} className="form-control form-control-sm" />
                            ) : (
                              <span className={allowance.amount <= 0 ? "text-danger" : ""}>{allowance.amount > 0 ? `P${allowance.amount.toFixed(2)}` : "Not set"}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <input type="date" value={allowance.startDate} onChange={(e) => updateAllowance(allowance.id, "startDate", e.target.value)} className="form-control form-control-sm" />
                            ) : (
                              <span className={!allowance.startDate ? "text-danger" : ""}>{allowance.startDate || "Not set"}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <input type="date" value={allowance.endDate} onChange={(e) => updateAllowance(allowance.id, "endDate", e.target.value)} className="form-control form-control-sm" />
                            ) : (
                              <span className={!allowance.endDate ? "text-danger" : ""}>{allowance.endDate || "Not set"}</span>
                            )}
                          </td>
                          <td>
                            {isEditing === allowance.id ? (
                              <select value={allowance.statusFK} onChange={(e) => updateAllowance(allowance.id, "statusFK", parseInt(e.target.value))} className="form-select form-select-sm">
                                {allowanceStatuses.map((s) => <option key={s.pk} value={s.pk}>{s.name}</option>)}
                              </select>
                            ) : (
                              <span className="badge bg-secondary">{getStatusName(allowance.statusFK)}</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {isEditing === allowance.id ? (
                                <button type="button" onClick={() => setIsEditing(null)} className="btn btn-success" title="Done">✅</button>
                              ) : (
                                <button type="button" onClick={() => setIsEditing(allowance.id)} className="btn btn-outline-primary" title="Edit">✏️</button>
                              )}
                              <button type="button" onClick={() => deleteAllowance(allowance.id)} className="btn btn-outline-danger" title="Remove">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="mb-3">
                    <label className="form-label">Comments</label>
                    <textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} className="form-control" placeholder="Add comments for all allowances..." />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Total: {allowances.length} allowance{allowances.length !== 1 ? "s" : ""}</span>
                    <div className="d-flex gap-2">
                      <button type="button" onClick={() => { setAllowances([]); setComments(""); }} className="btn btn-outline-secondary" disabled={loading}>Clear</button>
                      <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading || allowances.length === 0}>
                        {loading ? <><div className="spinner-border spinner-border-sm me-2" role="status" />Creating...</> : `Create ${allowances.length} Allowance${allowances.length !== 1 ? "s" : ""}`}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      )}

      <ConfirmationModal
        show={showSuccessModal}
        title="Success!"
        message={modalMessage}
        confirmText="Go to Allowances List"
        confirmVariant="success"
        showCancel={false}
        onConfirm={() => { setShowSuccessModal(false); navigate(NavigationRoutes.ALLOWANCES); }}
      />
      <ConfirmationModal
        show={showErrorModal}
        title="Error"
        message={modalMessage}
        confirmText="OK"
        confirmVariant="danger"
        showCancel={false}
        onConfirm={() => setShowErrorModal(false)}
      />
    </div>
  );
}
