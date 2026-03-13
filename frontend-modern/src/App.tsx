import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import EventsPage from "./pages/Events";
import AttendancePage from "./pages/Attendance";
import ComplaintsPage from "./pages/Complaints";
import StudentsPage from "./pages/Students";
import FacultyPage from "./pages/Faculty";
import ResourcesPage from "./pages/Resources";
import CareerPage from "./pages/Career";
import AlumniPage from "./pages/Alumni";
import ClubsPage from "./pages/Clubs";
import AIToolsPage from "./pages/AITools";
import CampusMapPage from "./pages/CampusMap";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <FacultyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career"
            element={
              <ProtectedRoute>
                <CareerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni"
            element={
              <ProtectedRoute>
                <AlumniPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <ClubsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <ProtectedRoute>
                <AIToolsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campus-map"
            element={
              <ProtectedRoute>
                <CampusMapPage />
              </ProtectedRoute>
            }
          />
          {/* Catch all other routes and show dashboard shell */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="mb-4 rounded-full bg-slate-100 p-6">
                    <svg
                      className="h-12 w-12 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Coming Soon</h2>
                  <p className="mt-2 text-slate-600 max-w-sm">
                    This module is currently being migrated to the modern React frontend.
                  </p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
