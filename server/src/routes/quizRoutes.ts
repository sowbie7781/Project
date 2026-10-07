import { Router } from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getUserQuizHistory,
} from '../controllers/quizController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getQuizzes);
router.get('/history', authenticate, getUserQuizHistory);
router.get('/:id', getQuizById);
router.post('/:id/submit', authenticate, submitQuizAttempt);

export default router;
