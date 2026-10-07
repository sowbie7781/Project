"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updateMe = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const fallbackStore_1 = require("../services/fallbackStore");
const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET || 'skillpath_default_jwt_secret_college';
    return jsonwebtoken_1.default.sign({ id: userId, role }, secret, { expiresIn: '7d' });
};
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, college, course, department, year } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
            return;
        }
        if (confirmPassword && password !== confirmPassword) {
            res.status(400).json({ success: false, message: 'Passwords do not match.' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        // Check existing in DB if connected
        let existingUser = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                existingUser = await User_1.User.findOne({ email: cleanEmail });
            }
            catch (e) {
                existingUser = null;
            }
        }
        // Also check fallback store
        if (!existingUser) {
            existingUser = fallbackStore_1.fallbackStore.findUserByEmail(cleanEmail);
        }
        if (existingUser) {
            res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        let newUser = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                newUser = await User_1.User.create({
                    name: name.trim(),
                    email: cleanEmail,
                    passwordHash,
                    college: college || '',
                    course: course || '',
                    department: department || '',
                    year: year || '',
                    role: 'student',
                    onboardingCompleted: false,
                });
            }
            catch (dbErr) {
                console.warn('[Register] DB save skipped, using in-memory store:', dbErr.message);
            }
        }
        // Always ensure user is saved in fallbackStore for resilient session hydration
        if (!newUser) {
            newUser = fallbackStore_1.fallbackStore.createUser({
                name: name.trim(),
                email: cleanEmail,
                passwordHash,
                college: college || '',
                course: course || '',
                department: department || '',
                year: year || '',
                role: 'student',
                onboardingCompleted: false,
            });
        }
        else {
            fallbackStore_1.fallbackStore.createUser({
                _id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                passwordHash: newUser.passwordHash,
                college: newUser.college,
                course: newUser.course,
                department: newUser.department,
                year: newUser.year,
                role: newUser.role,
                onboardingCompleted: newUser.onboardingCompleted,
            });
        }
        const token = generateToken(newUser._id.toString(), newUser.role);
        res.status(201).json({
            success: true,
            message: 'Account registered successfully.',
            token,
            user: {
                id: newUser._id,
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                college: newUser.college,
                course: newUser.course,
                department: newUser.department,
                year: newUser.year,
                onboardingCompleted: newUser.onboardingCompleted,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide both email and password.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        // Check DB first if connected
        let user = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                user = await User_1.User.findOne({ email: cleanEmail }).populate('careerGoal');
            }
            catch (dbErr) {
                console.warn('[Login] DB query failed, falling back to in-memory store:', dbErr.message);
            }
        }
        // If not found in DB or DB is disconnected, check fallback store
        if (!user) {
            const fallbackUser = fallbackStore_1.fallbackStore.findUserByEmail(cleanEmail);
            if (fallbackUser) {
                const isMatch = fallbackStore_1.fallbackStore.verifyPassword(cleanEmail, password, fallbackUser.passwordHash);
                if (!isMatch) {
                    res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
                    return;
                }
                const token = generateToken(fallbackUser._id.toString(), fallbackUser.role);
                res.json({
                    success: true,
                    message: 'Login successful.',
                    token,
                    user: fallbackStore_1.fallbackStore.sanitizeUser(fallbackUser),
                });
                return;
            }
            res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            // Also try fallback verification for demo student & admin fast-pass passwords
            const fallbackPass = fallbackStore_1.fallbackStore.verifyPassword(cleanEmail, password);
            if (!fallbackPass) {
                res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
                return;
            }
        }
        const token = generateToken(user._id.toString(), user.role);
        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                college: user.college,
                course: user.course,
                department: user.department,
                year: user.year,
                careerGoal: user.careerGoal,
                experienceLevel: user.experienceLevel,
                interests: user.interests,
                knownSkills: user.knownSkills,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Login failed.' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const userId = req.user._id || req.user.id;
        let populatedUser = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                populatedUser = await User_1.User.findById(userId).select('-passwordHash').populate('careerGoal');
            }
            catch (e) {
                populatedUser = null;
            }
        }
        if (!populatedUser) {
            const fallbackUser = fallbackStore_1.fallbackStore.findUserById(String(userId));
            if (fallbackUser) {
                populatedUser = fallbackStore_1.fallbackStore.sanitizeUser(fallbackUser);
            }
            else {
                populatedUser = req.user;
            }
        }
        res.json({
            success: true,
            user: populatedUser,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch user session.' });
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const userId = req.user._id || req.user.id;
        const { name, college, course, department, year, bio, profileImage, careerGoal, experienceLevel, interests, knownSkills, onboardingCompleted } = req.body;
        let updatedUser = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                updatedUser = await User_1.User.findByIdAndUpdate(userId, {
                    ...(name && { name: name.trim() }),
                    ...(college !== undefined && { college }),
                    ...(course !== undefined && { course }),
                    ...(department !== undefined && { department }),
                    ...(year !== undefined && { year }),
                    ...(bio !== undefined && { bio }),
                    ...(profileImage !== undefined && { profileImage }),
                    ...(careerGoal !== undefined && { careerGoal }),
                    ...(experienceLevel !== undefined && { experienceLevel }),
                    ...(interests !== undefined && { interests }),
                    ...(knownSkills !== undefined && { knownSkills }),
                    ...(onboardingCompleted !== undefined && { onboardingCompleted }),
                }, { new: true }).select('-passwordHash').populate('careerGoal');
            }
            catch (e) {
                updatedUser = null;
            }
        }
        // Also update in fallback store
        const inMemUpdated = fallbackStore_1.fallbackStore.updateUser(String(userId), {
            ...(name && { name: name.trim() }),
            ...(college !== undefined && { college }),
            ...(course !== undefined && { course }),
            ...(department !== undefined && { department }),
            ...(year !== undefined && { year }),
            ...(bio !== undefined && { bio }),
            ...(careerGoal !== undefined && { careerGoal }),
            ...(experienceLevel !== undefined && { experienceLevel }),
            ...(interests !== undefined && { interests }),
            ...(knownSkills !== undefined && { knownSkills }),
            ...(onboardingCompleted !== undefined && { onboardingCompleted }),
        });
        res.json({
            success: true,
            message: 'Profile updated successfully.',
            user: updatedUser || (inMemUpdated ? fallbackStore_1.fallbackStore.sanitizeUser(inMemUpdated) : req.user),
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to update profile.' });
    }
};
exports.updateMe = updateMe;
const logout = async (_req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully.',
    });
};
exports.logout = logout;
