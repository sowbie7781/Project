import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import careerRoutes from './careerRoutes';
import skillRoutes from './skillRoutes';
import assessmentRoutes from './assessmentRoutes';
import roadmapRoutes from './roadmapRoutes';
import skillGapRoutes from './skillGapRoutes';
import resourceRoutes from './resourceRoutes';
import quizRoutes from './quizRoutes';
import projectRoutes from './projectRoutes';
import interviewRoutes from './interviewRoutes';
import readinessRoutes from './readinessRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/careers', careerRoutes);
router.use('/skills', skillRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/skill-gap', skillGapRoutes);
router.use('/resources', resourceRoutes);
router.use('/quizzes', quizRoutes);
router.use('/projects', projectRoutes);
router.use('/interview', interviewRoutes);
router.use('/readiness', readinessRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'SKILLPATH AI API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
