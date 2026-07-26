import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

// Initialize Resend
// In a real environment, provide a fallback if the key is missing during init, 
// though the API calls will fail without a valid key.
const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY || 're_mock_key');

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const requestOtp = async (req, res) => {
  const { email } = req.body;
  
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check for cooldown
    const existingOtp = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    if (existingOtp) {
      const timeSinceLastOtp = Date.now() - new Date(existingOtp.createdAt).getTime();
      if (timeSinceLastOtp < 60000) {
        return res.status(429).json({ message: 'Please wait 60 seconds before requesting another code.' });
      }
    }

    // Generate secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const codeHash = hashOtp(otpCode);

    // Save hash in DB
    await Otp.create({
      email: normalizedEmail,
      codeHash: codeHash
    });

    // Send Email
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';
    const fromName = process.env.EMAIL_FROM_NAME || 'ATS Tracker';
    
    // In local dev without a real Resend key, just log it.
    if (process.env.EMAIL_PROVIDER_API_KEY) {
      await resend.emails.send({
        from: `${fromName} <${fromAddress}>`,
        to: normalizedEmail,
        subject: 'Your ATS Tracker Login Code',
        html: `<p>Your ATS Tracker login code is <strong>${otpCode}</strong>. It expires in 10 minutes.</p>`
      });
    } else {
      console.log(`[DEV MODE] Simulated OTP for ${normalizedEmail}: ${otpCode}`);
    }

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('[OTP Request Error]', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp || otp.length !== 6) {
    return res.status(400).json({ message: 'Email and 6-digit OTP are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const codeHash = hashOtp(otp);

  try {
    // Find latest OTP record for this email
    const otpRecord = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    if (otpRecord.consumed) {
      return res.status(400).json({ message: 'This code has already been used.' });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({ message: 'Too many failed attempts. Please request a new code.' });
    }

    if (otpRecord.codeHash !== codeHash) {
      // Increment attempt count
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // OTP is valid
    otpRecord.consumed = true;
    await otpRecord.save();

    // Find or create User
    let user = await User.findOne({ email: normalizedEmail });
    
    if (user) {
      // Update existing user with emailVerified and provider
      if (!user.authProviders.includes('emailOtp')) {
        user.authProviders.push('emailOtp');
      }
      user.emailVerified = true;
      await user.save();
    } else {
      // Create new user
      // Provide a generic name for email-only users, they can update it in profile later
      user = await User.create({
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0], 
        emailVerified: true,
        authProviders: ['emailOtp']
      });
    }

    // Generate JWT Cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        profilePicture: user.profilePicture 
      } 
    });

  } catch (error) {
    console.error('[OTP Verify Error]', error);
    res.status(500).json({ message: 'Failed to verify OTP.' });
  }
};
