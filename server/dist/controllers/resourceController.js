"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResources = void 0;
const Resource_1 = require("../models/Resource");
const Skill_1 = require("../models/Skill");
const getResources = async (req, res) => {
    try {
        const { skillId, difficulty, type, search } = req.query;
        const filter = {};
        if (skillId) {
            filter.skill = skillId;
        }
        if (difficulty && difficulty !== 'All') {
            filter.difficulty = difficulty;
        }
        if (type && type !== 'All') {
            filter.type = type;
        }
        if (search && typeof search === 'string' && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            // Search by title or matching skill name
            const matchingSkills = await Skill_1.Skill.find({ name: searchRegex }).select('_id');
            const skillIds = matchingSkills.map((s) => s._id);
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { skill: { $in: skillIds } },
            ];
        }
        const resources = await Resource_1.Resource.find(filter)
            .populate('skill', 'name category difficulty')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: resources.length, resources });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch learning resources.' });
    }
};
exports.getResources = getResources;
