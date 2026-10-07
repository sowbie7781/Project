"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProjectSubmissions = exports.submitProject = exports.getProjectById = exports.getProjects = void 0;
const Project_1 = require("../models/Project");
const Project_2 = require("../models/Project");
const mongoose_1 = __importDefault(require("mongoose"));
const fallbackStore_1 = require("../services/fallbackStore");
const getProjects = async (req, res) => {
    try {
        let enriched = [];
        if (mongoose_1.default.connection.readyState === 1) {
            try {
                const { difficulty, careerId } = req.query;
                const filter = {};
                if (difficulty && difficulty !== 'All')
                    filter.difficulty = difficulty;
                if (careerId)
                    filter.career = careerId;
                const projects = await Project_1.Project.find(filter)
                    .populate('skills', 'name category')
                    .populate('career', 'name slug');
                let userSubmissions = [];
                if (req.user) {
                    userSubmissions = await Project_2.ProjectSubmission.find({ user: req.user._id });
                }
                const subMap = new Map();
                userSubmissions.forEach((sub) => {
                    subMap.set(sub.project.toString(), sub);
                });
                enriched = projects.map((p) => {
                    const sub = subMap.get(p._id.toString());
                    return {
                        ...p.toObject(),
                        submissionStatus: sub ? sub.status : 'Not Started',
                        submission: sub || null,
                    };
                });
            }
            catch (e) {
                enriched = [];
            }
        }
        if (!enriched || enriched.length === 0) {
            enriched = fallbackStore_1.fallbackStore.getProjects().map((p) => ({
                ...p,
                submissionStatus: 'Not Started',
                submission: null,
            }));
        }
        res.json({ success: true, projects: enriched });
    }
    catch (err) {
        res.json({
            success: true,
            projects: fallbackStore_1.fallbackStore.getProjects().map((p) => ({
                ...p,
                submissionStatus: 'Not Started',
                submission: null,
            })),
        });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project_1.Project.findById(id).populate('skills', 'name category').populate('career', 'name');
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found.' });
            return;
        }
        res.json({ success: true, project });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch project.' });
    }
};
exports.getProjectById = getProjectById;
const submitProject = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { id } = req.params;
        const { description, githubUrl, demoUrl } = req.body;
        if (!githubUrl || !githubUrl.trim()) {
            res.status(400).json({ success: false, message: 'A valid GitHub repository URL is required.' });
            return;
        }
        // URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        if (!urlPattern.test(githubUrl.trim())) {
            res.status(400).json({ success: false, message: 'Please provide a valid GitHub URL format (e.g., https://github.com/username/project).' });
            return;
        }
        if (demoUrl && demoUrl.trim() && !urlPattern.test(demoUrl.trim())) {
            res.status(400).json({ success: false, message: 'Please provide a valid live demo URL.' });
            return;
        }
        const project = await Project_1.Project.findById(id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found.' });
            return;
        }
        const submission = await Project_2.ProjectSubmission.findOneAndUpdate({ user: req.user._id, project: project._id }, {
            user: req.user._id,
            project: project._id,
            description: description ? description.trim() : 'Project submitted for evaluation',
            githubUrl: githubUrl.trim(),
            demoUrl: demoUrl ? demoUrl.trim() : '',
            status: 'Submitted',
            submittedAt: new Date(),
        }, { upsert: true, new: true });
        res.json({
            success: true,
            message: 'Project submission recorded successfully.',
            submission,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to submit project.' });
    }
};
exports.submitProject = submitProject;
const getUserProjectSubmissions = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized.' });
            return;
        }
        const submissions = await Project_2.ProjectSubmission.find({ user: req.user._id })
            .populate('project', 'title difficulty skills')
            .sort({ submittedAt: -1 });
        res.json({ success: true, submissions });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Failed to fetch project submissions.' });
    }
};
exports.getUserProjectSubmissions = getUserProjectSubmissions;
