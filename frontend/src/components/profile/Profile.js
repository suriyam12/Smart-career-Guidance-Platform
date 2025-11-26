import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth(); // Remove updateUser since it doesn't exist
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    education: '',
    experience: '',
    skills: [],
    interests: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      console.log('🔄 Loading profile data...');
      const response = await profileAPI.getProfile();
      console.log('📊 Profile API response:', response);
      
      if (response && response.success && response.user) {
        const userData = response.user;
        console.log('✅ Profile data loaded:', userData);
        
        const profile = userData.profile || {};
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          bio: profile.bio || '',
          education: profile.education || '',
          experience: profile.experience || '',
          skills: profile.skills || [],
          interests: profile.interests || []
        });
        
        calculateProfileCompletion(profile);
      } else {
        throw new Error(response?.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      // Fallback to user data from context
      const profile = user?.profile || {};
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        bio: profile.bio || '',
        education: profile.education || '',
        experience: profile.experience || '',
        skills: profile.skills || [],
        interests: profile.interests || []
      });
      calculateProfileCompletion(profile);
      
      setMessage({ 
        type: 'error', 
        text: 'Could not load profile data. Using cached data.' 
      });
    }
  };

  const calculateProfileCompletion = (profile) => {
    if (!profile) {
      setProfileCompletion(0);
      return;
    }
    
    let completed = 0;
    const totalFields = 5;

    if (profile.bio && profile.bio.trim().length > 0) completed++;
    if (profile.education && profile.education.trim().length > 0) completed++;
    if (profile.experience !== undefined && profile.experience !== null && profile.experience !== '') completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    if (profile.interests && profile.interests.length > 0) completed++;

    const percentage = Math.round((completed / totalFields) * 100);
    setProfileCompletion(percentage);
    console.log(`📊 Profile completion: ${completed}/${totalFields} = ${percentage}%`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('📤 Submitting profile data:', formData);
      
      const profileData = {
        bio: formData.bio,
        education: formData.education,
        experience: formData.experience,
        skills: formData.skills,
        interests: formData.interests
      };

      console.log('🚀 Sending to API:', profileData);

      const response = await profileAPI.updateProfile(profileData);
      console.log('✅ Profile update response:', response);

      if (response.success) {
        // Profile saved successfully - no need to update context
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully! Your data has been saved to the database.' 
        });

        // Recalculate completion
        calculateProfileCompletion(profileData);

        console.log('🎉 Profile saved successfully!');

        // Optional: Reload the data to get the latest from server
        setTimeout(() => {
          loadProfileData();
        }, 1000);

      } else {
        setMessage({ 
          type: 'error', 
          text: response.message || 'Failed to update profile' 
        });
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message}. Please check if the server is running.` 
      });
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = () => {
    if (profileCompletion >= 80) return '#10b981';
    if (profileCompletion >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h1>👤 Your Profile</h1>
          <p>Manage your personal information and career details</p>
        </div>

        {/* Profile Completion Card */}
        <div className="completion-card">
          <div className="completion-info">
            <h3>Profile Completion</h3>
            <span className="completion-percentage" style={{ color: getCompletionColor() }}>
              {profileCompletion}%
            </span>
          </div>
          <div className="completion-bar">
            <div 
              className="completion-fill" 
              style={{ 
                width: `${profileCompletion}%`,
                backgroundColor: getCompletionColor()
              }}
            ></div>
          </div>
          <p className="completion-hint">
            {profileCompletion === 100 
              ? '🎉 Your profile is complete!' 
              : `Complete all sections to get better career recommendations. ${5 - Math.round(profileCompletion / 20)} sections remaining.`
            }
          </p>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                <small className="field-hint">
                  Note: Name changes may require page refresh to show in navigation
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled
                />
                <small className="field-hint">Email cannot be changed</small>
              </div>
            </div>

            {/* Career Information */}
            <div className="form-section">
              <h3>Career Information</h3>
              
              <div className="form-group">
                <label htmlFor="bio">Professional Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your professional background, career goals, and interests..."
                  rows="4"
                />
                <small className="field-hint">
                  {formData.bio.length}/500 characters • 
                  {formData.bio.length > 10 ? ' ✅ Good' : ' 📝 Add more details'}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="education">Education</label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's in Computer Science"
                />
                <small className="field-hint">
                  {formData.education ? ' ✅ Added' : ' 📝 Add your education'}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                >
                  <option value="">Select experience</option>
                  <option value="0">0-1 years (Student/Entry-level)</option>
                  <option value="1">1-3 years (Junior)</option>
                  <option value="3">3-5 years (Mid-level)</option>
                  <option value="5">5-8 years (Senior)</option>
                  <option value="8">8+ years (Expert)</option>
                </select>
                <small className="field-hint">
                  {formData.experience !== '' ? ' ✅ Selected' : ' 📝 Select your experience level'}
                </small>
              </div>
            </div>

            {/* Skills Section */}
            <div className="form-section">
              <h3>Skills</h3>
              <div className="form-group">
                <label>Your Skills</label>
                <div className="tags-input">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add a skill (e.g., JavaScript, Python, Design)"
                    className="tags-input-field"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSkill}
                    className="btn btn-secondary btn-small"
                  >
                    Add
                  </button>
                </div>
                
                <div className="tags-container">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="tag">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <small className="field-hint">No skills added yet. Add at least 3-5 relevant skills.</small>
                  )}
                </div>
                <small className="field-hint">
                  {formData.skills.length}/10 skills • 
                  {formData.skills.length >= 3 ? ' ✅ Good' : ' 📝 Add more skills'}
                </small>
              </div>
            </div>

            {/* Interests Section */}
            <div className="form-section">
              <h3>Career Interests</h3>
              <div className="form-group">
                <label>Your Interests</label>
                <div className="tags-input">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    placeholder="Add career interests (e.g., Web Development, Data Science)"
                    className="tags-input-field"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddInterest}
                    className="btn btn-secondary btn-small"
                  >
                    Add
                  </button>
                </div>
                
                <div className="tags-container">
                  {formData.interests.map((interest, index) => (
                    <span key={index} className="tag">
                      {interest}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInterest(interest)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.interests.length === 0 && (
                    <small className="field-hint">No interests added yet. Add your career interests.</small>
                  )}
                </div>
                <small className="field-hint">
                  {formData.interests.length}/8 interests • 
                  {formData.interests.length >= 2 ? ' ✅ Good' : ' 📝 Add more interests'}
                </small>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '🔄 Updating...' : '💾 Save Profile'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={loadProfileData}
            >
              🔄 Reset Changes
            </button>

            <div className="completion-preview">
              <span>Current completion: </span>
              <strong style={{ color: getCompletionColor() }}>
                {calculateFutureCompletion(formData)}%
              </strong>
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              onClick={() => window.location.href = '/progress'}
              className="btn btn-secondary"
            >
              📊 View Progress
            </button>
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="btn btn-secondary"
            >
              🧩 Take Career Quiz
            </button>
            <button 
              onClick={() => window.location.href = '/mentors'}
              className="btn btn-secondary"
            >
              👥 Find Mentors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate future completion
const calculateFutureCompletion = (formData) => {
  let completed = 0;
  const totalFields = 5;

  if (formData.bio && formData.bio.trim().length > 0) completed++;
  if (formData.education && formData.education.trim().length > 0) completed++;
  if (formData.experience !== undefined && formData.experience !== null && formData.experience !== '') completed++;
  if (formData.skills && formData.skills.length > 0) completed++;
  if (formData.interests && formData.interests.length > 0) completed++;

  return Math.round((completed / totalFields) * 100);
};

export default Profile;