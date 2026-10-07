import { Response } from 'express';
import { InterviewSession } from '../models/InterviewSession';
import { Career } from '../models/Career';
import { AuthRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';

export const generateInterviewQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { careerId, trackType } = req.body;
    const targetCareerId = careerId || req.user?.careerGoal;

    if (!targetCareerId) {
      res.status(400).json({ success: false, message: 'Career path must be selected to generate interview questions.' });
      return;
    }

    const career = await Career.findById(targetCareerId);
    if (!career) {
      res.status(404).json({ success: false, message: 'Career not found.' });
      return;
    }

    const track = trackType || 'Technical';
    const questions = await aiService.generateInterviewQuestions(career.name, track);

    res.json({
      success: true,
      career: { id: career._id, name: career.name },
      track,
      questions,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to generate interview questions.' });
  }
};

export const evaluateInterviewAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { careerId, trackType, question, answer } = req.body;

    if (!question || !answer || !answer.trim()) {
      res.status(400).json({ success: false, message: 'Both question and candidate response are required.' });
      return;
    }

    const targetCareerId = careerId || req.user.careerGoal;
    const career = await Career.findById(targetCareerId);
    const careerName = career ? career.name : 'Software Engineering';

    const feedback = await aiService.evaluateInterviewAnswer({
      careerName,
      track: trackType || 'Technical',
      question,
      answer,
    });

    // Save session log
    if (career) {
      await InterviewSession.create({
        user: req.user._id,
        career: career._id,
        trackType: trackType || 'Technical',
        questions: [question],
        answers: [answer],
        feedback,
      });
    }

    res.json({
      success: true,
      feedback,
      disclaimer: 'Note: AI evaluation feedback provides constructive educational guidance and is not an official hiring or employment assessment.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to evaluate interview response.' });
  }
};

export const getInterviewHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const sessions = await InterviewSession.find({ user: req.user._id })
      .populate('career', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, sessions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch interview history.' });
  }
};
