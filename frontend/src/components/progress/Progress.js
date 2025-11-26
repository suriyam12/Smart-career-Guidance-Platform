import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI, mentorsAPI, quizAPI } from '../../services/api';
import './Progress.css';

const Progress = () => {
  const [progress, setProgress] = useState({
    quizCompleted: 0,
    profileCompleted: 0,
    skillsAdded: 0,
    mentorsConnected: 0,
    coursesEnrolled: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataVersion, setDataVersion] = useState(0); // Force re-render when data changes
  const { user } = useAuth();

  // Real-time progress tracking
  useEffect(() => {
    fetchProgress();
    
    // Set up interval to refresh progress every 60 seconds (less frequent)
    const interval = setInterval(fetchProgress, 60000);
    
    return () => clearInterval(interval);
  }, [user, dataVersion]); // Add dataVersion as dependency

  const fetchProgress = async () => {
    try {
      console.log('🔄 Fetching progress data...');
      setLoading(true);
      
      // Use Promise.allSettled to handle API failures gracefully
      const [profileResponse, mentorResponse, quizResponse] = await Promise.allSettled([
        profileAPI.getProfile(),
        mentorsAPI.getMyRequests(),
        quizAPI.getHistory()
      ]);

      console.log('📊 API Responses Status:', {
        profile: profileResponse.status,
        mentor: mentorResponse.status,
        quiz: quizResponse.status
      });

      let quizCompleted = 0;
      let profileCompleted = 0;
      let skillsAdded = 0;
      let mentorsConnected = 0;

      // 1. Check Quiz Completion - Multiple reliable methods
      quizCompleted = await checkQuizCompletion(quizResponse, user);
      console.log('✅ Final Quiz Completion:', quizCompleted);

      // 2. Check Profile Completion
      const profileData = await getProfileData(profileResponse, user);
      profileCompleted = calculateProfileCompletion(profileData);
      skillsAdded = calculateSkillsProgress(profileData.skills || []);
      console.log('✅ Profile Completion:', profileCompleted);

      // 3. Check Mentor Connections
      mentorsConnected = await checkMentorConnections(mentorResponse);
      console.log('✅ Mentor Connections:', mentorsConnected);

      const progressData = {
        quizCompleted,
        profileCompleted,
        skillsAdded,
        mentorsConnected,
        coursesEnrolled: 0 // Static for now
      };
      
      console.log('🎯 Final Progress Data:', progressData);
      setProgress(progressData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('❌ Error in fetchProgress:', error);
      // Use stable fallback calculation
      const fallbackProgress = calculateStableProgress(user);
      setProgress(fallbackProgress);
    } finally {
      setLoading(false);
    }
  };

  // Reliable quiz completion check
  const checkQuizCompletion = async (quizResponse, userData) => {
    try {
      // Method 1: Check quiz history API
      if (quizResponse.status === 'fulfilled' && quizResponse.value.success) {
        const hasQuizHistory = quizResponse.value.history?.length > 0;
        if (hasQuizHistory) {
          console.log('📝 Quiz completed (from history API)');
          return 100;
        }
      }

      // Method 2: Check user quiz results
      const hasUserQuizResults = userData?.quizResults?.length > 0;
      if (hasUserQuizResults) {
        console.log('📝 Quiz completed (from user data)');
        return 100;
      }

      // Method 3: Check localStorage as backup
      const localQuizData = localStorage.getItem('quiz_completed');
      if (localQuizData === 'true') {
        console.log('📝 Quiz completed (from localStorage)');
        return 100;
      }

      // Method 4: Check if user has any quiz-related data
      const quizTaken = localStorage.getItem('quiz_taken');
      if (quizTaken === 'true') {
        console.log('📝 Quiz completed (from quiz_taken flag)');
        return 100;
      }

      console.log('📝 Quiz not completed');
      return 0;
    } catch (error) {
      console.error('❌ Error checking quiz completion:', error);
      return (userData?.quizResults?.length > 0) ? 100 : 0;
    }
  };

  // Stable profile data fetching
  const getProfileData = async (profileResponse, userData) => {
    if (profileResponse.status === 'fulfilled' && profileResponse.value?.user) {
      return profileResponse.value.user.profile || {};
    }
    return userData?.profile || {};
  };

  // Stable mentor connections check
  const checkMentorConnections = async (mentorResponse) => {
    try {
      if (mentorResponse.status === 'fulfilled' && mentorResponse.value.success) {
        const acceptedMentors = mentorResponse.value.requests?.filter(
          req => req.status === 'accepted'
        ).length || 0;
        return Math.min((acceptedMentors / 3) * 100, 100);
      }
      return 0;
    } catch (error) {
      console.error('❌ Error checking mentor connections:', error);
      return 0;
    }
  };

  // Stable progress calculation fallback
  const calculateStableProgress = (userData) => {
    const quizCompleted = (userData?.quizResults?.length > 0) ? 100 : 0;
    const profileCompleted = calculateProfileCompletion(userData?.profile || {});
    const skillsAdded = calculateSkillsProgress(userData?.profile?.skills || []);
    
    console.log('🛡️ Using stable fallback progress:', {
      quizCompleted,
      profileCompleted,
      skillsAdded
    });
    
    return {
      quizCompleted,
      profileCompleted,
      skillsAdded,
      mentorsConnected: 0,
      coursesEnrolled: 0
    };
  };

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    const completionCriteria = [
      { key: 'bio', weight: 20, check: (val) => val && val.trim().length > 10 },
      { key: 'education', weight: 20, check: (val) => val && val.trim().length > 0 },
      { key: 'experience', weight: 20, check: (val) => val !== undefined && val !== null && val !== '' },
      { key: 'skills', weight: 20, check: (val) => val && val.length > 0 },
      { key: 'interests', weight: 20, check: (val) => val && val.length > 0 }
    ];

    let totalScore = 0;
    completionCriteria.forEach(criteria => {
      if (criteria.check(profile[criteria.key])) {
        totalScore += criteria.weight;
      }
    });

    return totalScore;
  };

  const calculateSkillsProgress = (skills) => {
    const skillsCount = skills.length;
    return Math.min((skillsCount / 5) * 100, 100);
  };

  const getOverallProgress = () => {
    const values = Object.values(progress);
    const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return overall;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const refreshProgress = () => {
    console.log('🔄 Manual refresh triggered');
    setDataVersion(prev => prev + 1); // Force re-fetch
  };

  const markQuizAsCompleted = () => {
    console.log('✅ Manually marking quiz as completed');
    // Update multiple storage methods for reliability
    localStorage.setItem('quiz_completed', 'true');
    localStorage.setItem('quiz_taken', 'true');
    
    // Update progress state
    setProgress(prev => ({
      ...prev,
      quizCompleted: 100
    }));
    
    // Trigger a fresh data fetch
    setDataVersion(prev => prev + 1);
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  if (!user) {
    return (
      <div className="progress-container">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your progress.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="progress-container">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading your progress...
          </div>
        </div>
      </div>
    );
  }

  const progressLevel = getOverallProgress() >= 80 ? 'Advanced' : 
                       getOverallProgress() >= 60 ? 'Intermediate' : 
                       getOverallProgress() >= 40 ? 'Beginner' : 'Getting Started';

  return (
    <div className="progress-container">
      <div className="container">
        <div className="progress-header">
          <div className="header-content">
            <div>
              <h1>📊 Your Career Progress</h1>
              <p>Track your career development journey</p>
            </div>
            <div className="header-actions">
              <button 
                onClick={refreshProgress}
                className="btn btn-secondary refresh-btn"
                disabled={loading}
              >
                {loading ? '🔄 Updating...' : '🔄 Refresh Progress'}
              </button>
            </div>
          </div>
          {lastUpdated && (
            <div className="last-updated">
              Last updated: {formatTime(lastUpdated)}
            </div>
          )}
        </div>

        {/* Debug Panel - Remove in production */}
        <div className="debug-panel" style={{ 
          background: '#f7fafc', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
          fontSize: '0.8rem'
        }}>
          
        </div>

        {/* Overall Progress */}
        <div className="overall-progress-section">
          <div className="progress-card">
            <h2>Overall Career Progress</h2>
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-value">{Math.round(progress.quizCompleted)}%</span>
                <span className="stat-label">Assessment</span>
              </div>
              <div className="stat">
                <span className="stat-value">{Math.round(progress.profileCompleted)}%</span>
                <span className="stat-label">Profile</span>
              </div>
              <div className="stat">
                <span className="stat-value">{Math.round(progress.mentorsConnected)}%</span>
                <span className="stat-label">Mentors</span>
              </div>
            </div>
            
            <div className="progress-circle-large">
              <div 
                className="circle" 
                style={{ 
                  background: `conic-gradient(${getProgressColor(getOverallProgress())} ${getOverallProgress() * 3.6}deg, #e2e8f0 0deg)` 
                }}
              >
                <span className="progress-value">{getOverallProgress()}%</span>
              </div>
            </div>
            <div className="progress-level">
              <span className="level-badge">{progressLevel}</span>
            </div>
          </div>
        </div>

        {/* Detailed Progress */}
        <div className="detailed-progress">
          <h3>Detailed Progress Breakdown</h3>
          
          <div className="progress-grid">
            {/* Career Assessment */}
            <div className="progress-category">
              <div className="category-header">
                <h4>Career Assessment</h4>
                <span className="category-percentage">{Math.round(progress.quizCompleted)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progress.quizCompleted}%`,
                    backgroundColor: getProgressColor(progress.quizCompleted)
                  }}
                ></div>
              </div>
              <div className="category-actions">
                {progress.quizCompleted === 100 ? (
                  <div className="completed-section">
                    <span className="completed-text">✅ Assessment Complete</span>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="btn btn-secondary btn-small"
                    >
                      View Results
                    </button>
                  </div>
                ) : (
                  <div className="incomplete-section">
                    <span className="incomplete-text">Take the career quiz to discover your path</span>
                    <button 
                      onClick={() => window.location.href = '/quiz'}
                      className="btn btn-primary btn-small"
                    >
                      Start Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="progress-category">
              <div className="category-header">
                <h4>Profile Completion</h4>
                <span className="category-percentage">{Math.round(progress.profileCompleted)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progress.profileCompleted}%`,
                    backgroundColor: getProgressColor(progress.profileCompleted)
                  }}
                ></div>
              </div>
              <div className="category-actions">
                {progress.profileCompleted === 100 ? (
                  <span className="completed-text">✅ Profile Complete</span>
                ) : (
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="btn btn-secondary btn-small"
                  >
                    Complete Profile
                  </button>
                )}
              </div>
            </div>

            {/* Mentor Connections */}
            <div className="progress-category">
              <div className="category-header">
                <h4>Mentor Connections</h4>
                <span className="category-percentage">{Math.round(progress.mentorsConnected)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progress.mentorsConnected}%`,
                    backgroundColor: getProgressColor(progress.mentorsConnected)
                  }}
                ></div>
              </div>
              <div className="category-actions">
                <button 
                  onClick={() => window.location.href = '/mentors'}
                  className="btn btn-primary btn-small"
                >
                  {progress.mentorsConnected > 0 ? 'Find More Mentors' : 'Connect with Mentors'}
                </button>
              </div>
            </div>

            {/* Skills Development */}
            <div className="progress-category">
              <div className="category-header">
                <h4>Skills Development</h4>
                <span className="category-percentage">{Math.round(progress.skillsAdded)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progress.skillsAdded}%`,
                    backgroundColor: getProgressColor(progress.skillsAdded)
                  }}
                ></div>
              </div>
              <div className="category-actions">
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="btn btn-secondary btn-small"
                >
                  Manage Skills
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tips */}
        <div className="progress-tips">
          <h3>💡 Next Steps</h3>
          <div className="tips-grid">
            {progress.quizCompleted === 0 && (
              <div className="tip-card">
                <h4>Take Career Assessment</h4>
                <p>Complete the career quiz to discover your ideal career path and get personalized recommendations.</p>
                <button 
                  onClick={() => window.location.href = '/quiz'}
                  className="btn btn-primary btn-small"
                >
                  Start Quiz
                </button>
              </div>
            )}
            {progress.profileCompleted < 100 && (
              <div className="tip-card">
                <h4>Complete Your Profile</h4>
                <p>A complete profile helps us provide better career matches and mentor recommendations.</p>
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="btn btn-secondary btn-small"
                >
                  Complete Profile
                </button>
              </div>
            )}
            {progress.mentorsConnected === 0 && (
              <div className="tip-card">
                <h4>Connect with Mentors</h4>
                <p>Find mentors in your desired field to get guidance and accelerate your career growth.</p>
                <button 
                  onClick={() => window.location.href = '/mentors'}
                  className="btn btn-primary btn-small"
                >
                  Find Mentors
                </button>
              </div>
            )}
            {progress.quizCompleted === 100 && progress.profileCompleted === 100 && (
              <div className="tip-card">
                <h4>Great Progress! 🎉</h4>
                <p>You've completed the initial setup. Now focus on connecting with mentors and developing your skills.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;