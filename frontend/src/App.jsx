import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Notification } from './components/Toast';
// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import HelpPage from './pages/HelpPage';
import MentorList from './pages/MentorList';
import TherapistList from './pages/TherapistList';
import ProfessionalProfile from './pages/ProfessionalProfile';
import Navbar from './components/Navbar';
import SessionPage from './pages/SessionPage';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/dashboard';

  return (
    <>
      <Notification />
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes - No auth required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/mentors" element={<MentorList />} />
        <Route path="/therapists" element={<TherapistList />} />
        <Route path="/professional/:id" element={<ProfessionalProfile />} />
        <Route path="/session/:id" element={<SessionPage />} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;
