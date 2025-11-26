import React from 'react';
import { Link } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = ({ results, onRetake }) => {
  // Safe data access with fallbacks
  const personalityType = results?.personalityType || 'Balanced Professional';
  const careerRecommendations = results?.careerRecommendations || [];
  const strengths = results?.strengths || [];
  const areasForDevelopment = results?.areasForDevelopment || [];
  const suggestedSkills = results?.suggestedSkills || [];
  const compatibilityScore = results?.compatibilityScore || 0;

  return (
    <div className="quiz-results">
      <div className="container">
        <div className="results-header">
          <h1>🎉 Your Career Assessment Results</h1>
          <p className="results-subtitle">
            Based on your answers, here are your personalized career recommendations
          </p>
        </div>

        {/* Personality Type */}
        <div className="result-section">
          <div className="section-header">
            <h2>Your Personality Type</h2>
          </div>
          <div className="personality-card">
            <div className="personality-badge">
              {personalityType}
            </div>
            <p className="personality-description">
              {getPersonalityDescription(personalityType)}
            </p>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="result-section">
          <div className="section-header">
            <h2>Career Recommendations</h2>
            <p>Roles that match your personality and interests</p>
          </div>
          <div className="career-grid">
            {careerRecommendations.length > 0 ? (
              careerRecommendations.map((career, index) => (
                <div key={index} className="career-card">
                  <div className="career-header">
                    <h3>{career.role}</h3>
                    <span className="match-badge">
                      {career.matchPercentage || 85}% match
                    </span>
                  </div>
                  <p className="career-field">{career.field}</p>
                  <p className="career-description">
                    {career.description || 'A great career path that aligns with your strengths and interests.'}
                  </p>
                  <div className="skills-section">
                    <strong>Key Skills:</strong>
                    <div className="skills-list">
                      {(career.skillsRequired || ['Communication', 'Problem Solving', 'Teamwork']).map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="growth-info">
                    <strong>Growth Prospects:</strong>
                    <p>{career.growthProspects || 'Strong growth potential with diverse opportunities.'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-careers">
                <p>No specific career recommendations available. Complete your profile for more personalized suggestions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Strengths & Development Areas */}
        <div className="result-section">
          <div className="two-column">
            <div className="column">
              <div className="section-header">
                <h3>🌟 Your Strengths</h3>
              </div>
              <div className="strengths-list">
                {strengths.length > 0 ? (
                  strengths.map((strength, index) => (
                    <div key={index} className="strength-item">
                      <span className="strength-icon">✓</span>
                      {strength}
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>Complete more questions to identify your strengths.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="column">
              <div className="section-header">
                <h3>📈 Areas for Development</h3>
              </div>
              <div className="development-list">
                {areasForDevelopment.length > 0 ? (
                  areasForDevelopment.map((area, index) => (
                    <div key={index} className="development-item">
                      <span className="development-icon">💡</span>
                      {area}
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>Keep learning and growing in your career journey.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Skills */}
        <div className="result-section">
          <div className="section-header">
            <h2>🛠️ Suggested Skills to Develop</h2>
          </div>
          <div className="skills-container">
            {suggestedSkills.length > 0 ? (
              suggestedSkills.map((skill, index) => (
                <div key={index} className="skill-card">
                  {skill}
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>Focus on developing core professional skills like communication and problem-solving.</p>
              </div>
            )}
          </div>
        </div>

        {/* Compatibility Score */}
        <div className="result-section">
          <div className="compatibility-card">
            <h3>Overall Compatibility Score</h3>
            <div className="score-circle">
              <div className="score-value">{compatibilityScore}%</div>
              <div className="score-label">Match</div>
            </div>
            <p className="score-description">
              This score represents how well your interests and skills align with your recommended career paths.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button onClick={onRetake} className="btn btn-secondary">
            🔄 Retake Quiz
          </button>
          <Link to="/mentors" className="btn btn-primary">
            👥 Find Mentors
          </Link>
          <Link to="/profile" className="btn btn-outline">
            👤 Complete Profile
          </Link>
          <Link to="/progress" className="btn btn-outline">
            📊 View Progress
          </Link>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>🚀 Next Steps</h3>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">👤</div>
              <h4>Complete Your Profile</h4>
              <p>Add your education, experience, and skills to get more personalized recommendations.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">👥</div>
              <h4>Connect with Mentors</h4>
              <p>Find experienced professionals in your recommended fields who can guide your career journey.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">📚</div>
              <h4>Explore Learning</h4>
              <p>Develop the skills needed for your target careers through curated learning resources.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get personality descriptions
const getPersonalityDescription = (type) => {
  const descriptions = {
    'Analytical Innovator': 'You thrive on solving complex problems and enjoy working with data and systems. Your logical approach makes you excellent at technical challenges.',
    'Creative Visionary': 'You bring innovative ideas to life and excel in artistic and design-oriented environments. Your imagination drives your success.',
    'Social Connector': 'You build strong relationships and excel in people-oriented roles. Your empathy and communication skills are your greatest assets.',
    'Strategic Planner': 'You excel at organizing complex projects and seeing the big picture. Your planning skills make you a natural leader.',
    'Inspiring Leader': 'You motivate others and drive teams toward success. Your charisma and vision inspire those around you.',
    'Hands-On Problem Solver': 'You enjoy practical work and solving tangible problems. Your technical skills and attention to detail are exceptional.',
    'Balanced Professional': 'You have a versatile skill set that allows you to adapt to various roles and challenges. Your flexibility is your strength.'
  };

  return descriptions[type] || 'You have a unique combination of skills and interests that can be applied to various career paths.';
};

export default QuizResults;