import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      <div className="container">
        {/* Header Section */}
        <div className="page-header">
          <h1>🚀 How MindMatch Works</h1>
          <p>Discover how our platform helps you find your ideal career path and connect with expert mentors</p>
          <div className="header-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/quiz" className="btn btn-secondary">
              Start Career Quiz
            </Link>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="overview-section">
          <h2>🎯 Quick Overview</h2>
          <div className="overview-cards">
            <div className="overview-card">
              <div className="card-icon">📝</div>
              <h3>Take Assessment</h3>
              <p>Complete our comprehensive career quiz to discover your strengths and interests</p>
            </div>
            <div className="overview-card">
              <div className="card-icon">👤</div>
              <h3>Build Profile</h3>
              <p>Create your professional profile with skills, education, and career goals</p>
            </div>
            <div className="overview-card">
              <div className="card-icon">🤝</div>
              <h3>Get Matched</h3>
              <p>Connect with mentors who match your career interests and aspirations</p>
            </div>
            <div className="overview-card">
              <div className="card-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your career development journey with real-time progress tracking</p>
            </div>
          </div>
        </div>



        {/* User Journey */}
        <div className="journey-section">
          <h2>🎯 User Journey</h2>
          <div className="journey-steps">
            <div className="journey-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up & Assessment</h3>
                <p>Create your account and complete the comprehensive career assessment quiz. Your answers are analyzed to understand your strengths, interests, and personality traits.</p>
                <ul>
                  <li>Data stored in Users collection</li>
                  <li>Quiz results processed by matching algorithm</li>
                  <li>Initial career recommendations generated</li>
                </ul>
              </div>
            </div>

            <div className="journey-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Profile Completion</h3>
                <p>Build your professional profile by adding skills, education background, work experience, and career interests. This enhances matching accuracy.</p>
                <ul>
                  <li>Profile data updated in real-time</li>
                  <li>Skills analyzed for gap identification</li>
                  <li>Progress tracking initialized</li>
                </ul>
              </div>
            </div>

            <div className="journey-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Mentor Matching</h3>
                <p>Our algorithm matches you with suitable mentors based on your career goals, skills, and interests. Browse profiles and request mentorship.</p>
                <ul>
                  <li>Real-time matching with Mentors collection</li>
                  <li>Request management system</li>
                  <li>Communication channel setup</li>
                </ul>
              </div>
            </div>

            <div className="journey-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Career Development</h3>
                <p>Continue your professional growth with mentor guidance, skill development, and career advancement opportunities tailored to your goals.</p>
                <ul>
                  <li>Personalized learning paths</li>
                  <li>Skill development tracking</li>
                  <li>Career milestone achievements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;