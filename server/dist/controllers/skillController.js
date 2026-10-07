"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkillById = exports.getSkills = void 0;
const Skill_1 = require("../models/Skill");
const mongoose_1 = __importDefault(require("mongoose"));
const fallbackStore_1 = require("../services/fallbackStore");
const getSkills = async (_req, res) => {
    try {
        let skills = [];
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                skills = await Skill_1.Skill.find().populate('prerequisites').sort({ category: 1, name: 1 });
            }
            catch (e) {
                skills = [];
            }
        }
        if (!skills || skills.length === 0) {
            skills = fallbackStore_1.fallbackStore.getSkills();
        }
        res.json({ success: true, skills });
    }
    catch (err) {
        res.json({ success: true, skills: fallbackStore_1.fallbackStore.getSkills() });
    }
};
exports.getSkills = getSkills;
const getSkillById = async (req, res) => {
    try {
        const { id } = req.params;
        let skill = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                skill = await Skill_1.Skill.findById(id).populate('prerequisites');
            }
            catch (e) {
                skill = null;
            }
        }
        if (!skill) {
            skill = fallbackStore_1.fallbackStore.getSkills().find(s => s._id === id || s.name.toLowerCase() === id.toLowerCase());
        }
        if (!skill) {
            res.status(404).json({ success: false, message: 'Skill not found.' });
            return;
        }
        res.json({ success: true, skill });
    }
    catch (err) {
        const fallbackSkill = fallbackStore_1.fallbackStore.getSkills().find(s => s._id === req.params.id);
        if (fallbackSkill) {
            res.json({ success: true, skill: fallbackSkill });
            return;
        }
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch skill.' });
    }
};
exports.getSkillById = getSkillById;
