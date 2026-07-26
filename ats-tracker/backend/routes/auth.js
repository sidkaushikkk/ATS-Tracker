import express from 'express';
import { googleAuth, getMe, logout, verifyToken } from '../controllers/authController.js';
import { requestOtp, verifyOtp } from '../controllers/otpController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for OTP requests
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 OTP requests per window
  message: { message: 'Too many OTP requests from this IP, please try again after 15 minutes.' }
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: { message: 'Too many verification attempts, please try again later.' }
});

router.post('/google', googleAuth);
router.get('/me', verifyToken, getMe);
router.post('/logout', logout);

// Email OTP routes
router.post('/email/request-otp', otpRequestLimiter, requestOtp);
router.post('/email/resend-otp', otpRequestLimiter, requestOtp); // Re-using requestOtp since logic handles cooldowns
router.post('/email/verify-otp', otpVerifyLimiter, verifyOtp);

export default router;
