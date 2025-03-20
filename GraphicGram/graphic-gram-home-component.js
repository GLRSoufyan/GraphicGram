// src/pages/Home.js - Home feed page

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Components
import Post from '../components/Post';
import Stories from '../components/Stories';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts/feed');
        
        if (response.data.success) {
          setPosts(response.data.posts);
        } else {
          setError(response.data.message || 'Failed to load posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="home-page">
      <div className="stories-container">
        <Stories />
      </div>
      
      <div className="feed-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {posts.length === 0 && !error ? (
          <div className="empty-feed">
            <p>Your feed is empty. Follow users to see their posts here.</p>
            <Link to="/explore" className="btn-primary">
              Explore
            </Link>
          </div>
        ) : (
          posts.map(post => (
            <Post key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
