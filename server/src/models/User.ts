import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  college: string;
  course: string;
  department: string;
  year: string;
  careerGoal?: mongoose.Types.ObjectId;
  profileImage?: string;
  bio?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  interests?: string[];
  knownSkills?: string[];
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    college: { type: String, default: '' },
    course: { type: String, default: '' },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    careerGoal: { type: Schema.Types.ObjectId, ref: 'Career' },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '' },
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    interests: [{ type: String }],
    knownSkills: [{ type: String }],
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
