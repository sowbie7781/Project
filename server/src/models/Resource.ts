import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  skill: mongoose.Types.ObjectId;
  type: 'Video' | 'Article' | 'Documentation' | 'Course' | 'Practice' | 'Project';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    type: {
      type: String,
      enum: ['Video', 'Article', 'Documentation', 'Course', 'Practice', 'Project'],
      required: true,
    },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    url: { type: String, required: true, trim: true },
    duration: { type: String, default: '30 mins' },
  },
  { timestamps: true }
);

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
