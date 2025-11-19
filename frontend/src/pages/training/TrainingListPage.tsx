import { Card, CardHeader, CardBody, StatCard } from "@/components/ui";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTrainings, searchTrainings, getActiveTrainings, deleteTraining } from "@/api/training";
import { NavigationRoutes } from "@/constants";
import { formatTableDate } from "@/utils/dateFormatter";
import type { TrainingResponseDto, PaginatedResponse } from "@/types";

export default function TrainingListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [trainings, setTrainings] = useState<TrainingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTrainingsCount, setActiveTrainingsCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [trainingToDelete, setTrainingToDelete] = useState<TrainingResponseDto | null>(null);
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

  // Fetch trainings data
  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response: PaginatedResponse<TrainingResponseDto>;
      
      if (searchTerm.trim()) {
        response = await searchTrainings(searchTerm, currentPage, pageSize);
      } else {
        response = await getTrainings(currentPage, pageSize);
      }
      
      setTrainings(response.data || []);
      setTotalCount(response.total || 0);
    } catch {
      setError("Failed to load trainings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  // Fetch active trainings for stats
  const fetchActiveTrainings = useCallback(async () => {
    try {
      const activeTrainings = await getActiveTrainings();
      setActiveTrainingsCount(activeTrainings.length);
    } catch {
      // Silently fail for stats
    }
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  useEffect(() => {
    fetchActiveTrainings();
  }, [fetchActiveTrainings]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (term.trim()) {
      try {
        setLoading(true);
        const response = await searchTrainings(term, 1, pageSize);
        setTrainings(response.data || []);
        setTotalCount(response.total || 0);
      } catch {
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      fetchTrainings();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate stats from the data
  const completedThisMonth = trainings.filter(t => 
    t.trainingStatus === "Completed" && 
    new Date(t.endDate).getMonth() === new Date().getMonth()
  ).length;

  const handleView = (training: TrainingResponseDto) => {
    navigate(NavigationRoutes.TRAINING_DETAILS(training.id));
  };

  const handleEdit = (training: TrainingResponseDto) => {
    navigate(NavigationRoutes.TRAINING_EDIT(training.id));
  };

  const handleDelete = (training: TrainingResponseDto) => {
    setTrainingToDelete(training);
  };

  const confirmDelete = async () => {
    if (!trainingToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTraining(trainingToDelete.id);
      setSuccessMessage(`Training "${trainingToDelete.program}" deleted successfully!`);
      setTrainingToDelete(null);
      fetchTrainings();
    } catch {
      setError("Failed to delete training. Please try again.");
      setTrainingToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setTrainingToDelete(null);
  };

  const handleCreate = () => {
    navigate(NavigationRoutes.TRAINING_CREATE);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in progress":
        return "badge badge-success";
      case "planning":
        return "badge badge-warning";
      case "completed":
        return "badge badge-secondary";
      default:
        return "badge badge-secondary";
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Training / Programs</h1>
        <p className="page-subtitle">Manage training courses and programs</p>
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
          title="Total Programs"
          value={totalCount}
          subtitle="Available trainings"
          color="primary"
          // trend={{ value: 15, isPositive: true }}
          icon="📚"
        />
        
        <StatCard
          title="Active Programs"
          value={activeTrainingsCount}
          subtitle="Currently running"
          color="success"
          // trend={{ value: 5, isPositive: true }}
          icon="▶️"
        />
        
        <StatCard
          title="Completed This Month"
          value={completedThisMonth}
          subtitle="Successfully completed"
          color="warning"
          icon="✅"
        />
      </div>
      
      <Card>
        <CardHeader 
          title="Trainings" 
          subtitle="View and manage all trainings"
          actions={
            <button className="btn btn-sm btn-primary" onClick={handleCreate}>
              ➕ Add Training
            </button>
          }
        />
        <CardBody>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <input 
              type="search" 
              placeholder="Search trainings..." 
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
                  <th>Program Details</th>
                  <th>Duration</th>
                  <th>Start Date</th>
                  <th>Institution</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <div className="d-flex justify-content-center align-items-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-2">Loading trainings...</span>
                      </div>
                    </td>
                  </tr>
                ) : trainings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm ? "No trainings found matching your search." : "No trainings found."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  trainings.map((training) => (
                    <tr key={training.id}>
                      <td>
                        <div>
                          <div className="fw-bold">{training.program}</div>
                          <div className="text-muted small">{training.modeOfStudy}</div>
                        </div>
                      </td>
                      <td>{training.duration} months</td>
                      <td>{formatTableDate(training.startDate)}</td>
                      <td>{training.institution}</td>
                      <td>{training.countryOfStudy}</td>
                      <td>
                        <span className={getStatusBadgeClass(training.trainingStatus)}>
                          {training.trainingStatus}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions d-flex gap-1">
                          <button 
                            className="btn btn-sm btn-ghost p-1"
                            onClick={() => handleView(training)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost p-1"
                            onClick={() => handleEdit(training)}
                            title="Edit Program"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost text-danger p-1"
                            onClick={() => handleDelete(training)}
                            title="Delete Program"
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
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
              </div>
              <div className="pagination-controls">
                <button 
                  className="btn btn-sm btn-outline-secondary me-1"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className="btn btn-sm btn-outline-secondary ms-1"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <ConfirmationModal
        show={!!trainingToDelete}
        message={trainingToDelete ? `Are you sure you want to delete "${trainingToDelete.program}" at ${trainingToDelete.institution}? This action cannot be undone.` : ""}
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

