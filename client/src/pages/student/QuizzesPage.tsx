import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Quiz, QuizAttemptResult } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  History,
} from 'lucide-react';

export const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<QuizAttemptResult | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Attempt history
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, histRes] = await Promise.all([
          api.getQuizzes(),
          api.getQuizHistory().catch(() => ({ attempts: [] })),
        ]);
        if (quizRes.quizzes) setQuizzes(quizRes.quizzes);
        if (histRes.attempts) setHistory(histRes.attempts);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartQuiz = async (quizId: string) => {
    setQuizLoading(true);
    setQuizResult(null);
    setUserAnswers({});
    try {
      const res = await api.getQuizById(quizId);
      if (res.quiz) {
        setActiveQuiz(res.quiz);
      }
    } catch (err) {
      console.error('Failed to load full quiz:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(activeQuiz._id, userAnswers);
      if (res.result) {
        setQuizResult(res.result);
        // Refresh history in background
        const histRes = await api.getQuizHistory().catch(() => null);
        if (histRes?.attempts) setHistory(histRes.attempts);
      }
    } catch (err) {
      console.error('Failed to submit quiz attempt:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Knowledge Retention Exams
              </span>
              <Badge variant="brand">Interactive Drill</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Topic Mastery Quizzes
            </h1>
          </div>
        </div>

        {/* Active Quiz Card */}
        {activeQuiz ? (
          <Card className="p-8 sm:p-10 space-y-8 border-brand-200 ring-2 ring-brand-500/10">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">
                  Active Quiz
                </span>
                <h2 className="text-xl font-bold text-slate-900">{activeQuiz.title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveQuiz(null)}>
                Exit Quiz
              </Button>
            </div>

            {/* If Quiz Result is ready, show review */}
            {quizResult ? (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-brand-900 to-slate-950 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Attempt Scored
                    </span>
                    <h3 className="text-2xl font-black">Score: {quizResult.score}%</h3>
                    <p className="text-xs text-slate-300">
                      You answered {quizResult.correctAnswers} of {quizResult.totalQuestions} questions correctly.
                    </p>
                  </div>

                  <div className="flex gap-4 text-center text-xs">
                    <div className="p-2.5 bg-white/10 rounded-xl">
                      <span className="text-slate-400 block">Peak Score</span>
                      <span className="font-bold text-emerald-300 text-sm">{quizResult.stats.bestScore}%</span>
                    </div>
                    <div className="p-2.5 bg-white/10 rounded-xl">
                      <span className="text-slate-400 block">Average</span>
                      <span className="font-bold text-brand-300 text-sm">{quizResult.stats.averageScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Question Review */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Explanation Review</h4>
                  {quizResult.questionReview.map((rev, qIdx) => (
                    <div
                      key={qIdx}
                      className={`p-5 rounded-2xl border ${
                        rev.isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400">Question {qIdx + 1}</span>
                        <Badge variant={rev.isCorrect ? 'success' : 'danger'} size="sm">
                          {rev.isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-3">{rev.question}</p>
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                        <strong className="text-slate-900">Explanation: </strong>
                        {rev.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={() => handleStartQuiz(activeQuiz._id)} icon={<RotateCcw className="w-4 h-4" />}>
                    Retake Quiz
                  </Button>
                  <Button variant="primary" onClick={() => setActiveQuiz(null)}>
                    Return to Quiz List
                  </Button>
                </div>
              </div>
            ) : (
              /* Quiz Taking Questions */
              <div className="space-y-8">
                {activeQuiz.questions?.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Question {qIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{q.question}</h3>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const selected = userAnswers[qIdx] === oIdx;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`p-3.5 rounded-xl border cursor-pointer text-xs font-medium flex items-center justify-between transition-all ${
                              selected
                                ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold ring-1 ring-brand-500'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {selected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    loading={submitting}
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                  >
                    Submit Quiz Answers
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ) : null}

        {/* Available Quizzes Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-slate-900">Available Quizzes</h3>
            <span className="text-xs text-slate-500">{quizzes.length} Topic Quizzes</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading quiz catalog..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz._id} hover className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="brand">{quiz.skill?.name || 'Topic'}</Badge>
                      <Badge variant={quiz.difficulty === 'Advanced' ? 'brand' : 'slate'} size="sm">
                        {quiz.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      {quiz.questionCount || 3} multiple-choice questions testing core concepts and edge cases.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => handleStartQuiz(quiz._id)}
                      icon={<Play className="w-3.5 h-3.5" />}
                    >
                      Start Quiz
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Attempt History Section */}
        {history.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-base text-slate-900">Your Recent Quiz Attempts</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {history.slice(0, 5).map((att: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {att.quiz?.title || 'Topic Quiz'}
                    </span>
                    <span className="text-slate-400">
                      {new Date(att.completedAt).toLocaleDateString()} • {att.correctAnswers} of{' '}
                      {att.totalQuestions} correct
                    </span>
                  </div>
                  <Badge variant={att.score >= 70 ? 'success' : 'warning'} size="sm">
                    {att.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};
