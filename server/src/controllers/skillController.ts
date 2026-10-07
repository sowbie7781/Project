import { Request, Response } from 'express';
import { Skill } from '../models/Skill';

import mongoose from 'mongoose';
import { fallbackStore } from '../services/fallbackStore';

export const getSkills = async (_req: Request, res: Response): Promise<void> => {
  try {
    let skills: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        skills = await Skill.find().populate('prerequisites').sort({ category: 1, name: 1 });
      } catch (e) {
        skills = [];
      }
    }
    if (!skills || skills.length === 0) {
      skills = fallbackStore.getSkills();
    }
    res.json({ success: true, skills });
  } catch (err: any) {
    res.json({ success: true, skills: fallbackStore.getSkills() });
  }
};

export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let skill: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        skill = await Skill.findById(id).populate('prerequisites');
      } catch (e) {
        skill = null;
      }
    }

    if (!skill) {
      skill = fallbackStore.getSkills().find(s => s._id === id || s.name.toLowerCase() === id.toLowerCase());
    }

    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found.' });
      return;
    }
    res.json({ success: true, skill });
  } catch (err: any) {
    const fallbackSkill = fallbackStore.getSkills().find(s => s._id === req.params.id);
    if (fallbackSkill) {
      res.json({ success: true, skill: fallbackSkill });
      return;
    }
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch skill.' });
  }
};
