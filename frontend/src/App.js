import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import RoleSelection from './components/auth/RoleSelection';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import Quiz from './components/quiz/Quiz';
import QuizHistory from './components/quiz/QuizHistory';
import Profile from './components/profile/Profile';
import Courses from './components/courses/Courses';
import Mentors from './components/mentors/Mentors';
import MentorProfile from './components/mentors/MentorProfile';
import Progress from './components/progress/Progress';
import HowItWorks from './components/howitworks/HowItWorks';
import StandaloneAdminLogin from './components/admin/StandaloneAdminLogin';
import StandaloneAdminDashboard from './components/admin/StandaloneAdminDashboard';
import MyRequests from './components/mentors/MyRequests';

import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Standalone Admin Route (completely separate from user auth)
const StandaloneAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check standalone admin session (completely separate from user auth)
    const adminSession = JSON.parse(sessionStorage.getItem('adminSession'));
    setIsAdmin(!!(adminSession && adminSession.isAdmin));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }
  
  return isAdmin ? children : <Navigate to="/standalone-admin" replace />;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// Public Standalone Admin Route (redirect to admin dashboard if already logged in as admin)
const PublicStandaloneAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check standalone admin session
    const adminSession = JSON.parse(sessionStorage.getItem('adminSession'));
    setIsAdmin(!!(adminSession && adminSession.isAdmin));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }
  
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

// Component to conditionally show header and footer
function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if we're on admin pages - more specific check
  const isAdminPage = location.pathname.startsWith('/admin/') || 
                      location.pathname === '/standalone-admin' ||
                      location.pathname.includes('admin');

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading MindMatch...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Completely hide header on admin pages */}
      {!isAdminPage && <Header />}
      
      <main className="main-content">
        <Routes>
          {/* Root path - Show role selection page */}
          <Route path="/" element={<RoleSelection />} />
          
          {/* Public routes - redirect to dashboard if already logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* Standalone Admin routes - completely separate from user auth */}
          <Route path="/standalone-admin" element={
            <PublicStandaloneAdminRoute>
              <StandaloneAdminLogin />
            </PublicStandaloneAdminRoute>
          } />
          <Route path="/admin/dashboard" element={
            <StandaloneAdminRoute>
              <StandaloneAdminDashboard />
            </StandaloneAdminRoute>
          } />
          
          {/* Protected routes - redirect to login if not authenticated */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/quiz-history" element={
            <ProtectedRoute>
              <QuizHistory />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } />
          <Route path="/mentors" element={
            <ProtectedRoute>
              <Mentors />
            </ProtectedRoute>
          } />
          <Route path="/mentor-profile" element={
            <ProtectedRoute>
              <MentorProfile />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/how-it-works" element={
            <ProtectedRoute>
              <HowItWorks />
            </ProtectedRoute>
          } />
          <Route path="/my-requests" element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Completely hide footer on admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;