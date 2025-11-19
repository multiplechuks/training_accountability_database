import { Card, CardHeader, CardBody, StatCard, IconCard } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { NavigationRoutes } from "@/constants";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleNewEnrollment = () => {
    navigate(NavigationRoutes.ENROLLMENTS);
  };

  const handleAddParticipant = () => {
    navigate(NavigationRoutes.PARTICIPANTS);
  };

  const handleCreateTraining = () => {
    navigate(NavigationRoutes.TRAININGS);
  };

  const handleGenerateReport = () => {
    navigate(NavigationRoutes.REPORTS);
  };

  const handleManageParticipants = () => {
    navigate(NavigationRoutes.PARTICIPANTS);
  };

  const handleViewPrograms = () => {
    navigate(NavigationRoutes.TRAININGS);
  };

  const handleViewReports = () => {
    navigate(NavigationRoutes.REPORTS);
  };

  const handleConfigureSystem = () => {
    navigate(NavigationRoutes.CONFIGURATION);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Training Management Dashboard</h1>
        <p className="page-subtitle">Overview of the Republic of Botswana Ministry of Health Training System</p>
      </div>

      {/* Key Statistics */}
      <div className="content-grid">
        <StatCard
          title="Total Participants"
          value={"__"}
          subtitle="Registered participants"
          color="primary"
          trend={{ value: 12, isPositive: true }}
          icon="👥"
        />

        <StatCard
          title="Active Trainings"
          value={"~__"}
          subtitle="Currently running"
          color="success"
          trend={{ value: 8, isPositive: true }}
          icon="📚"
        />

        <StatCard
          title="Completion Rate"
          value="__%"
          subtitle="Overall completion rate"
          color="info"
          trend={{ value: 5, isPositive: true }}
          icon="✅"
        />

        <StatCard
          title="Budget Utilization"
          value="BWP __M"
          subtitle="Of BWP 1.5M allocated"
          color="warning"
          icon="💰"
        />
      </div>

      <div className="row">
        <div className="col-md-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader
              title="Recent Activities"
              subtitle="Latest system activities and updates"
            />
            <CardBody>
              <div className="activity-list">
                {/* <div className="activity-item">
                  <div className="activity-avatar">
                    <div className="avatar sm">KM</div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Keabetswe Mogale enrolled in Advanced Nursing Practices</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                  <div className="activity-badge">
                    <span className="badge badge-success">Enrolled</span>
                  </div>
                </div> */}
              </div>

              <div className="mt-3 text-center">
                <button className="btn btn-outline-primary">View All Activities</button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-4">
          {/* Quick Actions */}
          <Card className="mb-4">
            <CardHeader title="Quick Actions" subtitle="Common tasks and shortcuts" />
            <CardBody>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-primary w-100" onClick={handleNewEnrollment}>
                  📝 New Enrollment
                </button>
                <button className="btn btn-outline-primary w-100" onClick={handleAddParticipant}>
                  👤 Add Participant
                </button>
                <button className="btn btn-outline-secondary w-100" onClick={handleCreateTraining}>
                  📚 Create Training
                </button>
                <button className="btn btn-outline-info w-100" onClick={handleGenerateReport}>
                  📊 Generate Report
                </button>
              </div>
            </CardBody>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader title="System Status" subtitle="Current system health" />
            <CardBody>
              <div className="status-list">
                <div className="status-item">
                  <div className="status-indicator success"></div>
                  <div className="status-content">
                    <div className="status-title">Database</div>
                    <div className="status-value">Online</div>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-indicator success"></div>
                  <div className="status-content">
                    <div className="status-title">API Services</div>
                    <div className="status-value">Operational</div>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-indicator warning"></div>
                  <div className="status-content">
                    <div className="status-title">Storage</div>
                    <div className="status-value">82% Used</div>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-indicator success"></div>
                  <div className="status-content">
                    <div className="status-title">Backup</div>
                    <div className="status-value">Last: 2 hrs ago</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="row mt-4">
        <Card>
          <CardHeader
            title="System Features"
            subtitle="Explore the main features of the training management system"
          />
          <CardBody>
            <div className="content-grid">
              <IconCard
                title="Participant Management"
                description="Register, manage, and track training participants"
                icon="👤"
                iconColor="primary"
                value="__ participants"
                action={
                  <button className="btn btn-outline-primary btn-sm w-100" onClick={handleManageParticipants}>
                    Manage Participants
                  </button>
                }
              />

              <IconCard
                title="Trainings"
                description="Create, schedule, and monitor trainings"
                icon="📖"
                iconColor="success"
                value="__ active programs / trainings"
                action={
                  <button className="btn btn-outline-success btn-sm w-100" onClick={handleViewPrograms}>
                    View Programs / Trainings
                  </button>
                }
              />

              <IconCard
                title="Enrollment System"
                description="Streamlined participant enrollment process"
                icon="📝"
                iconColor="info"
                value="__ enrollments"
                action={
                  <button className="btn btn-outline-info btn-sm w-100" onClick={handleNewEnrollment}>
                    New Enrollment
                  </button>
                }
              />

              <IconCard
                title="Reports & Analytics"
                description="Comprehensive reporting and data analysis"
                icon="📊"
                iconColor="warning"
                value="__ report types"
                action={
                  <button className="btn btn-outline-warning btn-sm w-100" onClick={handleViewReports}>
                    View Reports
                  </button>
                }
              />

              <IconCard
                title="System Configuration"
                description="Manage system settings and lookup data"
                icon="⚙️"
                iconColor="danger"
                value="__ categories"
                action={
                  <button className="btn btn-outline-danger btn-sm w-100" onClick={handleConfigureSystem}>
                    Configure System
                  </button>
                }
              />

              <IconCard
                title="User Management"
                description="Control user access and permissions"
                icon="🔐"
                iconColor="primary"
                value="__ users"
                action={
                  <button className="btn btn-outline-primary btn-sm w-100">
                    Manage Users
                  </button>
                }
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

