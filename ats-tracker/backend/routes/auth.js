import express from 'express';
import { googleAuth, getMe, logout, verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/me', verifyToken, getMe);
router.post('/logout', logout);

export default router;
