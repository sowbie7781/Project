"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentResults = exports.submitAssessment = exports.getAssessmentForCareer = exports.getAssessments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Assessment_1 = require("../models/Assessment");
const Question_1 = require("../models/Question");
const AssessmentResult_1 = require("../models/AssessmentResult");
const Progress_1 = require("../models/Progress");
const Career_1 = require("../models/Career");
const fallbackStore_1 = require("../services/fallbackStore");
const getAssessments = async (_req, res) => {
    try {
        let assessments = [];
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                assessments = await Assessment_1.Assessment.find().populate('career', 'name slug difficulty');
            }
            catch (e) {
                assessments = [];
            }
        }
        if (!assessments || assessments.length === 0) {
            assessments = fallbackStore_1.fallbackStore.getAssessments();
        }
        res.json({ success: true, assessments });
    }
    catch (err) {
        res.json({ success: true, assessments: fallbackStore_1.fallbackStore.getAssessments() });
    }
};
exports.getAssessments = getAssessments;
const getAssessmentForCareer = async (req, res) => {
    try {
        const { careerId } = req.params;
        let career = null;
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                if (mongoose_1.default.Types.ObjectId.isValid(careerId)) {
                    career = await Career_1.Career.findById(careerId);
                }
                else {
                    career = await Career_1.Career.findOne({ slug: careerId.toLowerCase() });
                }
            }
            catch (e) {
                career = null;
            }
        }
        if (!career) {
            career = fallbackStore_1.fallbackStore.getCareerById(careerId) || fallbackStore_1.fallbackStore.getCareers()[0];
        }
        let assessment = null;
        let questions = [];
        if (mongoose_1.default.connection.readyState === 1 && career?._id) {
            try {
                assessment = await Assessment_1.Assessment.findOne({ career: career._id });
                if (!assessment) {
                    const rawQ = await Question_1.Question.find({ career: career._id }).select('-correctAnswer');
                    if (rawQ.length > 0) {
                        assessment = await Assessment_1.Assessment.create({
                            title: `${career.name} Competency Assessment`,
                            career: career._id,
                            durationMinutes: 25,
                            questions: rawQ.map((q) => q._id),
                        });
                    }
                }
                if (assessment) {
                    questions = await Question_1.Question.find({ _id: { $in: assessment.questions } })
                        .select('-correctAnswer')
                        .populate('skill', 'name category difficulty');
                }
            }
            catch (e) {
                assessment = null;
            }
        }
        if (!assessment || questions.length === 0) {
            const fallbackData = fallbackStore_1.fallbackStore.getAssessmentForCareer(careerId);
            res.json({
                success: true,
                assessment: fallbackData,
            });
            return;
        }
        res.json({
            success: true,
            assessment: {
                _id: assessment._id,
                title: assessment.title,
                career,
                durationMinutes: assessment.durationMinutes,
                questions,
            },
        });
    }
    catch (err) {
        res.json({
            success: true,
            assessment: fallbackStore_1.fallbackStore.getAssessmentForCareer(req.params.careerId),
        });
    }
};
exports.getAssessmentForCareer = getAssessmentForCareer;
const submitAssessment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { assessmentId } = req.params;
        const { answers } = req.body; // map or array of { questionId, selectedAnswer }
        if (!answers || typeof answers !== 'object') {
            res.status(400).json({ success: false, message: 'Answers object is required for submission.' });
            return;
        }
        const assessment = await Assessment_1.Assessment.findById(assessmentId);
        if (!assessment) {
            res.status(404).json({ success: false, message: 'Assessment not found.' });
            return;
        }
        // Fetch full questions INCLUDING correctAnswer for validation on the server!
        const questions = await Question_1.Question.find({ _id: { $in: assessment.questions } }).populate('skill');
        let correctCount = 0;
        const skillStats = {};
        const questionReview = [];
        questions.forEach((q) => {
            const selected = Array.isArray(answers)
                ? answers.find((a) => a.questionId === q._id.toString())?.selectedAnswer
                : answers[q._id.toString()];
            const isCorrect = selected !== undefined && selected.toString().trim() === q.correctAnswer.toString().trim();
            if (isCorrect)
                correctCount++;
            const skillObj = q.skill;
            const sId = skillObj?._id?.toString() || 'general';
            const sName = skillObj?.name || 'General';
            if (!skillStats[sId]) {
                skillStats[sId] = {
                    skillId: skillObj?._id,
                    skillName: sName,
                    total: 0,
                    correct: 0,
                };
            }
            skillStats[sId].total++;
            if (isCorrect)
                skillStats[sId].correct++;
            questionReview.push({
                questionId: q._id,
                question: q.question,
                options: q.options,
                userAnswer: selected || null,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                isCorrect,
                skillName: sName,
            });
        });
        const totalQuestions = questions.length || 1;
        const overallScore = Math.round((correctCount / totalQuestions) * 100);
        const skillScores = Object.values(skillStats).map((stat) => {
            const score = Math.round((stat.correct / (stat.total || 1)) * 100);
            return {
                skillId: stat.skillId,
                skillName: stat.skillName,
                score,
                totalQuestions: stat.total,
                correctAnswers: stat.correct,
            };
        });
        const strengths = [];
        const weaknesses = [];
        const recommendedSkills = [];
        for (const sc of skillScores) {
            if (sc.score >= 70) {
                strengths.push(sc.skillName);
            }
            else {
                weaknesses.push(sc.skillName);
                recommendedSkills.push(sc.skillName);
            }
            // Update or insert Progress for student
            if (sc.skillId) {
                await Progress_1.Progress.findOneAndUpdate({ user: req.user._id, skill: sc.skillId }, {
                    user: req.user._id,
                    skill: sc.skillId,
                    percentage: sc.score,
                    status: sc.score >= 80 ? 'completed' : 'in_progress',
                    ...(sc.score >= 80 && { completedAt: new Date() }),
                }, { upsert: true, new: true });
            }
        }
        const result = await AssessmentResult_1.AssessmentResult.create({
            user: req.user._id,
            assessment: assessment._id,
            career: assessment.career,
            overallScore,
            totalQuestions,
            correctCount,
            skillScores,
            strengths,
            weaknesses,
            recommendedSkills,
        });
        res.json({
            success: true,
            message: 'Assessment completed and verified.',
            result: {
                _id: result._id,
                overallScore,
                totalQuestions,
                correctCount,
                skillScores,
                strengths,
                weaknesses,
                recommendedSkills,
                questionReview,
                completedAt: result.completedAt,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to submit assessment.' });
    }
};
exports.submitAssessment = submitAssessment;
const getAssessmentResults = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const results = await AssessmentResult_1.AssessmentResult.find({ user: req.user._id })
            .populate('career', 'name slug')
            .populate('assessment', 'title')
            .sort({ completedAt: -1 });
        res.json({ success: true, results });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch assessment history.' });
    }
};
exports.getAssessmentResults = getAssessmentResults;
