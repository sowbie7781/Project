import { Request, Response } from 'express';
import { Resource } from '../models/Resource';
import { Skill } from '../models/Skill';

export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skillId, difficulty, type, search } = req.query;

    const filter: any = {};

    if (skillId) {
      filter.skill = skillId;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');

      // Search by title or matching skill name
      const matchingSkills = await Skill.find({ name: searchRegex }).select('_id');
      const skillIds = matchingSkills.map((s) => s._id);

      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { skill: { $in: skillIds } },
      ];
    }

    const resources = await Resource.find(filter)
      .populate('skill', 'name category difficulty')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: resources.length, resources });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch learning resources.' });
  }
};
