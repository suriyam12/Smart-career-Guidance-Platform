import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyRequests.css';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyRequests();
  }, [user, navigate]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/mentorship/my-requests/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        throw new Error(data.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Error loading your mentorship requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: '⏳ Pending', color: '#f59e0b' },
      accepted: { class: 'status-accepted', text: '✅ Accepted', color: '#10b981' },
      rejected: { class: 'status-rejected', text: '❌ Rejected', color: '#ef4444' },
      completed: { class: 'status-completed', text: '🎉 Completed', color: '#8b5cf6' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span 
        className={`status-badge ${config.class}`}
        style={{ backgroundColor: config.color }}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="my-requests-container">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your mentorship requests.</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-requests-container">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-requests-container">
      <div className="container">
        <div className="my-requests-header">
          <h1>📋 My Mentorship Requests</h1>
          <p>Track the status of your mentorship requests and see when they get accepted by admins.</p>
        </div>

        <div className="requests-stats">
          <div className="stat-card">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {requests.filter(req => req.status === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {requests.filter(req => req.status === 'accepted').length}
            </span>
            <span className="stat-label">Accepted</span>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">📭</div>
            <h3>No Mentorship Requests Yet</h3>
            <p>You haven't sent any mentorship requests yet. Start by exploring mentors and requesting sessions!</p>
            <button 
              onClick={() => navigate('/mentors')}
              className="btn btn-primary"
            >
              Find Mentors
            </button>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="mentor-info">
                    <h3>{request.mentorName}</h3>
                    <p className="request-id">Request ID: {request._id}</p>
                  </div>
                  <div className="request-status">
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span className="detail-label">Requested On:</span>
                    <span className="detail-value">{formatDate(request.requestedAt)}</span>
                  </div>
                  
                  {request.respondedAt && (
                    <div className="detail-row">
                      <span className="detail-label">Responded On:</span>
                      <span className="detail-value">{formatDate(request.respondedAt)}</span>
                    </div>
                  )}
                  
                  {request.message && (
                    <div className="detail-row">
                      <span className="detail-label">Your Message:</span>
                      <span className="detail-value message-text">{request.message}</span>
                    </div>
                  )}
                  
                  {request.adminNotes && (
                    <div className="detail-row">
                      <span className="detail-label">Admin Notes:</span>
                      <span className="detail-value admin-notes">{request.adminNotes}</span>
                    </div>
                  )}
                </div>

                {request.status === 'accepted' && (
                  <div className="accepted-actions">
                    <p className="success-message">
                      🎉 Your request has been accepted! You can now start your mentorship sessions with {request.mentorName}.
                    </p>
                
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default MyRequests;