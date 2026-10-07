import { Router } from 'express';
import {
  getRoadmap,
  generateOrRegenerateRoadmap,
  updateTopicStatus,
} from '../controllers/roadmapController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getRoadmap);
router.post('/generate', authenticate, generateOrRegenerateRoadmap);
router.put('/topic/:topicId', authenticate, updateTopicStatus);

export default router;
