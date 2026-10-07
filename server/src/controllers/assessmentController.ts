import { Response } from 'express';
import mongoose from 'mongoose';
import { Assessment } from '../models/Assessment';
import { Question } from '../models/Question';
import { AssessmentResult, ISkillScoreItem } from '../models/AssessmentResult';
import { Progress } from '../models/Progress';
import { Career } from '../models/Career';
import { AuthRequest } from '../middleware/auth';

import { fallbackStore } from '../services/fallbackStore';

export const getAssessments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    let assessments: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        assessments = await Assessment.find().populate('career', 'name slug difficulty');
      } catch (e) {
        assessments = [];
      }
    }
    if (!assessments || assessments.length === 0) {
      assessments = fallbackStore.getAssessments();
    }
    res.json({ success: true, assessments });
  } catch (err: any) {
    res.json({ success: true, assessments: fallbackStore.getAssessments() });
  }
};

export const getAssessmentForCareer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { careerId } = req.params;
    let career = null;

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(careerId)) {
          career = await Career.findById(careerId);
        } else {
          career = await Career.findOne({ slug: careerId.toLowerCase() });
        }
      } catch (e) {
        career = null;
      }
    }

    if (!career) {
      career = fallbackStore.getCareerById(careerId) || fallbackStore.getCareers()[0];
    }

    let assessment: any = null;
    let questions: any[] = [];

    if (mongoose.connection.readyState === 1 && career?._id) {
      try {
        assessment = await Assessment.findOne({ career: career._id });
        if (!assessment) {
          const rawQ = await Question.find({ career: career._id }).select('-correctAnswer');
          if (rawQ.length > 0) {
            assessment = await Assessment.create({
              title: `${career.name} Competency Assessment`,
              career: career._id,
              durationMinutes: 25,
              questions: rawQ.map((q) => q._id),
            });
          }
        }
        if (assessment) {
          questions = await Question.find({ _id: { $in: assessment.questions } })
            .select('-correctAnswer')
            .populate('skill', 'name category difficulty');
        }
      } catch (e) {
        assessment = null;
      }
    }

    if (!assessment || questions.length === 0) {
      const fallbackData = fallbackStore.getAssessmentForCareer(careerId);
      res.json({
        success: true,
        assessment: fallbackData,
      });
      return;
    }

    res.json({
      success: true,
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        career,
        durationMinutes: assessment.durationMinutes,
        questions,
      },
    });
  } catch (err: any) {
    res.json({
      success: true,
      assessment: fallbackStore.getAssessmentForCareer(req.params.careerId),
    });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { assessmentId } = req.params;
    const { answers } = req.body; // map or array of { questionId, selectedAnswer }

    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ success: false, message: 'Answers object is required for submission.' });
      return;
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      res.status(404).json({ success: false, message: 'Assessment not found.' });
      return;
    }

    // Fetch full questions INCLUDING correctAnswer for validation on the server!
    const questions = await Question.find({ _id: { $in: assessment.questions } }).populate('skill');

    let correctCount = 0;
    const skillStats: Record<string, { skillId: any; skillName: string; total: number; correct: number }> = {};
    const questionReview: any[] = [];

    questions.forEach((q) => {
      const selected = Array.isArray(answers)
        ? answers.find((a: any) => a.questionId === q._id.toString())?.selectedAnswer
        : answers[q._id.toString()];

      const isCorrect = selected !== undefined && selected.toString().trim() === q.correctAnswer.toString().trim();
      if (isCorrect) correctCount++;

      const skillObj = q.skill as any;
      const sId = skillObj?._id?.toString() || 'general';
      const sName = skillObj?.name || 'General';

      if (!skillStats[sId]) {
        skillStats[sId] = {
          skillId: skillObj?._id,
          skillName: sName,
          total: 0,
          correct: 0,
        };
      }
      skillStats[sId].total++;
      if (isCorrect) skillStats[sId].correct++;

      questionReview.push({
        questionId: q._id,
        question: q.question,
        options: q.options,
        userAnswer: selected || null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
        skillName: sName,
      });
    });

    const totalQuestions = questions.length || 1;
    const overallScore = Math.round((correctCount / totalQuestions) * 100);

    const skillScores: ISkillScoreItem[] = Object.values(skillStats).map((stat) => {
      const score = Math.round((stat.correct / (stat.total || 1)) * 100);
      return {
        skillId: stat.skillId,
        skillName: stat.skillName,
        score,
        totalQuestions: stat.total,
        correctAnswers: stat.correct,
      };
    });

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendedSkills: string[] = [];

    for (const sc of skillScores) {
      if (sc.score >= 70) {
        strengths.push(sc.skillName);
      } else {
        weaknesses.push(sc.skillName);
        recommendedSkills.push(sc.skillName);
      }

      // Update or insert Progress for student
      if (sc.skillId) {
        await Progress.findOneAndUpdate(
          { user: req.user._id, skill: sc.skillId },
          {
            user: req.user._id,
            skill: sc.skillId,
            percentage: sc.score,
            status: sc.score >= 80 ? 'completed' : 'in_progress',
            ...(sc.score >= 80 && { completedAt: new Date() }),
          },
          { upsert: true, new: true }
        );
      }
    }

    const result = await AssessmentResult.create({
      user: req.user._id,
      assessment: assessment._id,
      career: assessment.career,
      overallScore,
      totalQuestions,
      correctCount,
      skillScores,
      strengths,
      weaknesses,
      recommendedSkills,
    });

    res.json({
      success: true,
      message: 'Assessment completed and verified.',
      result: {
        _id: result._id,
        overallScore,
        totalQuestions,
        correctCount,
        skillScores,
        strengths,
        weaknesses,
        recommendedSkills,
        questionReview,
        completedAt: result.completedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit assessment.' });
  }
};

export const getAssessmentResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const results = await AssessmentResult.find({ user: req.user._id })
      .populate('career', 'name slug')
      .populate('assessment', 'title')
      .sort({ completedAt: -1 });

    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch assessment history.' });
  }
};
