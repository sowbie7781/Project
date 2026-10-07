import { Router } from 'express';
import {
  getAssessments,
  getAssessmentForCareer,
  submitAssessment,
  getAssessmentResults,
} from '../controllers/assessmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAssessments);
router.get('/results', authenticate, getAssessmentResults);
router.get('/career/:careerId', authenticate, getAssessmentForCareer);
router.post('/:assessmentId/submit', authenticate, submitAssessment);

export default router;
