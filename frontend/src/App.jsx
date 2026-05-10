import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItineraryPage from './pages/ItineraryPage';
import MyTrips from './pages/MyTrips';
import SharedItineraryPage from './pages/SharedItineraryPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import TripNotes from './pages/TripNotes';
import ProfilePage from './pages/ProfilePage';
import BudgetAnalyticsPage from './pages/BudgetAnalyticsPage';
import PackingChecklistPage from './pages/PackingChecklistPage';

function ItineraryPageWrapper() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }
  return <ItineraryPage user={user} onLogout={handleLogout} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          {/* /signup redirects to /login?tab=signup */}
          <Route path="/signup" element={<Navigate to="/login?tab=signup" replace />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:tripId/builder"
            element={
              <ProtectedRoute>
                <ItineraryPageWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:tripId/budget"
            element={
              <ProtectedRoute>
                <BudgetAnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/share/:token" element={<SharedItineraryPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <TripNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packing"
            element={
              <ProtectedRoute>
                <PackingChecklistPage />
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
