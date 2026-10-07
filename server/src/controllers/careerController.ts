import { Request, Response } from 'express';
import { Career } from '../models/Career';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getCareers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const careers = await Career.find().populate('requiredSkills.skill').sort({ name: 1 });
    res.json({ success: true, careers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch career list.' });
  }
};

export const getCareerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let career = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      career = await Career.findById(id).populate('requiredSkills.skill');
    } else {
      career = await Career.findOne({ slug: id.toLowerCase() }).populate('requiredSkills.skill');
    }

    if (!career) {
      res.status(404).json({ success: false, message: 'Career path not found.' });
      return;
    }

    res.json({ success: true, career });
  } catch (err: any) {
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

    const career = await Career.findById(careerId);
    if (!career) {
      res.status(404).json({ success: false, message: 'Selected career does not exist.' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { careerGoal: career._id },
      { new: true }
    ).select('-passwordHash').populate('careerGoal');

    res.json({
      success: true,
      message: `Career goal successfully set to ${career.name}.`,
      user: updatedUser,
      career,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update career goal.' });
  }
};
