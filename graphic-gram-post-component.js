// src/components/Post.js - Reusable post component

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

// Components
import PostActions from './PostActions';
import ImageSlider from './ImageSlider';
import CommentInput from './CommentInput';
import CommentList from './CommentList';

// Hooks
import useAuth from '../hooks/useAuth';

function Post({ post, showComments = false }) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user.id));
  const [isSaved, setIsSaved] = useState(false);
  const [showAllComments, setShowAllComments] = useState(showComments);
  const [comments, setComments] = useState(post.comments || []);
  
  const handleLike = async () => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await axios.post(`/api/posts/${post._id}/${action}`);
      
      if (response.data.success) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleSave = async () => {
    try {
      const action = isSaved ? 'unsave' : 'save';
      const response = await axios.post(`/api/posts/${post._id}/${action}`);
      
      if (response.data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  
  const handleAddComment = (newComment) => {
    setComments([...comments, newComment]);
  };
  
  return (
    <div className="post">
      {/* Post header */}
      <div className="post-header">
        <div className="post-user">
          <Link to={`/${post.user.username}`}>
            <img 
              src={post.user.profilePicture} 
              alt={post.user.username} 
              className="avatar"
            />
          </Link>
          <div className="post-user-info">
            <Link to={`/${post.user.username}`} className="username">
              {post.user.username}
            </Link>
            {post.location && (
              <div className="location">{post.location}</div>
            )}
          </div>
        </div>
        
        <button className="post-menu-btn">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>
      
      {/* Post content */}
      <div className="post-content">
        <ImageSlider images={post.images} />
      </div>
      
      {/* Post actions */}
      <PostActions 
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={handleLike}
        onSave={handleSave}
        onShowComments={() => setShowAllComments(true)}
      />
      
      {/* Like count */}
      <div className="post-likes">
        {likeCount > 0 && (
          <Link to={`/p/${post._id}/likes`}>
            <strong>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</strong>
          </Link>
        )}
      </div>
      
      {/* Caption */}
      {post.caption && (
        <div className="post-caption">
          <Link to={`/${post.user.username}`} className="username">
            {post.user.username}
          </Link>{' '}
          <span>{post.caption}</span>
        </div>
      )}
      
      {/* View comments button */}
      {!showAllComments && comments.length > 0 && (
        <button 
          className="view-comments-btn"
          onClick={() => setShowAllComments(true)}
        >
          View all {comments.length} comments
        </button>
      )}
      
      {/* Comments */}
      {showAllComments && (
        <CommentList comments={comments} />
      )}
      
      {/* Post time */}
      <div className="post-time">
        {moment(post.createdAt).fromNow()}
      </div>
      
      {/* Comment input */}
      <CommentInput 
        postId={post._id} 
        onAddComment={handleAddComment} 
      />
    </div>
  );
}

export default Post;
