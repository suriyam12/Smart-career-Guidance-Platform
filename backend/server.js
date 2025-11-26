const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  console.log('Test endpoint called:', req.body);
  res.json({
    success: true,
    message: 'Test successful!',
    data: req.body
  });
});

// API Routes - ONLY load if files exist
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('❌ Auth routes not loaded:', error.message);
}

try {
  app.use('/api/users', require('./routes/users'));
  console.log('✅ Users routes loaded');
} catch (error) {
  console.log('❌ Users routes not loaded:', error.message);
}

try {
  app.use('/api/quiz', require('./routes/quiz'));
  console.log('✅ Quiz routes loaded');
} catch (error) {
  console.log('❌ Quiz routes not loaded:', error.message);
}

try {
  app.use('/api/mentors', require('./routes/mentors'));
  console.log('✅ Mentors routes loaded');
} catch (error) {
  console.log('❌ Mentors routes not loaded:', error.message);
}

try {
  app.use('/api/admin-data', require('./routes/adminData'));
  console.log('✅ Admin data routes loaded');
} catch (error) {
  console.log('❌ Admin data routes not loaded:', error.message);
}

try {
  app.use('/api/mentorship', require('./routes/mentorship'));
  console.log('✅ Mentorship routes loaded');
} catch (error) {
  console.log('❌ Mentorship routes not loaded:', error.message);
}
app.use('/api/notifications', require('./routes/notifications'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career_guidance';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log('====================================\n');
});