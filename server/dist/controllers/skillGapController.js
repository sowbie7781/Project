"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkillGapAnalysis = void 0;
const Career_1 = require("../models/Career");
const Progress_1 = require("../models/Progress");
const aiService_1 = require("../services/aiService");
const getSkillGapAnalysis = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const careerId = req.query.careerId || req.user.careerGoal;
        if (!careerId) {
            res.status(400).json({ success: false, message: 'No career path selected yet. Please select a career goal.' });
            return;
        }
        const career = await Career_1.Career.findById(careerId).populate('requiredSkills.skill');
        if (!career) {
            res.status(404).json({ success: false, message: 'Career path not found.' });
            return;
        }
        // Fetch student's progress records
        const progressRecords = await Progress_1.Progress.find({ user: req.user._id });
        const progressMap = new Map();
        progressRecords.forEach((p) => {
            progressMap.set(p.skill.toString(), p.percentage);
        });
        const comparisonSkills = [];
        const gaps = career.requiredSkills.map((item) => {
            const skill = item.skill;
            const skillId = skill?._id?.toString();
            const currentLevel = (skillId && progressMap.get(skillId)) || 0;
            const requiredLevel = item.requiredLevel || 75;
            const gap = Math.max(0, requiredLevel - currentLevel);
            let priority = 'Low';
            if (gap >= 50)
                priority = 'Critical';
            else if (gap >= 30)
                priority = 'High';
            else if (gap >= 15)
                priority = 'Medium';
            if (skill?.name) {
                comparisonSkills.push({
                    name: skill.name,
                    current: currentLevel,
                    required: requiredLevel,
                });
            }
            return {
                skillId,
                skillName: skill?.name || 'Unknown Skill',
                category: skill?.category || 'General',
                currentLevel,
                requiredLevel,
                gap,
                priority,
                importance: item.importance || 'Essential',
                status: currentLevel >= requiredLevel ? 'Mastered' : currentLevel > 0 ? 'In Progress' : 'Not Started',
            };
        });
        // Sort by priority severity: Critical > High > Medium > Low
        const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        gaps.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || b.gap - a.gap);
        // Call AI service for executive summary & actionable advice
        const aiAnalysis = await aiService_1.aiService.analyzeSkillGap(career.name, comparisonSkills);
        const totalSkills = gaps.length || 1;
        const masteredCount = gaps.filter((g) => g.currentLevel >= g.requiredLevel).length;
        const averageCompetency = Math.round(gaps.reduce((acc, g) => acc + g.currentLevel, 0) / totalSkills);
        res.json({
            success: true,
            career: {
                id: career._id,
                name: career.name,
                difficulty: career.difficulty,
            },
            summary: {
                totalSkills,
                masteredCount,
                averageCompetency,
                readinessEstimate: aiAnalysis.readinessEstimate,
                criticalGapsCount: gaps.filter((g) => g.priority === 'Critical').length,
                aiExecutiveSummary: aiAnalysis.summary,
            },
            gaps,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to calculate skill gaps.' });
    }
};
exports.getSkillGapAnalysis = getSkillGapAnalysis;
