import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  skills: mongoose.Types.ObjectId[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requirements: string[];
  expectedOutcome: string;
  technologies: string[];
  career?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    requirements: [{ type: String }],
    expectedOutcome: { type: String, required: true },
    technologies: [{ type: String }],
    career: { type: Schema.Types.ObjectId, ref: 'Career' },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

export interface IProjectSubmission extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  description: string;
  githubUrl: string;
  demoUrl: string;
  status: 'In Progress' | 'Submitted' | 'Reviewed' | 'Approved';
  feedback?: string;
  submittedAt: Date;
}

const ProjectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
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
  },
  { timestamps: true }
);

export const ProjectSubmission = mongoose.model<IProjectSubmission>('ProjectSubmission', ProjectSubmissionSchema);
