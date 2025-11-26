import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('adminSession');
    navigate('/standalone-admin');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-logo">
          <h1 onClick={handleGoHome} style={{cursor: 'pointer'}}>
            🔐 MindMatch Admin
          </h1>
        </div>
        <div className="admin-actions">
          <button onClick={handleLogout} className="admin-logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;