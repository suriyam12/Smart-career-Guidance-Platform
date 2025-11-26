import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MentorProfile.css';

const MentorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mentor } = location.state || {};

  if (!mentor) {
    return (
      <div className="mentor-profile-container">
        <div className="container">
          <div className="error-message">
            <h2>Mentor Not Found</h2>
            <p>Please go back and select a mentor to view their profile.</p>
            <button onClick={() => navigate('/mentors')} className="btn btn-primary">
              Back to Mentors
            </button>
          </div>
        </div>
      </div>
    );
  }

  const requestMentorship = () => {
    alert(`Mentorship request sent to ${mentor.name}`);
  };

  return (
    <div className="mentor-profile-container">
      <div className="container">
        <button onClick={() => navigate('/mentors')} className="back-btn">
          ← Back to Mentors
        </button>

        <div className="mentor-profile-header">
          <div className="profile-main">
            <img src={mentor.avatar} alt={mentor.name} className="profile-avatar-large" />
            <div className="profile-info">
              <h1>{mentor.name}</h1>
              <p className="profile-title">{mentor.title}</p>
              <div className="profile-stats">
                <span>⭐ {mentor.rating} Rating</span>
                <span>👥 {mentor.sessions} Sessions</span>
                <span>📅 {mentor.experience} Experience</span>
                <span className={`availability ${mentor.availability === 'Available' ? 'available' : 'limited'}`}>
                  {mentor.availability === 'Available' ? '✅ Available' : '🟡 Limited'}
                </span>
              </div>
              <div className="profile-rate">
                <span className="hourly-rate">{mentor.hourlyRate}/hour</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button onClick={requestMentorship} className="btn btn-primary btn-large">
              Request Mentorship Session
            </button>
            <div className="contact-links">
              {mentor.linkedin && (
                <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                  LinkedIn
                </a>
              )}
              {mentor.website && (
                <a href={mentor.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>About</h2>
            <p className="profile-bio">{mentor.bio}</p>
          </div>

          <div className="profile-section">
            <h2>Specializations</h2>
            <div className="specialization-tags">
              {mentor.specialization.map((skill, index) => (
                <span key={index} className="specialization-tag">{skill}</span>
              ))}
            </div>
          </div>

          {mentor.achievements && (
            <div className="profile-section">
              <h2>Achievements</h2>
              <ul className="achievements-list">
                {mentor.achievements.map((achievement, index) => (
                  <li key={index}>🏆 {achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {mentor.education && (
            <div className="profile-section">
              <h2>Education</h2>
              <p>{mentor.education}</p>
            </div>
          )}

          {mentor.languages && (
            <div className="profile-section">
              <h2>Languages & Technologies</h2>
              <div className="skills-grid">
                {mentor.languages.map((language, index) => (
                  <span key={index} className="skill-item">{language}</span>
                ))}
              </div>
            </div>
          )}

          {mentor.tools && (
            <div className="profile-section">
              <h2>Tools & Platforms</h2>
              <div className="skills-grid">
                {mentor.tools.map((tool, index) => (
                  <span key={index} className="skill-item">{tool}</span>
                ))}
              </div>
            </div>
          )}

          <div className="profile-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <p><strong>Platform:</strong> {mentor.platform}</p>
              <p><strong>Company:</strong> {mentor.company}</p>
              <p><strong>Domain:</strong> {mentor.domain}</p>
              {mentor.email && <p><strong>Email:</strong> {mentor.email}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;