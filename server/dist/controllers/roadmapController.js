"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopicStatus = exports.generateOrRegenerateRoadmap = exports.getRoadmap = void 0;
const Roadmap_1 = require("../models/Roadmap");
const Career_1 = require("../models/Career");
const Progress_1 = require("../models/Progress");
const aiService_1 = require("../services/aiService");
const getRoadmap = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const careerId = req.query.careerId || req.user.careerGoal;
        if (!careerId) {
            res.status(400).json({ success: false, message: 'Please select a career goal to view your roadmap.' });
            return;
        }
        let roadmap = await Roadmap_1.Roadmap.findOne({ user: req.user._id, career: careerId }).populate('career', 'name slug');
        if (!roadmap) {
            // Auto-generate if not yet created
            const career = await Career_1.Career.findById(careerId);
            if (!career) {
                res.status(404).json({ success: false, message: 'Career not found.' });
                return;
            }
            const generated = await aiService_1.aiService.generateLearningRoadmap({
                careerName: career.name,
                experienceLevel: req.user.experienceLevel || 'Beginner',
                skillGaps: [],
                knownSkills: req.user.knownSkills || [],
            });
            roadmap = await Roadmap_1.Roadmap.create({
                user: req.user._id,
                career: career._id,
                phases: generated.phases,
                progress: 0,
                generatedByAI: generated.generatedByAI,
                aiNotes: generated.notes,
            });
            roadmap = await Roadmap_1.Roadmap.findById(roadmap._id).populate('career', 'name slug');
        }
        res.json({ success: true, roadmap });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch roadmap.' });
    }
};
exports.getRoadmap = getRoadmap;
const generateOrRegenerateRoadmap = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const careerId = req.body.careerId || req.user.careerGoal;
        if (!careerId) {
            res.status(400).json({ success: false, message: 'Career goal required to generate roadmap.' });
            return;
        }
        const career = await Career_1.Career.findById(careerId).populate('requiredSkills.skill');
        if (!career) {
            res.status(404).json({ success: false, message: 'Career not found.' });
            return;
        }
        // Fetch current progress to build context
        const progressRecords = await Progress_1.Progress.find({ user: req.user._id });
        const progressMap = new Map();
        progressRecords.forEach((p) => progressMap.set(p.skill.toString(), p.percentage));
        const skillGaps = career.requiredSkills.map((item) => {
            const sId = item.skill?._id?.toString();
            const currentLevel = (sId && progressMap.get(sId)) || 0;
            return {
                skillName: item.skill?.name || 'Skill',
                currentLevel,
                requiredLevel: item.requiredLevel,
                gap: Math.max(0, item.requiredLevel - currentLevel),
            };
        });
        const aiPlan = await aiService_1.aiService.generateLearningRoadmap({
            careerName: career.name,
            experienceLevel: req.user.experienceLevel || 'Beginner',
            skillGaps,
            knownSkills: req.user.knownSkills || [],
        });
        // Save or update existing roadmap
        let roadmap = await Roadmap_1.Roadmap.findOne({ user: req.user._id, career: career._id });
        if (roadmap) {
            roadmap.phases = aiPlan.phases;
            roadmap.generatedByAI = aiPlan.generatedByAI;
            roadmap.aiNotes = aiPlan.notes;
            roadmap.progress = 0;
            await roadmap.save();
        }
        else {
            roadmap = await Roadmap_1.Roadmap.create({
                user: req.user._id,
                career: career._id,
                phases: aiPlan.phases,
                progress: 0,
                generatedByAI: aiPlan.generatedByAI,
                aiNotes: aiPlan.notes,
            });
        }
        roadmap = await Roadmap_1.Roadmap.findById(roadmap._id).populate('career', 'name slug');
        res.json({
            success: true,
            message: 'Personalized AI learning roadmap generated successfully.',
            roadmap,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to generate roadmap.' });
    }
};
exports.generateOrRegenerateRoadmap = generateOrRegenerateRoadmap;
const updateTopicStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { topicId } = req.params;
        const { completed } = req.body; // boolean
        const roadmap = await Roadmap_1.Roadmap.findOne({ user: req.user._id });
        if (!roadmap) {
            res.status(404).json({ success: false, message: 'Roadmap not found.' });
            return;
        }
        let topicFound = false;
        let totalTopics = 0;
        let completedTopics = 0;
        roadmap.phases.forEach((phase) => {
            phase.topics.forEach((topic) => {
                totalTopics++;
                if (topic.id === topicId) {
                    topic.completed = completed !== undefined ? completed : !topic.completed;
                    topic.completedAt = topic.completed ? new Date() : undefined;
                    topicFound = true;
                }
                if (topic.completed) {
                    completedTopics++;
                }
            });
        });
        if (!topicFound) {
            res.status(404).json({ success: false, message: 'Topic ID not found in current roadmap.' });
            return;
        }
        roadmap.progress = Math.round((completedTopics / (totalTopics || 1)) * 100);
        await roadmap.save();
        res.json({
            success: true,
            message: 'Topic status updated successfully.',
            roadmap,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to update topic status.' });
    }
};
exports.updateTopicStatus = updateTopicStatus;
