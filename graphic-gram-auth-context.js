// src/context/AuthContext.js - Authentication context for React app

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set default headers for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch current user
          const response = await axios.get('/api/auth/me');
          
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Clear invalid token
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (identifier, password) => {
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/login', {
        identifier,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        return true;
      } else {
        setError(response.data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      return false;
    }
  };
  
  // Signup function
  const signup = async (userData) => {
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        return true;
      } else {
        setError(response.data.message || 'Signup failed');
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
  };
  
  const contextValue = {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
