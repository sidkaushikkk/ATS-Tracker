import 'dotenv/config'; // Must be first!
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume-drafts', resumeDraftRoutes);

// Add GET /api/analysis/:id here or in a separate route
import { getAnalysis } from './controllers/analyzeController.js';
import { verifyToken } from './controllers/authController.js';
app.get('/api/analysis/:id', verifyToken, getAnalysis);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
