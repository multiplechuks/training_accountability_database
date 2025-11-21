import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";

// Sample data for allowance dashboard
const sampleDashboardData = {
  totalAllowances: 156,
  totalAmount: 2750000.00,
  pendingApprovals: 23,
  paidThisMonth: 45,
  monthlyBudget: 500000.00,
  utilizationRate: 85.6,
  recentAllowances: [
    {
      pk: 1,
      participant: "John Doe",
      type: "Accommodation",
      amount: 5000.00,
      status: "Pending",
      date: "2024-09-01"
    },
    {
      pk: 2,
      participant: "Jane Smith",
      type: "Tuition Fee",
      amount: 15000.00,
      status: "Approved",
      date: "2024-09-02"
    },
    {
      pk: 3,
      participant: "Michael Johnson",
      type: "Transport",
      amount: 3000.00,
      status: "Paid",
      date: "2024-09-03"
    }
  ],
  allowanceByType: [
    { type: "Tuition Fee", amount: 1200000.00, count: 45 },
    { type: "Accommodation", amount: 800000.00, count: 67 },
    { type: "Meal Allowance", amount: 400000.00, count: 89 },
    { type: "Transport", amount: 250000.00, count: 78 },
    { type: "Study Materials", amount: 100000.00, count: 34 }
  ]
};

export default function AllowanceDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(sampleDashboardData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(sampleDashboardData);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BW", {
      style: "currency",
      currency: "BWP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "badge badge-success";
      case "approved":
        return "badge badge-primary";
      case "pending":
        return "badge badge-warning";
      default:
        return "badge badge-light";
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Allowance Dashboard</h1>
          <p className="page-subtitle">Overview of training allowances</p>
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
        <h1 className="page-title">Allowance Dashboard</h1>
        <p className="page-subtitle">Overview of training allowances and budget utilization</p>
      </div>

      {/* Key Metrics */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-3">
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
                  <p className="h4 mb-0">{dashboardData.totalAllowances}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
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
                  <p className="h4 mb-0">{formatAmount(dashboardData.totalAmount)}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Pending Approvals</p>
                  <p className="h4 mb-0">{dashboardData.pendingApprovals}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info me-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted small mb-1">Paid This Month</p>
                  <p className="h4 mb-0">{dashboardData.paidThisMonth}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="row mb-5">
        {/* Budget Utilization */}
        <div className="col-lg-6 mb-4">
          <Card>
            <CardHeader 
              title="Budget Utilization" 
              subtitle="Monthly budget usage and remaining funds"
            />
            <CardBody>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span className="small fw-medium text-muted">Monthly Budget</span>
                <span className="small fw-semibold">{formatAmount(dashboardData.monthlyBudget)}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span className="small fw-medium text-muted">Utilized</span>
                <span className="small fw-semibold">{formatAmount(dashboardData.monthlyBudget * (dashboardData.utilizationRate / 100))}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span className="small fw-medium text-muted">Remaining</span>
                <span className="small fw-semibold">{formatAmount(dashboardData.monthlyBudget * (1 - dashboardData.utilizationRate / 100))}</span>
              </div>
              <div className="progress mb-3" style={{ height: "8px" }}>
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar"
                  style={{ width: `${dashboardData.utilizationRate}%` }}
                  aria-valuenow={dashboardData.utilizationRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="text-center">
                <span className="h5 text-primary">{dashboardData.utilizationRate}%</span>
                <span className="text-muted small ms-1">utilized</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Allowance by Type */}
        <div className="col-lg-6 mb-4">
          <Card>
            <CardHeader 
              title="Allowances by Type" 
              subtitle="Distribution of allowances by category"
            />
            <CardBody>
              {dashboardData.allowanceByType.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <div className="small fw-medium">{item.type}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{item.count} allowances</div>
                  </div>
                  <div className="text-end">
                    <div className="small fw-semibold">{formatAmount(item.amount)}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {((item.amount / dashboardData.totalAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Allowances */}
      <Card>
        <CardHeader 
          title="Recent Allowances" 
          subtitle="Latest allowance requests and approvals"
        />
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentAllowances.map((allowance) => (
                  <tr key={allowance.pk}>
                    <td>
                      <div className="fw-medium">{allowance.participant}</div>
                    </td>
                    <td>
                      <div>{allowance.type}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{formatAmount(allowance.amount)}</div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(allowance.status)}>
                        {allowance.status}
                      </span>
                    </td>
                    <td>
                      <div>
                        {new Date(allowance.date).toLocaleDateString("en-GB")}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary">
                          View
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          Process
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-3 text-center">
            <button className="btn btn-link text-primary">
              View All Allowances →
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

