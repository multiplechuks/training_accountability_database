import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { NavigationRoutes } from "@/constants";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { getEnrollments } from "@/api/enrollment";
import type { ParticipantEnrollmentResponseDto } from "@/types";

export default function EnrollmentListPage() {
  const [enrollments, setEnrollments] = useState<ParticipantEnrollmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Fetch enrollments from API
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getEnrollments(currentPage, itemsPerPage);
        setEnrollments(response.data || []);
        setTotalCount(response.total || response.data?.length || 0);
      } catch (err: any) {
        console.error("Error fetching enrollments:", err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          "Failed to load enrollments. Please try again."
        );
        setEnrollments([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [currentPage, itemsPerPage]);

  // Calculate pagination - since API returns paginated data, we use the enrollments as-is
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, totalCount);

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCreateEnrollment = () => {
    navigate(NavigationRoutes.ENROLLMENT_CREATE);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "badge badge-success";
      case "completed":
        return "badge badge-secondary";
      case "pending":
        return "badge badge-warning";
      case "cancelled":
        return "badge badge-danger";
      default:
        return "badge badge-secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Training Enrollments</h1>
          <p className="page-subtitle">Manage participant enrollments</p>
        </div>
        <div className="d-flex justify-content-center align-items-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading enrollments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Training Enrollments</h1>
        <p className="page-subtitle">Manage participant enrollments</p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <Card>
        <CardHeader
          title="Enrollment Records"
          subtitle={`${totalCount} total enrollments`}
          actions={
            <button className="btn btn-primary" onClick={handleCreateEnrollment}>
              Enrol
            </button>
          }
        />
        <CardBody>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <input
              type="search"
              placeholder="Search enrollments..."
              className="form-input"
              style={{ maxWidth: "300px" }}
            />
          </div>

          <div className="table-container">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Training Program</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Study Period</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No enrollments found
                      </div>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enrollment) => (
                  <tr key={enrollment.pk}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar me-3">
                          {enrollment.participant?.firstname?.[0]}{enrollment.participant?.lastname?.[0]}
                        </div>
                        <div>
                          <div className="fw-bold">
                            {enrollment.participant?.fullName}
                          </div>
                          <div className="text-muted small">
                            {enrollment.participant?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{enrollment.training?.program}</div>
                        <div className="text-muted small">{enrollment.training?.institution}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{enrollment.duration} months</div>
                        <div className="text-muted small">{enrollment.modeOfStudy}</div>
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(enrollment.trainingStatus)}>
                        {enrollment.trainingStatus}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div>{formatDate(enrollment.startDate)} - {formatDate(enrollment.endDate)}</div>
                        <div className="text-muted small">
                          Study Leave: {enrollment.studyLeaveDate && formatDate(enrollment.studyLeaveDate)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-sm btn-ghost text-primary p-1" 
                          title="View Details"
                          aria-label="View enrollment details"
                          onClick={() => navigate(NavigationRoutes.ENROLLMENT_DETAILS(enrollment.pk!))}
                        >
                          👁️
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost text-success p-1" 
                          title="Manage Allowances"
                          aria-label="Manage allowances"
                          onClick={() => navigate(`/allowances/create?participantId=${enrollment.participant?.pk}&trainingId=${enrollment.training?.pk}`)}
                        >
                          💰
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost p-1" 
                          title="Edit Enrollment"
                          aria-label="Edit enrollment"
                          onClick={() => navigate(NavigationRoutes.ENROLLMENT_EDIT(enrollment.pk!))}
                        >
                          ✏️
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
                Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalCount} entries
              </div>
              <div className="pagination-controls">
                <button
                  className="btn btn-sm btn-outline-secondary me-1"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
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
                      className={`btn btn-sm me-1 ${currentPage === pageNum ? "btn-primary" : "btn-outline-secondary"
                        }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="btn btn-sm btn-outline-secondary ms-1"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
