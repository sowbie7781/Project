import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessment extends Document {
  title: string;
  career: mongoose.Types.ObjectId;
  description: string;
  durationMinutes: number;
  questions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, default: 30 },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
