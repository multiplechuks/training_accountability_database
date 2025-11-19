import { Card, CardHeader, CardBody, StatCard, IconCard } from "@/components/ui";

export default function ReportsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">View training reports and performance analytics</p>
      </div>
      
      <div className="content-grid">
        <StatCard
          title="Training Completion Rate"
          value="87%"
          subtitle="Overall completion rate"
          color="success"
          trend={{ value: 5, isPositive: true }}
          icon="📊"
        />
        
        <StatCard
          title="Average Rating"
          value={4.2}
          subtitle="Training satisfaction"
          color="primary"
          trend={{ value: 0.3, isPositive: true }}
          icon="⭐"
        />
        
        <StatCard
          title="Training Hours"
          value="2,456"
          subtitle="Total training hours"
          color="info"
          trend={{ value: 12, isPositive: true }}
          icon="⏱️"
        />
        
        <StatCard
          title="Budget Utilization"
          value="BWP 1.2M"
          subtitle="Of BWP 1.5M allocated"
          color="warning"
          icon="💰"
        />
      </div>
      
      <Card>
        <CardHeader 
          title="Available Reports" 
          subtitle="Generate and download training reports"
        />
        <CardBody>
          <div className="content-grid">
            <IconCard
              title="Participant Reports"
              description="Individual participant progress and completion status"
              icon="👤"
              iconColor="primary"
              action={
                <button className="btn btn-primary w-100">
                  Generate Report
                </button>
              }
            />
            
            <IconCard
              title="Training Reports"
              description="Training program effectiveness and attendance"
              icon="📚"
              iconColor="success"
              action={
                <button className="btn btn-success w-100">
                  Generate Report
                </button>
              }
            />
            
            <IconCard
              title="Department Reports"
              description="Department-wise training participation"
              icon="🏢"
              iconColor="info"
              action={
                <button className="btn btn-info w-100">
                  Generate Report
                </button>
              }
            />
            
            <IconCard
              title="Financial Reports"
              description="Training costs and budget allocation"
              icon="💰"
              iconColor="warning"
              action={
                <button className="btn btn-warning w-100">
                  Generate Report
                </button>
              }
            />
            
            <IconCard
              title="Analytics Dashboard"
              description="Interactive charts and data visualization"
              icon="📈"
              iconColor="danger"
              action={
                <button className="btn btn-outline-danger w-100">
                  View Dashboard
                </button>
              }
            />
            
            <IconCard
              title="Custom Reports"
              description="Build your own custom reports with filters"
              icon="🔧"
              iconColor="primary"
              action={
                <button className="btn btn-outline-primary w-100">
                  Create Custom
                </button>
              }
            />
          </div>
        </CardBody>
      </Card>
      
      <div className="action-section">
        <button className="btn btn-outline-primary">Export All Data</button>
        <button className="btn btn-outline-secondary">Schedule Reports</button>
        <button className="btn btn-primary">Advanced Analytics</button>
      </div>
    </div>
  );
}

