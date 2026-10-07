"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// Security Headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS
const allowedOrigins = [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl, postman, or internal server calls)
        if (!origin)
            return callback(null, true);
        const isVercelDomain = origin.endsWith('.vercel.app') || (process.env.VERCEL_URL && origin.includes(process.env.VERCEL_URL));
        if (allowedOrigins.indexOf(origin) !== -1 ||
            process.env.NODE_ENV === 'development' ||
            isVercelDomain ||
            Boolean(process.env.VERCEL)) {
            return callback(null, true);
        }
        return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate Limiter
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this client. Please try again after 15 minutes.',
    },
});
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Ensure database connection in serverless / Vercel fluid compute requests without crashing
app.use(async (_req, _res, next) => {
    try {
        await (0, db_1.connectDB)();
    }
    catch (err) {
        console.warn('[DB Middleware] Database connection attempt failed:', err);
    }
    next();
});
// Mount API routes (supports both /api and root path in serverless proxies)
app.use('/api', apiLimiter, routes_1.default);
app.use('/', apiLimiter, routes_1.default);
// 404 handler for API routes
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});
// Centralized error handling
app.use(errorHandler_1.errorHandler);
const seed_1 = require("./seed");
const models_1 = require("./models");
const mongoose_1 = __importDefault(require("mongoose"));
// Start server after DB connection
const startServer = async () => {
    try {
        const isConnected = await (0, db_1.connectDB)();
        // Auto-seed if database is connected and empty
        if (isConnected && mongoose_1.default.connection.readyState === 1) {
            try {
                const careerCount = await models_1.Career.countDocuments();
                if (careerCount === 0) {
                    console.log('[Startup] Database is empty. Seeding initial careers, skills, questions, and users...');
                    await (0, seed_1.seedDatabase)();
                }
            }
            catch (seedErr) {
                console.warn('[Startup] Seeding skipped:', seedErr.message);
            }
        }
        // Only bind TCP port when running standalone (not in Vercel serverless)
        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`===============================================`);
                console.log(`🚀 SKILLPATH AI Server running on port ${PORT}`);
                console.log(`🌐 Base API: http://localhost:${PORT}/api`);
                console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
                console.log(`===============================================`);
            });
        }
    }
    catch (error) {
        console.warn('Server startup notice (running with resilient in-memory fallback):', error);
    }
};
startServer();
exports.default = app;
