import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/auth";
import { DashboardPage } from "@/pages/dashboard";
import { 
  ParticipantsListPage, 
  ParticipantCreatePage, 
  ParticipantDetailsPage, 
  ParticipantEditPage 
} from "@/pages/participants";
import { 
  TrainingListPage, 
  TrainingCreatePage, 
  TrainingDetailsPage, 
  TrainingEditPage 
} from "@/pages/training";
import { 
  EnrollmentCreatePage, 
  EnrollmentListPage, 
  EnrollmentViewPage, 
  EnrollmentEditPage 
} from "@/pages/enrollment";
import { ReportsPage } from "@/pages/reports";
import { ConfigurationPage } from "@/pages/configuration";
import { useAuth } from "@/hooks/useAuth";
import { NavigationRoutes } from "./constants";
import { AllowanceCreatePage, AllowanceListPage } from "./pages";

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Router>
      <ProtectedRoute>
        <Layout>
          <Routes>
            <Route path={NavigationRoutes.DASHBOARD} element={<DashboardPage />} />

            <Route path={NavigationRoutes.PARTICIPANTS} element={<ParticipantsListPage />} />
            <Route path={NavigationRoutes.PARTICIPANT_CREATE} element={<ParticipantCreatePage />} />
            <Route path="/participants/view/:id" element={<ParticipantDetailsPage />} />
            <Route path="/participants/edit/:id" element={<ParticipantEditPage />} />

            <Route path={NavigationRoutes.TRAININGS} element={<TrainingListPage />} />
            <Route path={NavigationRoutes.TRAINING_CREATE} element={<TrainingCreatePage />} />
            <Route path="/training/view/:id" element={<TrainingDetailsPage />} />
            <Route path="/training/edit/:id" element={<TrainingEditPage />} />

            <Route path={NavigationRoutes.ENROLLMENTS} element={<EnrollmentListPage />} />
            <Route path={NavigationRoutes.ENROLLMENT_CREATE} element={<EnrollmentCreatePage />} />
            <Route path="/enrollment/view/:id" element={<EnrollmentViewPage />} />
            <Route path="/enrollment/edit/:id" element={<EnrollmentEditPage />} />

            <Route path={NavigationRoutes.ALLOWANCES} element={<AllowanceListPage />} />
            <Route path={NavigationRoutes.ALLOWANCE_CREATE} element={<AllowanceCreatePage />} />

            <Route path={NavigationRoutes.REPORTS} element={<ReportsPage />} />

            <Route path={NavigationRoutes.CONFIGURATION} element={<ConfigurationPage />} />

            <Route path="/" element={<Navigate to={NavigationRoutes.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={NavigationRoutes.DASHBOARD} replace />} />
          </Routes>
        </Layout>
      </ProtectedRoute>
    </Router>
  );
}

export default App;

