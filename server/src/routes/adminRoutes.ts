import { Router } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUserRole,
  createCareer,
  updateCareer,
  deleteCareer,
  createSkill,
  updateSkill,
  deleteSkill,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createResource,
  updateResource,
  deleteResource,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Protect all admin routes with JWT and Admin role check
router.use(authenticate, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateAdminUserRole);

// Careers
router.post('/careers', createCareer);
router.put('/careers/:id', updateCareer);
router.delete('/careers/:id', deleteCareer);

// Skills
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Questions
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Resources
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

// Projects
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;
