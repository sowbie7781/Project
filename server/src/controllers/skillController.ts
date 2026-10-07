import { Request, Response } from 'express';
import { Skill } from '../models/Skill';

export const getSkills = async (_req: Request, res: Response): Promise<void> => {
  try {
    const skills = await Skill.find().populate('prerequisites').sort({ category: 1, name: 1 });
    res.json({ success: true, skills });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch skills.' });
  }
};

export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id).populate('prerequisites');
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found.' });
      return;
    }
    res.json({ success: true, skill });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch skill.' });
  }
};
