import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/analyzeController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', verifyToken, upload.single('resume'), analyzeResume);

export default router;
