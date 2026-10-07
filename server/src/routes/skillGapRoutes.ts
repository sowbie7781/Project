import { Router } from 'express';
import { getSkillGapAnalysis } from '../controllers/skillGapController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getSkillGapAnalysis);

export default router;
