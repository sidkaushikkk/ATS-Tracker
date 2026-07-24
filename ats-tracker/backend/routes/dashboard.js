import express from 'express';
import { getDashboardHistory } from '../controllers/dashboardController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.get('/', verifyToken, getDashboardHistory);

export default router;
