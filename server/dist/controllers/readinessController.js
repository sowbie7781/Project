"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCareerReadiness = void 0;
const Career_1 = require("../models/Career");
const AssessmentResult_1 = require("../models/AssessmentResult");
const Progress_1 = require("../models/Progress");
const Roadmap_1 = require("../models/Roadmap");
const Quiz_1 = require("../models/Quiz");
const Project_1 = require("../models/Project");
const InterviewSession_1 = require("../models/InterviewSession");
const getCareerReadiness = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const careerId = req.query.careerId || req.user.careerGoal;
        if (!careerId) {
            res.status(400).json({ success: false, message: 'Please select a career goal to view readiness.' });
            return;
        }
        const career = await Career_1.Career.findById(careerId).populate('requiredSkills.skill');
        if (!career) {
            res.status(404).json({ success: false, message: 'Career not found.' });
            return;
        }
        // 1. Assessment Component (25%)
        const latestAssessment = await AssessmentResult_1.AssessmentResult.findOne({ user: req.user._id, career: career._id }).sort({ completedAt: -1 });
        const assessmentScore = latestAssessment ? latestAssessment.overallScore : 0;
        // 2. Skill Mastery Component (25%)
        const progressRecords = await Progress_1.Progress.find({ user: req.user._id });
        const progressMap = new Map();
        progressRecords.forEach((p) => progressMap.set(p.skill.toString(), p.percentage));
        let masteredSkills = 0;
        const requiredSkillsCount = career.requiredSkills.length || 1;
        career.requiredSkills.forEach((item) => {
            const sId = item.skill?._id?.toString();
            const pct = (sId && progressMap.get(sId)) || 0;
            if (pct >= (item.requiredLevel || 70)) {
                masteredSkills++;
            }
        });
        const skillScore = Math.min(100, Math.round((masteredSkills / requiredSkillsCount) * 100));
        // 3. Learning Roadmap Completion (20%)
        const roadmap = await Roadmap_1.Roadmap.findOne({ user: req.user._id, career: career._id });
        const roadmapScore = roadmap ? roadmap.progress : 0;
        // 4. Quiz Performance (10%)
        const quizAttempts = await Quiz_1.QuizAttempt.find({ user: req.user._id });
        let quizScore = 0;
        if (quizAttempts.length > 0) {
            quizScore = Math.round(quizAttempts.reduce((acc, q) => acc + q.score, 0) / quizAttempts.length);
        }
        // 5. Applied Project Submissions (10%)
        const projectSubmissions = await Project_1.ProjectSubmission.find({ user: req.user._id });
        const projectScore = Math.min(100, Math.round((projectSubmissions.length / 2) * 100)); // 2 projects = 100%
        // 6. Interview Preparedness (10%)
        const interviewSessions = await InterviewSession_1.InterviewSession.find({ user: req.user._id });
        const interviewScore = Math.min(100, Math.round((interviewSessions.length / 2) * 100)); // 2 sessions = 100%
        // Deterministic Composite Calculation
        const overallReadiness = Math.round(assessmentScore * 0.25 +
            skillScore * 0.25 +
            roadmapScore * 0.20 +
            quizScore * 0.10 +
            projectScore * 0.10 +
            interviewScore * 0.10);
        let stage = 'Foundational Explorer';
        let summaryNote = 'You have initiated your career preparation journey. Complete the diagnostic assessment to unlock immediate roadmap acceleration.';
        if (overallReadiness >= 85) {
            stage = 'Distinguished Job-Ready Candidate';
            summaryNote = 'Exceptional readiness! Your technical benchmarks, project deliverables, and interview practice demonstrate high industry alignment.';
        }
        else if (overallReadiness >= 70) {
            stage = 'Job-Ready Candidate';
            summaryNote = 'Strong career preparation! You meet primary core requirements with solid hands-on competencies.';
        }
        else if (overallReadiness >= 45) {
            stage = 'Developing Practitioner';
            summaryNote = 'Steady momentum! Focus on your critical skill gaps and complete hands-on project submissions to cross the 70% job-ready threshold.';
        }
        res.json({
            success: true,
            career: { id: career._id, name: career.name },
            overallReadiness,
            stage,
            summaryNote,
            breakdown: [
                {
                    category: 'Diagnostic Assessment',
                    weight: 25,
                    score: assessmentScore,
                    weightedValue: Math.round(assessmentScore * 0.25),
                    description: 'Career-tailored MCQ & scenario assessment performance',
                    status: assessmentScore > 0 ? 'Completed' : 'Action Needed',
                },
                {
                    category: 'Skill Requirements Mastery',
                    weight: 25,
                    score: skillScore,
                    weightedValue: Math.round(skillScore * 0.25),
                    description: `${masteredSkills} of ${requiredSkillsCount} required industry skills verified`,
                    status: skillScore >= 70 ? 'Strong' : 'In Progress',
                },
                {
                    category: 'Curriculum Roadmap Progress',
                    weight: 20,
                    score: roadmapScore,
                    weightedValue: Math.round(roadmapScore * 0.2),
                    description: 'Percentage of structured learning path topics completed',
                    status: roadmapScore >= 50 ? 'On Track' : 'Needs Focus',
                },
                {
                    category: 'Knowledge Quizzes',
                    weight: 10,
                    score: quizScore,
                    weightedValue: Math.round(quizScore * 0.1),
                    description: `${quizAttempts.length} quizzes attempted with average score of ${quizScore}%`,
                    status: quizAttempts.length > 0 ? 'Active' : 'Not Started',
                },
                {
                    category: 'Applied Project Submissions',
                    weight: 10,
                    score: projectScore,
                    weightedValue: Math.round(projectScore * 0.1),
                    description: `${projectSubmissions.length} portfolio project(s) delivered with GitHub proof`,
                    status: projectSubmissions.length >= 2 ? 'Target Reached' : 'Deliver Projects',
                },
                {
                    category: 'Interview Preparation',
                    weight: 10,
                    score: interviewScore,
                    weightedValue: Math.round(interviewScore * 0.1),
                    description: `${interviewSessions.length} technical & behavioral mock interview rounds completed`,
                    status: interviewSessions.length >= 2 ? 'Interview Ready' : 'Practice More',
                },
            ],
            formulaExplanation: 'Overall Readiness = (Assessment × 25%) + (Skills × 25%) + (Roadmap × 20%) + (Quizzes × 10%) + (Projects × 10%) + (Interviews × 10%)',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to calculate career readiness.' });
    }
};
exports.getCareerReadiness = getCareerReadiness;
