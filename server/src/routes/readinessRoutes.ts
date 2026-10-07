import { Router } from 'express';
import { getCareerReadiness } from '../controllers/readinessController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCareerReadiness);

export default router;
