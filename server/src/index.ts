import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
const allowedOrigins = [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman, or internal server calls)
      if (!origin) return callback(null, true);
      const isVercelDomain = origin.endsWith('.vercel.app') || (process.env.VERCEL_URL && origin.includes(process.env.VERCEL_URL));
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === 'development' ||
        isVercelDomain ||
        Boolean(process.env.VERCEL)
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this client. Please try again after 15 minutes.',
  },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection in serverless / Vercel fluid compute requests without crashing
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[DB Middleware] Database connection attempt failed:', err);
  }
  next();
});

// Mount API routes
app.use('/api', apiLimiter, routes);

// 404 handler for API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Centralized error handling
app.use(errorHandler);

import { seedDatabase } from './seed';
import { Career } from './models';
import mongoose from 'mongoose';

// Start server after DB connection
const startServer = async () => {
  try {
    const isConnected = await connectDB();

    // Auto-seed if database is connected and empty
    if (isConnected && mongoose.connection.readyState === 1) {
      try {
        const careerCount = await Career.countDocuments();
        if (careerCount === 0) {
          console.log('[Startup] Database is empty. Seeding initial careers, skills, questions, and users...');
          await seedDatabase();
        }
      } catch (seedErr: any) {
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
  } catch (error) {
    console.warn('Server startup notice (running with resilient in-memory fallback):', error);
  }
};

startServer();

export default app;
