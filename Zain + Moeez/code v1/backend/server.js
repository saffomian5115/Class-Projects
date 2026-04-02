// ============================================
// FOUR WHEELS — SERVER.JS
// Main Entry Point
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// ===== ROUTES =====
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin',    require('./routes/admin'));

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
  res.json({
    message: '🚗 Four Wheels API is running',
    version: '1.0.0',
    endpoints: {
      auth:     '/api/auth',
      users:    '/api/users',
      vehicles: '/api/vehicles',
      messages: '/api/messages',
      admin:    '/api/admin',
    }
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Four Wheels Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});
