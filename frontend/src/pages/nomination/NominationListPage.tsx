import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getInProgressEnrollments, getEnrollmentStatistics, cancelEnrollment } from "../../api/nomination";
import type { EnrollmentProgressSummaryDto, EnrollmentStatistics } from "../../types/nomination";

const getErrorMessage = (err: unknown) => {
    if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        return response?.data?.message;
    }
    return err instanceof Error ? err.message : undefined;
};

export default function NominationListPage() {
    const navigate = useNavigate();
    const [allEnrollments, setAllEnrollments] = useState<EnrollmentProgressSummaryDto[]>([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentProgressSummaryDto[]>([]);
    const [statistics, setStatistics] = useState<EnrollmentStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [enrollmentsData, statsData] = await Promise.all([
                getInProgressEnrollments("All"), // Load all enrollments
                getEnrollmentStatistics()
            ]);

            setAllEnrollments(enrollmentsData.enrollments);
            setFilteredEnrollments(enrollmentsData.enrollments);
            setStatistics(statsData);
        } catch (err: unknown) {
            setError(getErrorMessage(err) || "Failed to load nominations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        // Filter enrollments client-side
        if (statusFilter === "") {
            setFilteredEnrollments(allEnrollments);
        } else {
            setFilteredEnrollments(allEnrollments.filter(e => e.status === statusFilter));
        }
    }, [statusFilter, allEnrollments]);

    const handleStartNew = () => {
        navigate("/nomination/start");
    };

    const handleViewProgress = (progressId: number) => {
        navigate(`/nomination/progress/${progressId}`);
    };

    const handleCancelEnrollment = async (progressId: number, participantName: string) => {
        if (!confirm(`Are you sure you want to cancel the enrollment for ${participantName}?`)) {
            return;
        }

        try {
            await cancelEnrollment(progressId, { reason: "Cancelled by user" });
            loadData(); // Reload the list
        } catch (err: unknown) {
            alert(getErrorMessage(err) || "Failed to cancel enrollment");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "In Progress":
                return "badge bg-primary";
            case "Completed":
                return "badge bg-success";
            case "Cancelled":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const getStepName = (step: number) => {
        const steps = [
            "Participant Profile",
            "Next of Kin",
            "Nomination",
            "Admission",
            "Training Costs",
            "Extension",
            "Completion"
        ];
        return steps[step - 1] || "Unknown";
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Enrollment Nominations</h1>
                <button className="btn btn-primary" onClick={handleStartNew}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Start New Nomination
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Statistics Cards */}
            {statistics && (
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total</h5>
                                <p className="card-text display-6">{statistics.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-primary">
                            <div className="card-body">
                                <h5 className="card-title text-primary">In Progress</h5>
                                <p className="card-text display-6">{statistics.inProgress}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-success">
                            <div className="card-body">
                                <h5 className="card-title text-success">Completed</h5>
                                <p className="card-text display-6">{statistics.completed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-danger">
                            <div className="card-body">
                                <h5 className="card-title text-danger">Cancelled</h5>
                                <p className="card-text display-6">{statistics.cancelled}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="mb-3">
                <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
                <select
                    id="statusFilter"
                    className="form-select"
                    style={{ maxWidth: "200px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Enrollments Table */}
            {filteredEnrollments.length === 0 ? (
                <div className="alert alert-info">
                    {statusFilter ? `No nominations found with status: ${statusFilter}` : "No nominations found"}
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Participant</th>
                                <th>Current Step</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.map((enrollment) => (
                                <tr key={enrollment.progressId}>
                                    <td>
                                        <strong>{enrollment.participantName}</strong>
                                        <br />
                                        <small className="text-muted">ID: {enrollment.participantId}</small>
                                    </td>
                                    <td>
                                        Step {enrollment.currentStep}: {getStepName(enrollment.currentStep)}
                                    </td>
                                    <td>
                                        <div className="progress" style={{ height: "25px" }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${enrollment.percentComplete}%` }}
                                                aria-valuenow={enrollment.percentComplete}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                {enrollment.percentComplete}%
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={getStatusBadgeClass(enrollment.status)}>
                                            {enrollment.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(enrollment.lastUpdated)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleViewProgress(enrollment.progressId)}
                                        >
                                            {enrollment.status === "In Progress" ? "Continue" : "View"}
                                        </button>
                                        {enrollment.status === "In Progress" && (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleCancelEnrollment(enrollment.progressId, enrollment.participantName)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
