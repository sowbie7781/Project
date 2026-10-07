"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectCareerGoal = exports.getCareerById = exports.getCareers = void 0;
const Career_1 = require("../models/Career");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const fallbackStore_1 = require("../services/fallbackStore");
const getCareers = async (_req, res) => {
    try {
        let careers = [];
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                careers = await Career_1.Career.find().populate('requiredSkills.skill').sort({ name: 1 });
            }
            catch (e) {
                careers = [];
            }
        }
        if (!careers || careers.length === 0) {
            careers = fallbackStore_1.fallbackStore.getCareers();
        }
        res.json({ success: true, careers });
    }
    catch (err) {
        res.json({ success: true, careers: fallbackStore_1.fallbackStore.getCareers() });
    }
};
exports.getCareers = getCareers;
const getCareerById = async (req, res) => {
    try {
        const { id } = req.params;
        let career = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    career = await Career_1.Career.findById(id).populate('requiredSkills.skill');
                }
                else {
                    career = await Career_1.Career.findOne({ slug: id.toLowerCase() }).populate('requiredSkills.skill');
                }
            }
            catch (e) {
                career = null;
            }
        }
        if (!career) {
            career = fallbackStore_1.fallbackStore.getCareerById(id);
        }
        if (!career) {
            res.status(404).json({ success: false, message: 'Career path not found.' });
            return;
        }
        res.json({ success: true, career });
    }
    catch (err) {
        const fallbackCareer = fallbackStore_1.fallbackStore.getCareerById(req.params.id);
        if (fallbackCareer) {
            res.json({ success: true, career: fallbackCareer });
            return;
        }
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch career details.' });
    }
};
exports.getCareerById = getCareerById;
const selectCareerGoal = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { careerId } = req.body;
        if (!careerId) {
            res.status(400).json({ success: false, message: 'Career ID is required.' });
            return;
        }
        let career = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                career = await Career_1.Career.findById(careerId);
            }
            catch (e) {
                career = null;
            }
        }
        if (!career) {
            career = fallbackStore_1.fallbackStore.getCareerById(careerId) || fallbackStore_1.fallbackStore.getCareers()[0];
        }
        if (!career) {
            res.status(404).json({ success: false, message: 'Selected career does not exist.' });
            return;
        }
        const userId = req.user._id || req.user.id;
        let updatedUser = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                updatedUser = await User_1.User.findByIdAndUpdate(userId, { careerGoal: career._id }, { new: true }).select('-passwordHash').populate('careerGoal');
            }
            catch (e) {
                updatedUser = null;
            }
        }
        // Always record on fallback store
        fallbackStore_1.fallbackStore.updateUser(String(userId), { careerGoal: career });
        res.json({
            success: true,
            message: `Career goal successfully set to ${career.name}.`,
            user: updatedUser || { ...req.user, careerGoal: career },
            career,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to update career goal.' });
    }
};
exports.selectCareerGoal = selectCareerGoal;
