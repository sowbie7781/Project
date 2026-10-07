import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  skill: mongoose.Types.ObjectId;
  percentage: number;
  status: 'locked' | 'recommended' | 'in_progress' | 'completed';
  completedAt?: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['locked', 'recommended', 'in_progress', 'completed'],
      default: 'recommended',
    },
    completedAt: Date,
  },
  { timestamps: true }
);

export const Progress = mongoose.model<IProgress>('Progress', ProgressSchema);
