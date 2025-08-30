// server.js - Main Express Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// CORS Configuration for production deployment
const corsOptions = {
  origin: [
    'http://localhost:3000', // Development
    'http://localhost:3001', // Alternative development port
    'https://pushuing-on-git-pc0bnnjgv-arbab08s-projects.vercel.app', // Production frontend URL
    /https:\/\/.*\.vercel\.app$/, // All Vercel preview URLs
    /https:\/\/.*\.railway\.app$/ // Railway domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for deployment verification
app.get('/', (req, res) => {
  res.json({
    message: 'DevNovate Blog Platform API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'DevNovate Blog Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (POST /login, POST /register, GET /me)',
      blogs: '/api/blogs (GET, POST, PUT, DELETE)',
      admin: '/api/admin (GET /dashboard, GET /blogs)'
    },
    status: 'active',
    developed_by: 'BIT Durg Students for VIBE HACK 2025'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devnovate-blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});