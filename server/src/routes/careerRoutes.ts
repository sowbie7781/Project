import { Router } from 'express';
import { getCareers, getCareerById, selectCareerGoal } from '../controllers/careerController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getCareers);
router.get('/:id', getCareerById);
router.post('/select', authenticate, selectCareerGoal);

export default router;
