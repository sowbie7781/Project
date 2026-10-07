import { Request, Response } from 'express';
import { Career } from '../models/Career';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

import mongoose from 'mongoose';
import { fallbackStore } from '../services/fallbackStore';

export const getCareers = async (_req: Request, res: Response): Promise<void> => {
  try {
    let careers: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        careers = await Career.find().populate('requiredSkills.skill').sort({ name: 1 });
      } catch (e) {
        careers = [];
      }
    }
    if (!careers || careers.length === 0) {
      careers = fallbackStore.getCareers();
    }
    res.json({ success: true, careers });
  } catch (err: any) {
    res.json({ success: true, careers: fallbackStore.getCareers() });
  }
};

export const getCareerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let career = null;

    if (mongoose.connection.readyState === 1) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          career = await Career.findById(id).populate('requiredSkills.skill');
        } else {
          career = await Career.findOne({ slug: id.toLowerCase() }).populate('requiredSkills.skill');
        }
      } catch (e) {
        career = null;
      }
    }

    if (!career) {
      career = fallbackStore.getCareerById(id);
    }

    if (!career) {
      res.status(404).json({ success: false, message: 'Career path not found.' });
      return;
    }

    res.json({ success: true, career });
  } catch (err: any) {
    const fallbackCareer = fallbackStore.getCareerById(req.params.id);
    if (fallbackCareer) {
      res.json({ success: true, career: fallbackCareer });
      return;
    }
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch career details.' });
  }
};

export const selectCareerGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { careerId } = req.body;
    if (!careerId) {
      res.status(400).json({ success: false, message: 'Career ID is required.' });
      return;
    }

    let career: any = null;
    if (mongoose.connection.readyState === 1) {
      try {
        career = await Career.findById(careerId);
      } catch (e) {
        career = null;
      }
    }
    if (!career) {
      career = fallbackStore.getCareerById(careerId) || fallbackStore.getCareers()[0];
    }

    if (!career) {
      res.status(404).json({ success: false, message: 'Selected career does not exist.' });
      return;
    }

    const userId = req.user._id || req.user.id;
    let updatedUser: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { careerGoal: career._id },
          { new: true }
        ).select('-passwordHash').populate('careerGoal');
      } catch (e) {
        updatedUser = null;
      }
    }

    // Always record on fallback store
    fallbackStore.updateUser(String(userId), { careerGoal: career });

    res.json({
      success: true,
      message: `Career goal successfully set to ${career.name}.`,
      user: updatedUser || { ...req.user, careerGoal: career },
      career,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update career goal.' });
  }
};
