import express from 'express';
import { getProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/me', verifyToken, getProfile);

export default router;
