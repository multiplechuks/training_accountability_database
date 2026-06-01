import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/auth";
import { DashboardPage } from "@/pages/dashboard";
import {
  ParticipantsListPage,
  ParticipantCreatePage,
  ParticipantDetailsPage,
  ParticipantEditPage,
  ParticipantHistoryPage,
} from "@/pages/participants";
import { 
  TrainingListPage, 
  TrainingCreatePage, 
  TrainingDetailsPage, 
  TrainingEditPage 
} from "@/pages/training";
import {
  AdmissionCreatePage,
  AdmissionListPage,
  AdmissionViewPage,
  AdmissionEditPage,
} from "@/pages/admission";
import NominationListPage from "@/pages/nomination/NominationListPage";
import NominationStartPage from "@/pages/nomination/NominationStartPage";
import NominationProgressPage from "@/pages/nomination/NominationProgressPage";
import NominationViewPage from "@/pages/nomination/NominationViewPage";
import { ReportsPage } from "@/pages/reports";
import { ConfigurationPage, NominatedProgramsPage, AdmissionProgramsPage } from "@/pages/configuration";
import { LoadingSpinner } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { NavigationRoutes } from "./constants";
import { AllowanceCreatePage, AllowanceListPage } from "./pages";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

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
            <Route path={NavigationRoutes.PARTICIPANT_HISTORY} element={<ParticipantHistoryPage />} />
            <Route path="/participants/view/:id" element={<ParticipantDetailsPage />} />
            <Route path="/participants/edit/:id" element={<ParticipantEditPage />} />

            <Route path={NavigationRoutes.TRAININGS} element={<TrainingListPage />} />
            <Route path={NavigationRoutes.TRAINING_CREATE} element={<TrainingCreatePage />} />
            <Route path="/training/view/:id" element={<TrainingDetailsPage />} />
            <Route path="/training/edit/:id" element={<TrainingEditPage />} />

            <Route path={NavigationRoutes.ADMISSIONS} element={<AdmissionListPage />} />
            <Route path={NavigationRoutes.ADMISSION_CREATE} element={<AdmissionCreatePage />} />
            <Route path="/admission/view/:id" element={<AdmissionViewPage />} />
            <Route path="/admission/edit/:id" element={<AdmissionEditPage />} />
            <Route path="/training/enroll/:nominationId" element={<AdmissionCreatePage />} />

            <Route path="/nomination/list" element={<NominationListPage />} />
            <Route path="/nomination/start" element={<NominationStartPage />} />
            <Route path="/nomination/view/:id" element={<NominationViewPage />} />
            <Route path="/nomination/progress/:progressId" element={<NominationProgressPage />} />

            <Route path={NavigationRoutes.ALLOWANCES} element={<AllowanceListPage />} />
            <Route path={NavigationRoutes.ALLOWANCE_CREATE} element={<AllowanceCreatePage />} />

            <Route path={NavigationRoutes.REPORTS} element={<ReportsPage />} />

            <Route path={NavigationRoutes.CONFIGURATION} element={<ConfigurationPage />} />
            <Route path="/configuration/nominated-programs" element={<NominatedProgramsPage />} />
            <Route path="/configuration/admission-programs" element={<AdmissionProgramsPage />} />

            <Route path="/" element={<Navigate to={NavigationRoutes.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={NavigationRoutes.DASHBOARD} replace />} />
          </Routes>
        </Layout>
      </ProtectedRoute>
    </Router>
  );
}

export default App;

