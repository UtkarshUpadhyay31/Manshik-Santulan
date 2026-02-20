import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Notification } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import MentorList from './pages/MentorList';
import TherapistList from './pages/TherapistList';
import ProfessionalProfile from './pages/ProfessionalProfile';
import Navbar from './components/Navbar';
import StreakBar from './components/StreakBar';
import SessionPage from './pages/SessionPage';
import GamesPage from './pages/GamesPage';
import FocusGame from './components/games/FocusGame';
import MemoryGame from './components/games/MemoryGame';
import EmotionBalanceGame from './components/games/EmotionBalanceGame';
import MoodCatcherGame from './components/games/MoodCatcherGame';
import RewardsPage from './pages/RewardsPage';

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
  const isGamePath = location.pathname.startsWith('/games/');

  // Show navbar only on specific pages (not dashboard, not auth, not admin, not active games)
  const showNavbar = !['/dashboard'].includes(location.pathname) && !isAdminPath && !isAuthPath && !isGamePath;

  // Show streak banner on all authenticated pages except auth and games
  const showStreakBanner = !isAdminPath && !isAuthPath && !isGamePath;

  return (
    <>
      <Notification />
      {showNavbar && <Navbar />}
      {showStreakBanner && (
        <div className={showNavbar ? 'mt-20' : ''}>
          <StreakBar />
        </div>
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/help" element={<Help />} />

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
        <Route path="/games" element={
          <ProtectedRoute>
            <GamesPage />
          </ProtectedRoute>
        } />
        <Route path="/games/focus" element={
          <ProtectedRoute>
            <FocusGame />
          </ProtectedRoute>
        } />
        <Route path="/games/memory" element={
          <ProtectedRoute>
            <MemoryGame />
          </ProtectedRoute>
        } />
        <Route path="/games/breathing" element={
          <ProtectedRoute>
            <EmotionBalanceGame />
          </ProtectedRoute>
        } />
        <Route path="/games/mood" element={
          <ProtectedRoute>
            <MoodCatcherGame />
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
        <Route path="/rewards" element={
          <ProtectedRoute>
            <RewardsPage />
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
