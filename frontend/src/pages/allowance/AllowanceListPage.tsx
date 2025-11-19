import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import type { AllowanceResponseDto } from "@/types";
import { useNavigate } from "react-router-dom";
import { NavigationRoutes } from "@/constants";
import { getAllowances } from "@/api/allowance";

export default function AllowanceListPage() {
  const [allowances, setAllowances] = useState<AllowanceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch allowances from API
  useEffect(() => {
    const fetchAllowances = async () => {
      setLoading(true);
      try {
        const response = await getAllowances(currentPage, itemsPerPage, searchTerm || undefined);
        setAllowances(response.data);
        setTotalCount(response.totalCount);
      } catch {
        // Set empty array on error
        setAllowances([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAllowances();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleCreateAllowance = () => {
    navigate(NavigationRoutes.ALLOWANCE_CREATE);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "badge badge-success";
      case "approved":
        return "badge badge-primary";
      case "pending":
        return "badge badge-warning";
      case "rejected":
        return "badge badge-danger";
      case "on hold":
        return "badge badge-secondary";
      default:
        return "badge badge-light";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BW", {
      style: "currency",
      currency: "BWP"
    }).format(amount);
  };

  const getTotalAmount = () => {
    return allowances.reduce((total, allowance) => total + allowance.amount, 0);
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Training Allowances</h1>
          <p className="page-subtitle">Manage participant allowances</p>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "16rem" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Training Allowances</h1>
        <p className="page-subtitle">Manage participant allowances</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Total Allowances</p>
                  <p className="h4 mb-0">{allowances.length}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-3 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Total Amount</p>
                  <p className="h4 mb-0">{formatAmount(getTotalAmount())}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-3 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Pending</p>
                  <p className="h4 mb-0">
                    {allowances.filter(a => a.allowanceStatus?.name.toLowerCase() === "pending").length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-3 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Paid</p>
                  <p className="h4 mb-0">
                    {allowances.filter(a => a.allowanceStatus?.name.toLowerCase() === "paid").length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div className="d-flex flex-wrap gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search allowances..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={handleCreateAllowance}>
            + New Allowance
          </button>
          <button className="btn btn-secondary">
            Export Data
          </button>
        </div>
      </div>
      
      <Card>
        <CardHeader 
          title="Allowance Records" 
          subtitle={`${allowances.length} allowances found`}
        />
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Training Program</th>
                  <th>Allowance Type</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allowances.map((allowance) => (
                  <tr key={allowance.pk}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center">
                            <span className="small fw-semibold">
                              {allowance.participant?.firstName?.[0]}{allowance.participant?.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="fw-medium">
                            {allowance.participant?.firstName} {allowance.participant?.lastName}
                          </div>
                          <div className="text-muted small">
                            {allowance.participant?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">
                          {allowance.training?.title}
                        </div>
                        <div className="text-muted small">
                          {allowance.training?.venue}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">
                          {allowance.allowanceType?.name}
                        </div>
                        <div className="text-muted small">
                          {allowance.allowanceType?.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">
                        {formatAmount(allowance.amount)}
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        {formatDate(allowance.startDate)} - {formatDate(allowance.endDate)}
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(allowance.allowanceStatus?.name || "")}>
                        {allowance.allowanceStatus?.name}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary">
                          View
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          Process
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline-secondary"
              >
                Previous
              </button>
              
              <div className="d-flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn btn-sm ${
                      currentPage === page
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline-secondary"
              >
                Next
              </button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

