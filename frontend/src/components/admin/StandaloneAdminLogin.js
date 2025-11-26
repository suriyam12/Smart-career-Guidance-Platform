import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StandaloneAdminLogin.css';

const StandaloneAdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (formData.email === 'admin123@gmail.com' && formData.password === 'admin123') {
        const adminSession = {
          isAdmin: true,
          email: 'admin123@gmail.com',
          name: 'System Administrator',
          role: 'admin',
          loginTime: new Date().toISOString()
        };
        
        sessionStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        console.log('✅ Admin login successful');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="standalone-admin-container">
      {/* Simple Header with only MindMatch */}
      <div className="admin-simple-header">
        <div className="admin-simple-header-content">
          <h1>🧠 MindMatch</h1>
        </div>
      </div>
      
      <div className="standalone-admin-card">
        <div className="standalone-admin-header">
          <h1>🔐 Admin System</h1>
          <p>Independent Administration Portal</p>
          <div className="admin-warning">
            ⚠️ Completely separate from user system
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>

          <button 
            type="submit" 
            className="btn-admin"
            disabled={loading}
          >
            {loading ? '🔐 Signing In...' : '🔐 Admin Sign In'}
          </button>
        </form>

        <div className="admin-credentials">
          <h3>Demo Credentials:</h3>
          <p>Email: <strong>admin123@gmail.com</strong></p>
          <p>Password: <strong>admin123</strong></p>
        </div>

        <div className="admin-note">
          <p>💡 This admin system is completely independent and does not interact with user authentication.</p>
        </div>
      </div>
    </div>
  );
};

export default StandaloneAdminLogin;