// src/App.js - Main React component

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={
            <RequireAuth>
              <Layout>
                <Home />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/explore" element={
            <RequireAuth>
              <Layout>
                <Explore />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/p/:postId" element={
            <RequireAuth>
              <Layout>
                <Post />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/:username" element={
            <RequireAuth>
              <Layout>
                <Profile />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/messages" element={
            <RequireAuth>
              <Layout>
                <Messages />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Authentication wrapper component
function RequireAuth({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App;
