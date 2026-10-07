import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  submitProject,
  getUserProjectSubmissions,
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProjects);
router.get('/submissions', authenticate, getUserProjectSubmissions);
router.get('/:id', authenticate, getProjectById);
router.post('/:id/submit', authenticate, submitProject);

export default router;
