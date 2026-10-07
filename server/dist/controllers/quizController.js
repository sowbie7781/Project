"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserQuizHistory = exports.submitQuizAttempt = exports.getQuizById = exports.getQuizzes = void 0;
const Quiz_1 = require("../models/Quiz");
const Quiz_2 = require("../models/Quiz");
const Progress_1 = require("../models/Progress");
const mongoose_1 = __importDefault(require("mongoose"));
const fallbackStore_1 = require("../services/fallbackStore");
const getQuizzes = async (req, res) => {
    try {
        let formatted = [];
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                const { skillId, difficulty } = req.query;
                const filter = {};
                if (skillId)
                    filter.skill = skillId;
                if (difficulty && difficulty !== 'All')
                    filter.difficulty = difficulty;
                const quizzes = await Quiz_1.Quiz.find(filter)
                    .populate('skill', 'name category difficulty')
                    .select('title skill difficulty questions.length');
                formatted = quizzes.map((q) => ({
                    _id: q._id,
                    title: q.title,
                    skill: q.skill,
                    difficulty: q.difficulty,
                    questionCount: q.questions ? q.questions.length : 0,
                }));
            }
            catch (e) {
                formatted = [];
            }
        }
        if (!formatted || formatted.length === 0) {
            formatted = fallbackStore_1.fallbackStore.getQuizzes().map((q) => ({
                _id: q._id,
                title: q.title,
                skill: q.skill,
                difficulty: q.difficulty || 'Intermediate',
                questionCount: q.questions ? q.questions.length : 1,
            }));
        }
        res.json({ success: true, quizzes: formatted });
    }
    catch (err) {
        res.json({
            success: true,
            quizzes: fallbackStore_1.fallbackStore.getQuizzes().map((q) => ({
                _id: q._id,
                title: q.title,
                skill: q.skill,
                difficulty: q.difficulty || 'Intermediate',
                questionCount: q.questions ? q.questions.length : 1,
            })),
        });
    }
};
exports.getQuizzes = getQuizzes;
const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz_1.Quiz.findById(id).populate('skill', 'name category');
        if (!quiz) {
            res.status(404).json({ success: false, message: 'Quiz not found.' });
            return;
        }
        // Strip out correctAnswer before student submits
        const sanitizedQuestions = quiz.questions.map((q, idx) => ({
            questionIndex: idx,
            question: q.question,
            options: q.options,
        }));
        res.json({
            success: true,
            quiz: {
                _id: quiz._id,
                title: quiz.title,
                skill: quiz.skill,
                difficulty: quiz.difficulty,
                questions: sanitizedQuestions,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch quiz details.' });
    }
};
exports.getQuizById = getQuizById;
const submitQuizAttempt = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { id } = req.params;
        const { answers } = req.body; // array of numbers or object { [index]: selectedIdx }
        const quiz = await Quiz_1.Quiz.findById(id).populate('skill');
        if (!quiz) {
            res.status(404).json({ success: false, message: 'Quiz not found.' });
            return;
        }
        let correctCount = 0;
        const userAnswersList = [];
        const questionReview = [];
        quiz.questions.forEach((q, idx) => {
            const selected = Array.isArray(answers) ? answers[idx] : answers[idx.toString()];
            const parsedSelection = typeof selected === 'number' ? selected : parseInt(selected, 10);
            userAnswersList.push(parsedSelection);
            const isCorrect = parsedSelection === q.correctAnswer;
            if (isCorrect)
                correctCount++;
            questionReview.push({
                questionIndex: idx,
                question: q.question,
                options: q.options,
                userAnswer: parsedSelection,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                isCorrect,
            });
        });
        const totalQuestions = quiz.questions.length || 1;
        const score = Math.round((correctCount / totalQuestions) * 100);
        // Save attempt
        const attempt = await Quiz_2.QuizAttempt.create({
            user: req.user._id,
            quiz: quiz._id,
            score,
            totalQuestions,
            correctAnswers: correctCount,
            userAnswers: userAnswersList,
        });
        // Update student progress on this skill
        if (quiz.skill) {
            const skillId = quiz.skill._id;
            const existingProg = await Progress_1.Progress.findOne({ user: req.user._id, skill: skillId });
            const currentPct = existingProg ? existingProg.percentage : 0;
            const newPct = Math.max(currentPct, score);
            await Progress_1.Progress.findOneAndUpdate({ user: req.user._id, skill: skillId }, {
                percentage: newPct,
                status: newPct >= 80 ? 'completed' : 'in_progress',
                ...(newPct >= 80 && { completedAt: new Date() }),
            }, { upsert: true, new: true });
        }
        // Fetch user attempt stats
        const allAttempts = await Quiz_2.QuizAttempt.find({ user: req.user._id, quiz: quiz._id }).sort({ completedAt: -1 });
        const scores = allAttempts.map((a) => a.score);
        const bestScore = Math.max(...scores);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        res.json({
            success: true,
            result: {
                attemptId: attempt._id,
                score,
                totalQuestions,
                correctAnswers: correctCount,
                questionReview,
                stats: {
                    totalAttempts: allAttempts.length,
                    bestScore,
                    averageScore,
                    latestScore: score,
                },
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to submit quiz attempt.' });
    }
};
exports.submitQuizAttempt = submitQuizAttempt;
const getUserQuizHistory = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const attempts = await Quiz_2.QuizAttempt.find({ user: req.user._id })
            .populate({
            path: 'quiz',
            populate: { path: 'skill', select: 'name' },
        })
            .sort({ completedAt: -1 });
        res.json({ success: true, attempts });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch quiz history.' });
    }
};
exports.getUserQuizHistory = getUserQuizHistory;
