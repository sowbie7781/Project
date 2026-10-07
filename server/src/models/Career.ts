import mongoose, { Document, Schema } from 'mongoose';

export interface IRequiredSkill {
  skill: mongoose.Types.ObjectId;
  requiredLevel: number; // e.g. 80 for 80%
  importance: 'Essential' | 'Important' | 'Nice-to-have';
}

export interface ICareer extends Document {
  name: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredSkills: IRequiredSkill[];
  prerequisites: string[];
  learningPhases: {
    phaseNumber: number;
    title: string;
    description: string;
  }[];
  exampleProjects: {
    title: string;
    description: string;
  }[];
  interviewTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    requiredSkills: [
      {
        skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
        requiredLevel: { type: Number, required: true, min: 0, max: 100 },
        importance: { type: String, enum: ['Essential', 'Important', 'Nice-to-have'], default: 'Essential' },
      },
    ],
    prerequisites: [{ type: String }],
    learningPhases: [
      {
        phaseNumber: Number,
        title: String,
        description: String,
      },
    ],
    exampleProjects: [
      {
        title: String,
        description: String,
      },
    ],
    interviewTopics: [{ type: String }],
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>('Career', CareerSchema);
