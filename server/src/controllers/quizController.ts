import { Request, Response } from 'express';
import { Quiz, IQuiz } from '../models/Quiz';
import { QuizAttempt } from '../models/Quiz';
import { Progress } from '../models/Progress';
import { AuthRequest } from '../middleware/auth';

export const getQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skillId, difficulty } = req.query;
    const filter: any = {};

    if (skillId) filter.skill = skillId;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .populate('skill', 'name category difficulty')
      .select('title skill difficulty questions.length');

    // Attach question count
    const formatted = quizzes.map((q: any) => ({
      _id: q._id,
      title: q.title,
      skill: q.skill,
      difficulty: q.difficulty,
      questionCount: q.questions ? q.questions.length : 0,
    }));

    res.json({ success: true, quizzes: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch quizzes.' });
  }
};

export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate('skill', 'name category');

    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }

    // Strip out correctAnswer before student submits
    const sanitizedQuestions = quiz.questions.map((q, idx) => ({
      questionIndex: idx,
      question: q.question,
      options: q.options,
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        skill: quiz.skill,
        difficulty: quiz.difficulty,
        questions: sanitizedQuestions,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch quiz details.' });
  }
};

export const submitQuizAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const { answers } = req.body; // array of numbers or object { [index]: selectedIdx }

    const quiz = await Quiz.findById(id).populate('skill');
    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }

    let correctCount = 0;
    const userAnswersList: number[] = [];
    const questionReview: any[] = [];

    quiz.questions.forEach((q, idx) => {
      const selected = Array.isArray(answers) ? answers[idx] : answers[idx.toString()];
      const parsedSelection = typeof selected === 'number' ? selected : parseInt(selected, 10);
      userAnswersList.push(parsedSelection);

      const isCorrect = parsedSelection === q.correctAnswer;
      if (isCorrect) correctCount++;

      questionReview.push({
        questionIndex: idx,
        question: q.question,
        options: q.options,
        userAnswer: parsedSelection,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      });
    });

    const totalQuestions = quiz.questions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Save attempt
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      userAnswers: userAnswersList,
    });

    // Update student progress on this skill
    if (quiz.skill) {
      const skillId = (quiz.skill as any)._id;
      const existingProg = await Progress.findOne({ user: req.user._id, skill: skillId });
      const currentPct = existingProg ? existingProg.percentage : 0;
      const newPct = Math.max(currentPct, score);

      await Progress.findOneAndUpdate(
        { user: req.user._id, skill: skillId },
        {
          percentage: newPct,
          status: newPct >= 80 ? 'completed' : 'in_progress',
          ...(newPct >= 80 && { completedAt: new Date() }),
        },
        { upsert: true, new: true }
      );
    }

    // Fetch user attempt stats
    const allAttempts = await QuizAttempt.find({ user: req.user._id, quiz: quiz._id }).sort({ completedAt: -1 });
    const scores = allAttempts.map((a) => a.score);
    const bestScore = Math.max(...scores);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    res.json({
      success: true,
      result: {
        attemptId: attempt._id,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        questionReview,
        stats: {
          totalAttempts: allAttempts.length,
          bestScore,
          averageScore,
          latestScore: score,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit quiz attempt.' });
  }
};

export const getUserQuizHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate({
        path: 'quiz',
        populate: { path: 'skill', select: 'name' },
      })
      .sort({ completedAt: -1 });

    res.json({ success: true, attempts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch quiz history.' });
  }
};
