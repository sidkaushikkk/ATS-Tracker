import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { analyzeResume } from '../controllers/analyzeController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Rate limiting: max 10 analyses per user per hour
const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many resumes analyzed from this IP, please try again after an hour.' }
});

router.post('/', verifyToken, analyzeLimiter, upload.single('resume'), analyzeResume);

export default router;
