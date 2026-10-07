import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

import mongoose from 'mongoose';
import { fallbackStore } from '../services/fallbackStore';

const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'skillpath_default_jwt_secret_college';
  return jwt.sign({ id: userId, role }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, college, course, department, year } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing in DB if connected
    let existingUser: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        existingUser = await User.findOne({ email: cleanEmail });
      } catch (e) {
        existingUser = null;
      }
    }

    // Also check fallback store
    if (!existingUser) {
      existingUser = fallbackStore.findUserByEmail(cleanEmail);
    }

    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        newUser = await User.create({
          name: name.trim(),
          email: cleanEmail,
          passwordHash,
          college: college || '',
          course: course || '',
          department: department || '',
          year: year || '',
          role: 'student',
          onboardingCompleted: false,
        });
      } catch (dbErr: any) {
        console.warn('[Register] DB save skipped, using in-memory store:', dbErr.message);
      }
    }

    // Always ensure user is saved in fallbackStore for resilient session hydration
    if (!newUser) {
      newUser = fallbackStore.createUser({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        college: college || '',
        course: course || '',
        department: department || '',
        year: year || '',
        role: 'student',
        onboardingCompleted: false,
      });
    } else {
      fallbackStore.createUser({
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        passwordHash: newUser.passwordHash,
        college: newUser.college,
        course: newUser.course,
        department: newUser.department,
        year: newUser.year,
        role: newUser.role,
        onboardingCompleted: newUser.onboardingCompleted,
      });
    }

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        college: newUser.college,
        course: newUser.course,
        department: newUser.department,
        year: newUser.year,
        onboardingCompleted: newUser.onboardingCompleted,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check DB first if connected
    let user: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: cleanEmail }).populate('careerGoal');
      } catch (dbErr: any) {
        console.warn('[Login] DB query failed, falling back to in-memory store:', dbErr.message);
      }
    }

    // If not found in DB or DB is disconnected, check fallback store
    if (!user) {
      const fallbackUser = fallbackStore.findUserByEmail(cleanEmail);
      if (fallbackUser) {
        const isMatch = fallbackStore.verifyPassword(cleanEmail, password, fallbackUser.passwordHash);
        if (!isMatch) {
          res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
          return;
        }

        const token = generateToken(fallbackUser._id.toString(), fallbackUser.role);
        res.json({
          success: true,
          message: 'Login successful.',
          token,
          user: fallbackStore.sanitizeUser(fallbackUser),
        });
        return;
      }

      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      // Also try fallback verification for demo student & admin fast-pass passwords
      const fallbackPass = fallbackStore.verifyPassword(cleanEmail, password);
      if (!fallbackPass) {
        res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
        return;
      }
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        course: user.course,
        department: user.department,
        year: user.year,
        careerGoal: user.careerGoal,
        experienceLevel: user.experienceLevel,
        interests: user.interests,
        knownSkills: user.knownSkills,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const userId = req.user._id || req.user.id;
    let populatedUser: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        populatedUser = await User.findById(userId).select('-passwordHash').populate('careerGoal');
      } catch (e) {
        populatedUser = null;
      }
    }

    if (!populatedUser) {
      const fallbackUser = fallbackStore.findUserById(String(userId));
      if (fallbackUser) {
        populatedUser = fallbackStore.sanitizeUser(fallbackUser);
      } else {
        populatedUser = req.user;
      }
    }

    res.json({
      success: true,
      user: populatedUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch user session.' });
  }
};

export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const userId = req.user._id || req.user.id;
    const { name, college, course, department, year, bio, profileImage, careerGoal, experienceLevel, interests, knownSkills, onboardingCompleted } = req.body;

    let updatedUser: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            ...(name && { name: name.trim() }),
            ...(college !== undefined && { college }),
            ...(course !== undefined && { course }),
            ...(department !== undefined && { department }),
            ...(year !== undefined && { year }),
            ...(bio !== undefined && { bio }),
            ...(profileImage !== undefined && { profileImage }),
            ...(careerGoal !== undefined && { careerGoal }),
            ...(experienceLevel !== undefined && { experienceLevel }),
            ...(interests !== undefined && { interests }),
            ...(knownSkills !== undefined && { knownSkills }),
            ...(onboardingCompleted !== undefined && { onboardingCompleted }),
          },
          { new: true }
        ).select('-passwordHash').populate('careerGoal');
      } catch (e) {
        updatedUser = null;
      }
    }

    // Also update in fallback store
    const inMemUpdated = fallbackStore.updateUser(String(userId), {
      ...(name && { name: name.trim() }),
      ...(college !== undefined && { college }),
      ...(course !== undefined && { course }),
      ...(department !== undefined && { department }),
      ...(year !== undefined && { year }),
      ...(bio !== undefined && { bio }),
      ...(careerGoal !== undefined && { careerGoal }),
      ...(experienceLevel !== undefined && { experienceLevel }),
      ...(interests !== undefined && { interests }),
      ...(knownSkills !== undefined && { knownSkills }),
      ...(onboardingCompleted !== undefined && { onboardingCompleted }),
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser || (inMemUpdated ? fallbackStore.sanitizeUser(inMemUpdated) : req.user),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update profile.' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};
