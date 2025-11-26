import React from 'react';
import { Link } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <div className="role-header">
          <h1>🎯 Welcome to MindMatch</h1>
          <p>Choose how you want to access the platform</p>
        </div>

        <div className="role-options">
          {/* User Option */}
          <div className="role-option user-option">
            <div className="role-icon">👤</div>
            <div className="role-info">
              <h3>Career Seeker</h3>
              <p>Take career assessments, get personalized guidance, find mentors, and track your progress</p>
              <ul>
                <li>✓ Career Assessment Quiz</li>
                <li>✓ Personalized Recommendations</li>
                <li>✓ Mentor Matching</li>
                <li>✓ Progress Tracking</li>
              </ul>
            </div>
            <Link to="/login" className="role-btn user-btn">
              Continue as User
            </Link>
          </div>

          {/* Admin Option */}
          <div className="role-option admin-option">
            <div className="role-icon">🔐</div>
            <div className="role-info">
              <h3>Administrator</h3>
              <p>Manage platform users, mentorship requests, and system operations</p>
              <ul>
                <li>✓ User Management</li>
                <li>✓ Mentorship Request Approval</li>
                <li>✓ Platform Analytics</li>
                <li>✓ System Administration</li>
              </ul>
              <div className="admin-warning">
                ⚠️ Restricted access - Admin privileges required
              </div>
            </div>
            {/* CHANGED: Link to standalone-admin instead of admin/login */}
            <Link to="/standalone-admin" className="role-btn admin-btn">
              Admin Portal
            </Link>
          </div>
        </div>

        <div className="role-footer">
          <p>Not sure which to choose? <strong>Start as a User</strong> to explore career guidance features.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;