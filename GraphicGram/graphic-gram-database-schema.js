// Database Schema for MongoDB

// User Schema
const UserSchema = {
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  bio: { type: String, default: '', maxlength: 150 },
  website: { type: String, default: '' },
  profilePicture: { type: String, default: 'default-profile.jpg' },
  isPrivate: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }],
  savedPosts: [{ type: ObjectId, ref: 'Post' }],
  blockedUsers: [{ type: ObjectId, ref: 'User' }],
  notifications: {
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    messages: { type: Boolean, default: true }
  },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Post Schema
const PostSchema = {
  user: { type: ObjectId, ref: 'User', required: true },
  caption: { type: String, maxlength: 2200 },
  images: [{ type: String, required: true }],
  filter: { type: String, default: 'normal' },
  location: { type: String },
  tags: [{ type: String }],
  mentionedUsers: [{ type: ObjectId, ref: 'User' }],
  likes: [{ type: ObjectId, ref: 'User' }],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  isArchived: { type: Boolean, default: false },
  isCommentsDisabled: { type: Boolean, default: false },
  isSensitive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Comment Schema
const CommentSchema = {
  user: { type: ObjectId, ref: 'User', required: true },
  post: { type: ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true, maxlength: 500 },
  likes: [{ type: ObjectId, ref: 'User' }],
  replies: [{ type: ObjectId, ref: 'Comment' }],
  parentComment: { type: ObjectId, ref: 'Comment' },
  mentionedUsers: [{ type: ObjectId, ref: 'User' }],
  isEdited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Story Schema
const StorySchema = {
  user: { type: ObjectId, ref: 'User', required: true },
  media: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  caption: { type: String },
  location: { type: String },
  mentionedUsers: [{ type: ObjectId, ref: 'User' }],
  viewers: [{ type: ObjectId, ref: 'User' }],
  isHighlighted: { type: Boolean, default: false },
  highlightName: { type: String },
  expiresAt: { type: Date, required: true }, // 24 hours after creation
  createdAt: { type: Date, default: Date.now }
};

// Message Schema
const MessageSchema = {
  sender: { type: ObjectId, ref: 'User', required: true },
  recipient: { type: ObjectId, ref: 'User', required: true },
  text: { type: String },
  media: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'audio'] },
  isRead: { type: Boolean, default: false },
  isLiked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  replyTo: { type: ObjectId, ref: 'Message' },
  createdAt: { type: Date, default: Date.now }
};

// Conversation Schema
const ConversationSchema = {
  participants: [{ type: ObjectId, ref: 'User', required: true }],
  lastMessage: { type: ObjectId, ref: 'Message' },
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupIcon: { type: String },
  admins: [{ type: ObjectId, ref: 'User' }],
  unreadCount: { type: Map, of: Number, default: {} }, // Map of userId to unread count
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Notification Schema
const NotificationSchema = {
  recipient: { type: ObjectId, ref: 'User', required: true },
  sender: { type: ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow', 'mention', 'message'], 
    required: true 
  },
  post: { type: ObjectId, ref: 'Post' },
  comment: { type: ObjectId, ref: 'Comment' },
  message: { type: ObjectId, ref: 'Message' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
};

// Activity Schema (for analytics)
const ActivitySchema = {
  user: { type: ObjectId, ref: 'User', required: true },
  activityType: { 
    type: String, 
    enum: ['login', 'logout', 'post', 'like', 'comment', 'follow', 'message'], 
    required: true 
  },
  post: { type: ObjectId, ref: 'Post' },
  comment: { type: ObjectId, ref: 'Comment' },
  targetUser: { type: ObjectId, ref: 'User' },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
};

// Hashtag Schema
const HashtagSchema = {
  name: { type: String, required: true, unique: true, lowercase: true },
  postCount: { type: Number, default: 0 },
  posts: [{ type: ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};
