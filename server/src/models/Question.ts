import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  career: mongoose.Types.ObjectId;
  skill: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'mcq' | 'true_false' | 'scenario';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    type: { type: String, enum: ['mcq', 'true_false', 'scenario'], default: 'mcq' },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
