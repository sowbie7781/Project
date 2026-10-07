import { Router } from 'express';
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  getInterviewHistory,
} from '../controllers/interviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/generate', authenticate, generateInterviewQuestions);
router.post('/feedback', authenticate, evaluateInterviewAnswer);
router.get('/history', authenticate, getInterviewHistory);

export default router;
