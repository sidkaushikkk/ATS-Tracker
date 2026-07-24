import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import analyzeRoutes from './routes/analyze.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Add GET /api/analysis/:id here or in a separate route
import { getAnalysis } from './controllers/analyzeController.js';
app.get('/api/analysis/:id', getAnalysis);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
