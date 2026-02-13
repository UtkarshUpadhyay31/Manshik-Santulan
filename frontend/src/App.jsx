import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Notification } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import HelpPage from './pages/HelpPage';
import MentorList from './pages/MentorList';
import TherapistList from './pages/TherapistList';
import ProfessionalProfile from './pages/ProfessionalProfile';
import Navbar from './components/Navbar';
import SessionPage from './pages/SessionPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin Panel
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import { AdminUsers, AdminMentors, AdminBlogs, AdminReports } from './pages/AdminViews';
import AdminAIDashboard from './pages/AdminAIDashboard';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  // Show navbar only on specific pages (not dashboard, not auth, not admin)
  const showNavbar = !['/dashboard'].includes(location.pathname) && !isAdminPath && !isAuthPath;

  return (
    <>
      <Notification />
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/403" element={<UnauthorizedPage />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/mentors" element={
          <ProtectedRoute>
            <MentorList />
          </ProtectedRoute>
        } />
        <Route path="/therapists" element={
          <ProtectedRoute>
            <TherapistList />
          </ProtectedRoute>
        } />
        <Route path="/professional/:id" element={
          <ProtectedRoute>
            <ProfessionalProfile />
          </ProtectedRoute>
        } />
        <Route path="/session/:id" element={
          <ProtectedRoute>
            <SessionPage />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="mentors" element={<AdminMentors />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="analytics" element={<AdminReports />} />
          <Route path="ai-coach" element={<AdminAIDashboard />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}


export default App;
