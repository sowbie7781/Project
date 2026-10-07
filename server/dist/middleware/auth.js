"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const fallbackStore_1 = require("../services/fallbackStore");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authentication required. No valid token provided.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'skillpath_default_jwt_secret_college';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        let user = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                user = await User_1.User.findById(decoded.id).select('-passwordHash');
            }
            catch (dbErr) {
                user = null;
            }
        }
        if (!user) {
            user = fallbackStore_1.fallbackStore.findUserById(decoded.id);
        }
        if (!user) {
            res.status(401).json({ success: false, message: 'User session invalid or user no longer exists.' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
        return Promise.resolve();
    }
    next();
    return Promise.resolve();
};
exports.requireAdmin = requireAdmin;
