import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StandaloneAdminDashboard.css';

const StandaloneAdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = JSON.parse(sessionStorage.getItem('adminSession'));
    
    if (!adminSession || !adminSession.isAdmin) {
      navigate('/standalone-admin');
      return;
    }
    
    setAdmin(adminSession);
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Loading admin data...');
      
      const baseURL = 'http://localhost:5000/api/admin-data';
      
      const [statsResponse, usersResponse, requestsResponse] = await Promise.all([
        fetch(`${baseURL}/stats`).then(res => res.json()),
        fetch(`${baseURL}/users`).then(res => res.json()),
        fetch(`${baseURL}/mentorship-requests`).then(res => res.json())
      ]);

      if (statsResponse.success) setStats(statsResponse.stats);
      if (usersResponse.success) setUsers(usersResponse.users || []);
      if (requestsResponse.success) setRequests(requestsResponse.requests || []);

    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId, status) => {
    try {
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/admin-data/mentorship-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        await loadData();
        alert(`✅ Request ${status} successfully!`);
      } else {
        throw new Error(data.message || 'Failed to update request');
      }
    } catch (error) {
      console.error('❌ Error updating request:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSession');
    navigate('/standalone-admin');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: '⏳ Pending', color: '#f59e0b' },
      accepted: { class: 'status-accepted', text: '✅ Accepted', color: '#10b981' },
      rejected: { class: 'status-rejected', text: '❌ Rejected', color: '#ef4444' },
      completed: { class: 'status-completed', text: '🎉 Completed', color: '#8b5cf6' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`} style={{ backgroundColor: config.color }}>{config.text}</span>;
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

  if (!admin) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="standalone-admin-dashboard">
      {/* Header */}
      <div className="admin-simple-header">
        <div className="admin-simple-header-content">
          <h1>🧠 MindMatch Admin</h1>
          <div className="admin-actions">
            <span>Welcome, {admin.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📨 Mentorship Requests ({requests.filter(req => req.status === 'pending').length})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={loadData}>🔄 Retry</button>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="admin-content">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading admin data...</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <h2>Admin Dashboard Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <span className="stat-number">{stats.totalUsers || 0}</span>
                <p>Registered users</p>
              </div>
              <div className="stat-card">
                <h3>Active Mentors</h3>
                <span className="stat-number">{stats.totalMentors || 0}</span>
                <p>Available mentors</p>
              </div>
              <div className="stat-card">
                <h3>Total Requests</h3>
                <span className="stat-number">{stats.totalRequests || 0}</span>
                <p>Mentorship requests</p>
              </div>
              <div className="stat-card">
                <h3>Pending Requests</h3>
                <span className="stat-number">{stats.pendingRequests || 0}</span>
                <p>Awaiting approval</p>
              </div>
              <div className="stat-card">
                <h3>Accepted</h3>
                <span className="stat-number">{stats.acceptedRequests || 0}</span>
                <p>Approved requests</p>
              </div>
              <div className="stat-card">
                <h3>Completed</h3>
                <span className="stat-number">{stats.completedRequests || 0}</span>
                <p>Finished sessions</p>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button 
                  onClick={() => setActiveTab('requests')}
                  className="btn btn-primary"
                >
                  📨 Review Pending Requests ({stats.pendingRequests || 0})
                </button>
                <button 
                  onClick={loadData}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h2>User Management ({users.length} users)</h2>
              <div className="tab-actions">
                <button onClick={loadData} className="btn btn-outline" disabled={loading}>
                  {loading ? '🔄 Loading...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
            
            {users.length === 0 ? (
              <div className="no-data">
                <p>No users found in the system.</p>
              </div>
            ) : (
              <div className="users-list">
                {users.map(user => (
                  <div key={user._id} className="user-card">
                    <div className="user-info">
                      <h4>{user.name || 'Unknown User'}</h4>
                      <p className="user-email">{user.email}</p>
                      <div className="user-meta">
                        <span className="user-role">Role: <span className={`role-badge ${user.role}`}>{user.role || 'user'}</span></span>
                        <span className="user-joined">Joined: {formatDate(user.createdAt)}</span>
                        <span className="user-requests">Mentorship Requests: {user.mentorRequests ? user.mentorRequests.length : 0}</span>
                      </div>
                    </div>
                    <div className="user-actions">
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-tab">
            <div className="tab-header">
              <h2>Mentorship Requests</h2>
              <div className="requests-stats">
                <span>Total: {requests.length}</span>
                <span className="pending-count">Pending: {requests.filter(req => req.status === 'pending').length}</span>
                <span className="accepted-count">Accepted: {requests.filter(req => req.status === 'accepted').length}</span>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="no-data">
                <p>No mentorship requests found.</p>
                <p>When users request mentorship sessions, they will appear here.</p>
              </div>
            ) : (
              <div className="requests-list">
                {requests.map((request) => (
                  <div key={request._id} className="request-card">
                    <div className="request-header">
                      <div className="request-info">
                        <h4>{request.userName} → {request.mentorName}</h4>
                        <p className="request-meta">
                          📧 {request.userEmail} • 
                          📅 {formatDate(request.requestedAt)} •
                          {request.message && ` 💬 ${request.message.substring(0, 60)}...`}
                        </p>
                      </div>
                      <div className="request-status">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>

                    {request.adminNotes && (
                      <div className="admin-notes">
                        <strong>Admin Notes:</strong> {request.adminNotes}
                      </div>
                    )}

                    <div className="request-actions">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateRequest(request._id, 'accepted')}
                            className="btn btn-success btn-small"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => handleUpdateRequest(request._id, 'rejected')}
                            className="btn btn-danger btn-small"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateRequest(request._id, 'completed')}
                          className="btn btn-primary btn-small"
                        >
                          🎉 Mark Complete
                        </button>
                      )}
                      
                      {(request.status === 'rejected' || request.status === 'completed') && (
                        <button
                          onClick={() => handleUpdateRequest(request._id, 'pending')}
                          className="btn btn-outline btn-small"
                        >
                          ↩️ Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="admin-footer">
        <p>🔒 MindMatch Admin System • Real-time user-mentor connections • Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default StandaloneAdminDashboard;