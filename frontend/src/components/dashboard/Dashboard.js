import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExploreCourses = () => {
    // Redirect to courses page or show courses modal
    navigate('/courses');
    // Alternatively, you can show a modal with course recommendations
    // showCoursesModal();
  };

  const handleFindMentors = () => {
    // Redirect to mentors page or show mentors modal
    navigate('/mentors');
    // Alternatively, you can show a modal with mentor recommendations
    // showMentorsModal();
  };

  const handleCareerAssessment = () => {
    navigate('/quiz');
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="dashboard">
      <div className="container">
        {user ? (
          <>
            <div className="welcome-section">
              <h1>Welcome back, {user.name}! 👋</h1>
              <p>Ready to discover your ideal career path?</p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>🎯 Career Assessment</h3>
                <p>Take our intelligent quiz to discover careers that match your skills and interests.</p>
                <button onClick={handleCareerAssessment} className="btn btn-primary">
                  Start Quiz
                </button>
              </div>

              <div className="dashboard-card">
                <h3>📊 Your Profile</h3>
                <p>Complete your profile to get more personalized career recommendations.</p>
                <button onClick={handleUpdateProfile} className="btn btn-secondary">
                  Update Profile
                </button>
              </div>

              <div className="dashboard-card">
                <h3>📚 Learning Paths</h3>
                <p>Access curated courses and resources to develop your skills.</p>
                <button onClick={handleExploreCourses} className="btn btn-secondary">
                  Explore Courses
                </button>
              </div>

              <div className="dashboard-card">
                <h3>👥 Career Mentor</h3>
                <p>Connect with experienced professionals in your field of interest.</p>
                <button onClick={handleFindMentors} className="btn btn-secondary">
                  Find Mentors
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hero-section">
            <h1>Discover Your Perfect Career Path 🚀</h1>
            <p className="hero-subtitle">
              MindMatch uses AI-powered assessment to match you with careers that fit your unique skills, 
              interests, and personality. Get personalized recommendations and actionable guidance.
            </p>
            
            <div className="hero-features">
              <div className="feature">
                <h3>🎯 Smart Assessment</h3>
                <p>Gamified quiz that analyzes your strengths and preferences</p>
              </div>
              <div className="feature">
                <h3>📊 Personalized Results</h3>
                <p>Get career matches tailored specifically for you</p>
              </div>
              <div className="feature">
                <h3>📚 Learning Resources</h3>
                <p>Access courses from Udemy, Coursera, and more</p>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn btn-secondary">Already have an account? Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;