import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          setUser(response.user);
          console.log('✅ User authenticated:', response.user.name);
        } else {
          console.log('❌ Token invalid, removing from storage');
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await authAPI.login(email, password);
      console.log('📨 Login response:', response);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        console.log('✅ Login successful, user set:', response.user.name);
        return { success: true };
      } else {
        console.log('❌ Login failed:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      console.log('📝 Attempting signup for:', email);
      const response = await authAPI.signup(name, email, password);
      console.log('📨 Signup response:', response);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        console.log('✅ Signup successful, user set:', response.user.name);
        return { success: true };
      } else {
        console.log('❌ Signup failed:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};