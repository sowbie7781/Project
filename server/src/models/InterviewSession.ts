import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewSession extends Document {
  user: mongoose.Types.ObjectId;
  career: mongoose.Types.ObjectId;
  trackType: 'Technical' | 'HR' | 'Behavioral' | 'Mock Interview';
  questions: string[];
  answers: string[];
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    improvementAreas: string[];
    overallScore: number;
    summary: string;
  };
  createdAt: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    trackType: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Mock Interview'],
      default: 'Technical',
    },
    questions: [{ type: String }],
    answers: [{ type: String }],
    feedback: {
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
      improvementAreas: [{ type: String }],
      overallScore: { type: Number, default: 70 },
      summary: { type: String, default: '' },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);
