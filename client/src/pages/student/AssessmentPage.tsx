import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Assessment, Question } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ClipboardCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const careerId = user?.careerGoal
          ? typeof user.careerGoal === 'string'
            ? user.careerGoal
            : (user.careerGoal as any)._id
          : 'full-stack-developer';

        const res = await api.getAssessmentForCareer(careerId);
        if (res.assessment) {
          setAssessment(res.assessment);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [user]);

  const questions: Question[] = assessment?.questions || [];
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    setAnswers({
      ...answers,
      [currentQuestion._id]: option,
    });
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  const handleSubmit = async () => {
    if (!assessment) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(assessment._id, answers);
      if (res.result) {
        sessionStorage.setItem('skillpath_latest_result', JSON.stringify(res.result));
        navigate('/assessment/results');
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <LoadingSpinner message="Preparing career diagnostic assessment..." />
        </main>
      </div>
    );
  }

  if (error || !assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Assessment Unavailable</h3>
            <p className="text-sm text-slate-500">
              {error || 'No active question bank for this career path yet. Please select a career goal.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/careers')}>
              Explore Careers
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Career Diagnostic Exam
              </span>
              <Badge variant="brand">{assessment.career?.name || 'Full Stack'}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {assessment.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{assessment.durationMinutes} Minutes</span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {answeredCount}/{totalCount} Answered
            </span>
          </div>
        </div>

        {/* Question Palette Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-bold text-slate-500 mr-2">Jump to:</span>
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q._id];
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={q._id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-500/30'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Current Question Card */}
        {currentQuestion && (
          <Card className="p-8 sm:p-10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentIdx + 1} of {totalCount}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="slate" size="sm">
                  {typeof currentQuestion.skill === 'object' && currentQuestion.skill !== null
                    ? (currentQuestion.skill as any).name
                    : 'Core Skill'}
                </Badge>
                <Badge
                  variant={currentQuestion.difficulty === 'Advanced' ? 'brand' : 'success'}
                  size="sm"
                >
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const selected = answers[currentQuestion._id] === option;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(option)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selected
                        ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                          selected
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{option}</span>
                    </div>
                    {selected && <CheckCircle className="w-5 h-5 text-brand-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Nav Controls */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                icon={<ArrowLeft className="w-4 h-4 mr-1" />}
              >
                Previous
              </Button>

              {currentIdx < totalCount - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  icon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setConfirmModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                  icon={<ClipboardCheck className="w-4 h-4 ml-1" />}
                >
                  Review & Submit Exam
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Submit Confirmation Modal */}
        <Modal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title="Submit Assessment Confirmation"
        >
          <div className="space-y-5">
            <p className="text-sm text-slate-600 leading-relaxed">
              You have answered <strong className="text-slate-900">{answeredCount}</strong> out of{' '}
              <strong className="text-slate-900">{totalCount}</strong> questions.
              {answeredCount < totalCount && (
                <span className="block mt-2 text-rose-600 font-semibold text-xs">
                  ⚠️ Note: {totalCount - answeredCount} unanswered question(s) will be marked incorrect.
                </span>
              )}
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
                Return to Exam
              </Button>
              <Button
                variant="primary"
                loading={submitting}
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Confirm & Calculate Score
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};
