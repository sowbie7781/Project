import { Response } from 'express';
import { Roadmap } from '../models/Roadmap';
import { Career } from '../models/Career';
import { Progress } from '../models/Progress';
import { AuthRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';

export const getRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const careerId = req.query.careerId || req.user.careerGoal;
    if (!careerId) {
      res.status(400).json({ success: false, message: 'Please select a career goal to view your roadmap.' });
      return;
    }

    let roadmap = await Roadmap.findOne({ user: req.user._id, career: careerId }).populate('career', 'name slug');

    if (!roadmap) {
      // Auto-generate if not yet created
      const career = await Career.findById(careerId);
      if (!career) {
        res.status(404).json({ success: false, message: 'Career not found.' });
        return;
      }

      const generated = await aiService.generateLearningRoadmap({
        careerName: career.name,
        experienceLevel: req.user.experienceLevel || 'Beginner',
        skillGaps: [],
        knownSkills: req.user.knownSkills || [],
      });

      roadmap = await Roadmap.create({
        user: req.user._id,
        career: career._id,
        phases: generated.phases,
        progress: 0,
        generatedByAI: generated.generatedByAI,
        aiNotes: generated.notes,
      });

      roadmap = await Roadmap.findById(roadmap._id).populate('career', 'name slug');
    }

    res.json({ success: true, roadmap });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch roadmap.' });
  }
};

export const generateOrRegenerateRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const careerId = req.body.careerId || req.user.careerGoal;
    if (!careerId) {
      res.status(400).json({ success: false, message: 'Career goal required to generate roadmap.' });
      return;
    }

    const career = await Career.findById(careerId).populate('requiredSkills.skill');
    if (!career) {
      res.status(404).json({ success: false, message: 'Career not found.' });
      return;
    }

    // Fetch current progress to build context
    const progressRecords = await Progress.find({ user: req.user._id });
    const progressMap = new Map<string, number>();
    progressRecords.forEach((p) => progressMap.set(p.skill.toString(), p.percentage));

    const skillGaps = career.requiredSkills.map((item: any) => {
      const sId = item.skill?._id?.toString();
      const currentLevel = (sId && progressMap.get(sId)) || 0;
      return {
        skillName: item.skill?.name || 'Skill',
        currentLevel,
        requiredLevel: item.requiredLevel,
        gap: Math.max(0, item.requiredLevel - currentLevel),
      };
    });

    const aiPlan = await aiService.generateLearningRoadmap({
      careerName: career.name,
      experienceLevel: req.user.experienceLevel || 'Beginner',
      skillGaps,
      knownSkills: req.user.knownSkills || [],
    });

    // Save or update existing roadmap
    let roadmap = await Roadmap.findOne({ user: req.user._id, career: career._id });

    if (roadmap) {
      roadmap.phases = aiPlan.phases;
      roadmap.generatedByAI = aiPlan.generatedByAI;
      roadmap.aiNotes = aiPlan.notes;
      roadmap.progress = 0;
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        user: req.user._id,
        career: career._id,
        phases: aiPlan.phases,
        progress: 0,
        generatedByAI: aiPlan.generatedByAI,
        aiNotes: aiPlan.notes,
      });
    }

    roadmap = await Roadmap.findById(roadmap._id).populate('career', 'name slug');

    res.json({
      success: true,
      message: 'Personalized AI learning roadmap generated successfully.',
      roadmap,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to generate roadmap.' });
  }
};

export const updateTopicStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { topicId } = req.params;
    const { completed } = req.body; // boolean

    const roadmap = await Roadmap.findOne({ user: req.user._id });
    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found.' });
      return;
    }

    let topicFound = false;
    let totalTopics = 0;
    let completedTopics = 0;

    roadmap.phases.forEach((phase) => {
      phase.topics.forEach((topic) => {
        totalTopics++;
        if (topic.id === topicId) {
          topic.completed = completed !== undefined ? completed : !topic.completed;
          topic.completedAt = topic.completed ? new Date() : undefined;
          topicFound = true;
        }
        if (topic.completed) {
          completedTopics++;
        }
      });
    });

    if (!topicFound) {
      res.status(404).json({ success: false, message: 'Topic ID not found in current roadmap.' });
      return;
    }

    roadmap.progress = Math.round((completedTopics / (totalTopics || 1)) * 100);
    await roadmap.save();

    res.json({
      success: true,
      message: 'Topic status updated successfully.',
      roadmap,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update topic status.' });
  }
};
