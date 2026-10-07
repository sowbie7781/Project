"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviewHistory = exports.evaluateInterviewAnswer = exports.generateInterviewQuestions = void 0;
const InterviewSession_1 = require("../models/InterviewSession");
const Career_1 = require("../models/Career");
const aiService_1 = require("../services/aiService");
const generateInterviewQuestions = async (req, res) => {
    try {
        const { careerId, trackType } = req.body;
        const targetCareerId = careerId || req.user?.careerGoal;
        if (!targetCareerId) {
            res.status(400).json({ success: false, message: 'Career path must be selected to generate interview questions.' });
            return;
        }
        const career = await Career_1.Career.findById(targetCareerId);
        if (!career) {
            res.status(404).json({ success: false, message: 'Career not found.' });
            return;
        }
        const track = trackType || 'Technical';
        const questions = await aiService_1.aiService.generateInterviewQuestions(career.name, track);
        res.json({
            success: true,
            career: { id: career._id, name: career.name },
            track,
            questions,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to generate interview questions.' });
    }
};
exports.generateInterviewQuestions = generateInterviewQuestions;
const evaluateInterviewAnswer = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { careerId, trackType, question, answer } = req.body;
        if (!question || !answer || !answer.trim()) {
            res.status(400).json({ success: false, message: 'Both question and candidate response are required.' });
            return;
        }
        const targetCareerId = careerId || req.user.careerGoal;
        const career = await Career_1.Career.findById(targetCareerId);
        const careerName = career ? career.name : 'Software Engineering';
        const feedback = await aiService_1.aiService.evaluateInterviewAnswer({
            careerName,
            track: trackType || 'Technical',
            question,
            answer,
        });
        // Save session log
        if (career) {
            await InterviewSession_1.InterviewSession.create({
                user: req.user._id,
                career: career._id,
                trackType: trackType || 'Technical',
                questions: [question],
                answers: [answer],
                feedback,
            });
        }
        res.json({
            success: true,
            feedback,
            disclaimer: 'Note: AI evaluation feedback provides constructive educational guidance and is not an official hiring or employment assessment.',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to evaluate interview response.' });
    }
};
exports.evaluateInterviewAnswer = evaluateInterviewAnswer;
const getInterviewHistory = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const sessions = await InterviewSession_1.InterviewSession.find({ user: req.user._id })
            .populate('career', 'name slug')
            .sort({ createdAt: -1 });
        res.json({ success: true, sessions });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch interview history.' });
    }
};
exports.getInterviewHistory = getInterviewHistory;
