import { Router } from 'express';
import { getMe, updateMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

export default router;
