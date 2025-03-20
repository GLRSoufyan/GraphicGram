// server.js - Main Express server file for Graphic Gram API

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/uploads');
const messageRoutes = require('./routes/messages');
const { verifyToken } = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', verifyToken, postRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/comments', verifyToken, commentRoutes);
app.use('/api/upload', verifyToken, uploadRoutes);
app.use('/api/messages', verifyToken, messageRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to Graphic Gram API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
