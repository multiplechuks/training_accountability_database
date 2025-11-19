import { Card, CardHeader, CardBody, StatCard } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getParticipants, searchParticipants, deleteParticipant } from "@/api/participant";
import { NavigationRoutes } from "@/constants";
import { formatDateOfBirthWithAge } from "@/utils/dateFormatter";
import type { ParticipantResponseDto, PaginatedResponse } from "@/types";

export default function ParticipantsListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [participants, setParticipants] = useState<ParticipantResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [participantToDelete, setParticipantToDelete] = useState<ParticipantResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 10;

  // Check for success message from navigation
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Fetch participants data
  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response: PaginatedResponse<ParticipantResponseDto>;
      
      if (searchTerm.trim()) {
        response = await searchParticipants(searchTerm, currentPage, pageSize);
      } else {
        response = await getParticipants(currentPage, pageSize);
      }
      
      setParticipants(response.data || []);
      setTotalCount(response.total || 0);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError("Failed to load participants. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (term.trim()) {
      try {
        setLoading(true);
        const response = await searchParticipants(term, 1, pageSize);
        setParticipants(response.data || []);
        setTotalCount(response.total || 0);
      } catch (err) {
        console.error("Error searching participants:", err);
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      fetchParticipants();
    }
  };

  // Calculate stats from the data
  const activeParticipants = participants.length;
  const completedTraining = Math.floor(activeParticipants * 0.6); // Placeholder calculation

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleView = (participant: ParticipantResponseDto) => {
    navigate(NavigationRoutes.PARTICIPANT_DETAILS(participant.id));
  };

  const handleEdit = (participant: ParticipantResponseDto) => {
    navigate(NavigationRoutes.PARTICIPANT_EDIT(participant.id));
  };

  const handleDelete = (participant: ParticipantResponseDto) => {
    setParticipantToDelete(participant);
  };

  const confirmDelete = async () => {
    if (!participantToDelete) return;

    setIsDeleting(true);
    try {
      await deleteParticipant(participantToDelete.id);
      setSuccessMessage(`Participant "${participantToDelete.fullName}" deleted successfully!`);
      setParticipantToDelete(null);
      fetchParticipants();
    } catch (err) {
      console.error("Error deleting participant:", err);
      setError("Failed to delete participant. Please try again.");
      setParticipantToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setParticipantToDelete(null);
  };

  const handleCreate = () => {
    navigate(NavigationRoutes.PARTICIPANT_CREATE);
  };
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Participants Management</h1>
        <p className="page-subtitle">Manage training participants and their information</p>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={() => setSuccessMessage(null)}
          ></button>
        </div>
      )}
      
      <div className="content-grid">
        <StatCard
          title="Total Participants"
          value={totalCount}
          subtitle="Registered participants"
          color="primary"
          trend={{ value: 12, isPositive: true }}
          icon="👥"
        />
        
        <StatCard
          title="Active Participants"
          value={activeParticipants}
          subtitle="Currently enrolled"
          color="success"
          trend={{ value: 8, isPositive: true }}
          icon="✅"
        />
        
        <StatCard
          title="Completed Training"
          value={completedTraining}
          subtitle="Successfully completed"
          color="info"
          trend={{ value: 3, isPositive: false }}
          icon="🎓"
        />
      </div>
      
      <Card>
        <CardHeader 
          title="Participants List"
          subtitle="View and manage all registered participants"
          actions={
            <button className="btn btn-sm btn-primary" onClick={handleCreate}>
              ➕ Add Participant
            </button>
          }
        />
        <CardBody>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <input 
              type="search" 
              placeholder="Search participants..." 
              className="form-input"
              style={{ maxWidth: "300px" }}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="table-container">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <div className="d-flex justify-content-center align-items-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2">Loading participants...</span>
                      </div>
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm ? "No participants found matching your search." : "No participants found."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  participants.map((participant) => (
                    <tr key={participant.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar me-3">
                            {getInitials(participant.firstname, participant.lastname)}
                          </div>
                          <div>
                            <div className="fw-bold">{participant.fullName}</div>
                            <div className="text-muted">ID: {participant.idNo}</div>
                          </div>
                        </div>
                      </td>
                      <td>{formatDateOfBirthWithAge(participant.dob)}</td>
                      <td>{participant.sex}</td>
                      <td>
                        <div>
                          <div>{participant.email}</div>
                          {participant.phone && (
                            <div className="text-muted small">{participant.phone}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions d-flex gap-1">
                          <button 
                            className="btn btn-sm btn-ghost p-1"
                            onClick={() => handleView(participant)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost p-1"
                            onClick={() => handleEdit(participant)}
                            title="Edit Information"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost text-danger p-1"
                            onClick={() => handleDelete(participant)}
                            title="Delete Participant"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {Math.ceil(totalCount / pageSize) > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
              </div>
              <div className="pagination-controls">
                <button 
                  className="btn btn-sm btn-outline-secondary me-1"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => {
                  const totalPages = Math.ceil(totalCount / pageSize);
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm me-1 ${
                        currentPage === pageNum ? "btn-primary" : "btn-outline-secondary"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className="btn btn-sm btn-outline-secondary ms-1"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      
      <div className="action-section">
        <button className="btn btn-outline-primary">Export Report</button>
        <button className="btn btn-primary">Import Participants</button>
      </div>

      <ConfirmationModal
        show={!!participantToDelete}
        message={participantToDelete ? `Are you sure you want to delete "${participantToDelete.fullName}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
