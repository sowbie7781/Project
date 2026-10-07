"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const careerRoutes_1 = __importDefault(require("./careerRoutes"));
const skillRoutes_1 = __importDefault(require("./skillRoutes"));
const assessmentRoutes_1 = __importDefault(require("./assessmentRoutes"));
const roadmapRoutes_1 = __importDefault(require("./roadmapRoutes"));
const skillGapRoutes_1 = __importDefault(require("./skillGapRoutes"));
const resourceRoutes_1 = __importDefault(require("./resourceRoutes"));
const quizRoutes_1 = __importDefault(require("./quizRoutes"));
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const interviewRoutes_1 = __importDefault(require("./interviewRoutes"));
const readinessRoutes_1 = __importDefault(require("./readinessRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/careers', careerRoutes_1.default);
router.use('/skills', skillRoutes_1.default);
router.use('/assessments', assessmentRoutes_1.default);
router.use('/roadmap', roadmapRoutes_1.default);
router.use('/skill-gap', skillGapRoutes_1.default);
router.use('/resources', resourceRoutes_1.default);
router.use('/quizzes', quizRoutes_1.default);
router.use('/projects', projectRoutes_1.default);
router.use('/interview', interviewRoutes_1.default);
router.use('/readiness', readinessRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        app: 'SKILLPATH AI API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
exports.default = router;
