import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
