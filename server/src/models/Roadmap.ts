import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmapTopic {
  id: string;
  title: string;
  description: string;
  skillName?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
  completed: boolean;
  completedAt?: Date;
}

export interface IRoadmapPhase {
  phaseNumber: number;
  name: string;
  description: string;
  topics: IRoadmapTopic[];
}

export interface IRoadmap extends Document {
  user: mongoose.Types.ObjectId;
  career: mongoose.Types.ObjectId;
  phases: IRoadmapPhase[];
  progress: number; // 0-100 percentage
  generatedByAI: boolean;
  aiNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    phases: [
      {
        phaseNumber: Number,
        name: String,
        description: String,
        topics: [
          {
            id: String,
            title: String,
            description: String,
            skillName: String,
            difficulty: String,
            estimatedTime: String,
            prerequisites: [String],
            resources: [
              {
                title: String,
                url: String,
                type: { type: String },
              },
            ],
            completed: { type: Boolean, default: false },
            completedAt: Date,
          },
        ],
      },
    ],
    progress: { type: Number, default: 0 },
    generatedByAI: { type: Boolean, default: false },
    aiNotes: String,
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
