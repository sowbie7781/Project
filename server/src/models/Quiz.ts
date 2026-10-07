import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

export interface IQuiz extends Document {
  title: string;
  skill: mongoose.Types.ObjectId;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        explanation: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);

export interface IQuizAttempt extends Document {
  user: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  score: number; // percentage 0-100
  totalQuestions: number;
  correctAnswers: number;
  userAnswers: number[]; // chosen indices
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    userAnswers: [{ type: Number }],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
