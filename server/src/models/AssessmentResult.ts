import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillScoreItem {
  skillId: mongoose.Types.ObjectId;
  skillName: string;
  score: number; // 0-100
  totalQuestions: number;
  correctAnswers: number;
}

export interface IAssessmentResult extends Document {
  user: mongoose.Types.ObjectId;
  assessment: mongoose.Types.ObjectId;
  career: mongoose.Types.ObjectId;
  overallScore: number;
  totalQuestions: number;
  correctCount: number;
  skillScores: ISkillScoreItem[];
  strengths: string[];
  weaknesses: string[];
  recommendedSkills: string[];
  completedAt: Date;
}

const AssessmentResultSchema = new Schema<IAssessmentResult>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    overallScore: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    skillScores: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
        skillName: String,
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
      },
    ],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendedSkills: [{ type: String }],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AssessmentResult = mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
