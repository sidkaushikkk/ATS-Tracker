import 'dotenv/config'; // Must be first!
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import analyzeRoutes from './routes/analyze.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import resumeDraftRoutes from './routes/resumeDrafts.js';

// Environment validation
const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'JWT_SECRET', 'MONGO_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[Server Error] Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

console.log(`[Config] Frontend Origin allowed: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter); // Apply rate limiting to all requests
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(url => url.trim());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/health', (req, res) => res.status(200).send('OK')); // Render health check

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume-drafts', resumeDraftRoutes);

// Add GET /api/analysis/:id here or in a separate route
import { getAnalysis } from './controllers/analyzeController.js';
import { verifyToken } from './controllers/authController.js';
app.get('/api/analysis/:id', verifyToken, getAnalysis);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err.message || err);
  
  // Don't leak stack traces in production
  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: isProd ? 'Internal Server Error' : (err.message || 'Server Error'),
    ...(isProd ? {} : { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown Handler
const shutdown = async (signal) => {
  console.log(`\n[${signal}] shutting down gracefully...`);
  
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }

  server.close(() => {
    console.log('Express server closed.');
    process.exit(0);
  });
  
  // Force shutdown if it takes too long (10s)
  setTimeout(() => {
    console.error('Forcing shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
