"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect all admin routes with JWT and Admin role check
router.use(auth_1.authenticate, auth_1.requireAdmin);
router.get('/stats', adminController_1.getAdminStats);
router.get('/users', adminController_1.getAdminUsers);
router.put('/users/:id/role', adminController_1.updateAdminUserRole);
// Careers
router.post('/careers', adminController_1.createCareer);
router.put('/careers/:id', adminController_1.updateCareer);
router.delete('/careers/:id', adminController_1.deleteCareer);
// Skills
router.post('/skills', adminController_1.createSkill);
router.put('/skills/:id', adminController_1.updateSkill);
router.delete('/skills/:id', adminController_1.deleteSkill);
// Questions
router.post('/questions', adminController_1.createQuestion);
router.put('/questions/:id', adminController_1.updateQuestion);
router.delete('/questions/:id', adminController_1.deleteQuestion);
// Resources
router.post('/resources', adminController_1.createResource);
router.put('/resources/:id', adminController_1.updateResource);
router.delete('/resources/:id', adminController_1.deleteResource);
// Projects
router.post('/projects', adminController_1.createProject);
router.put('/projects/:id', adminController_1.updateProject);
router.delete('/projects/:id', adminController_1.deleteProject);
exports.default = router;
