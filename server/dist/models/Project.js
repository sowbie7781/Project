"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSubmission = exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Skill' }],
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    requirements: [{ type: String }],
    expectedOutcome: { type: String, required: true },
    technologies: [{ type: String }],
    career: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Career' },
}, { timestamps: true });
exports.Project = mongoose_1.default.model('Project', ProjectSchema);
const ProjectSubmissionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    description: { type: String, default: '' },
    githubUrl: { type: String, required: true, trim: true },
    demoUrl: { type: String, default: '', trim: true },
    status: {
        type: String,
        enum: ['In Progress', 'Submitted', 'Reviewed', 'Approved'],
        default: 'Submitted',
    },
    feedback: String,
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.ProjectSubmission = mongoose_1.default.model('ProjectSubmission', ProjectSubmissionSchema);
