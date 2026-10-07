"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDev = process.env.NODE_ENV === 'development';
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected server error occurred.',
        ...(isDev && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
