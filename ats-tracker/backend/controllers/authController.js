import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { credential } = req.body;
  let ticket;
  
  // 1. Verify Google Token
  try {
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    console.error('[Auth Error] Google token verification failed. Check GOOGLE_CLIENT_ID and token validity.');
    return res.status(401).json({ message: 'Google authentication rejected the token.' });
  }

  const payload = ticket.getPayload();
  const { sub: googleId, name, email, picture: profilePicture } = payload;
  let user;

  // 2. Database Operations
  try {
    user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, name, email, profilePicture });
    }
  } catch (dbError) {
    console.error('[DB Error] Failed to find or create user.');
    if (dbError.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists but is associated with a different sign-in method.' });
    }
    return res.status(500).json({ message: 'Database error during authentication.' });
  }

  // 3. Cookie Creation
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } });
  } catch (cookieError) {
    console.error('[Auth Error] Failed to generate JWT or set cookie.');
    res.status(500).json({ message: 'Internal server error while setting up session.' });
  }
};

export const verifyToken = (req, res, next) => {
  // Check cookie first, fallback to Auth header if needed (for mobile apps or similar)
  const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
