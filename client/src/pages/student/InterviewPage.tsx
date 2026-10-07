import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { InterviewQuestion, InterviewFeedback } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Mic,
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  History,
  ShieldAlert,
} from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const [trackType, setTrackType] = useState<'Technical' | 'HR' | 'Behavioral' | 'Mock Interview'>('Technical');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchQuestions = async () => {
    setLoading(true);
    setFeedback(null);
    setStudentAnswer('');
    try {
      const res = await api.generateInterviewQuestions(trackType);
      if (res.questions) {
        setQuestions(res.questions);
        setCurrentIdx(0);
      }
    } catch (err) {
      console.error('Failed to generate interview questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.getInterviewHistory();
      if (res.sessions) {
        setSessions(res.sessions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchHistory();
  }, [trackType]);

  const handleEvaluate = async () => {
    if (!studentAnswer.trim() || !questions[currentIdx]) return;
    setEvaluating(true);
    try {
      const res = await api.evaluateInterviewAnswer({
        question: questions[currentIdx].question,
        answer: studentAnswer.trim(),
        trackType,
      });
      if (res.feedback) {
        setFeedback(res.feedback);
        setDisclaimer(res.disclaimer);
        await fetchHistory();
      }
    } catch (err: any) {
      alert(`Evaluation error: ${err.message}`);
    } finally {
      setEvaluating(false);
    }
  };

  const currentQuestion = questions[currentIdx];

  const tracks: Array<'Technical' | 'HR' | 'Behavioral' | 'Mock Interview'> = [
    'Technical',
    'HR',
    'Behavioral',
    'Mock Interview',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                AI Career Simulation Engine
              </span>
              <Badge variant="brand">Interactive Rounds</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interview Preparation
            </h1>
          </div>

          {/* Track Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {tracks.map((t) => (
              <button
                key={t}
                onClick={() => setTrackType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  trackType === t
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Question & Practice Card */}
        {loading ? (
          <LoadingSpinner message={`Generating ${trackType} interview scenario...`} />
        ) : currentQuestion ? (
          <Card className="p-8 sm:p-10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentIdx + 1} of {questions.length} ({trackType})
              </span>
              <Badge variant={currentQuestion.difficulty === 'Advanced' ? 'brand' : 'slate'} size="sm">
                {currentQuestion.difficulty}
              </Badge>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>

              {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Preparation Hints:
                  </span>
                  <ul className="list-disc list-inside text-xs text-amber-700 space-y-0.5">
                    {currentQuestion.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Response (Formulate a clear, structured answer):
              </label>
              <textarea
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your response here. For behavioral questions, consider the STAR framework (Situation, Task, Action, Result)..."
                className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                {currentIdx > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentIdx(currentIdx - 1);
                      setFeedback(null);
                      setStudentAnswer('');
                    }}
                  >
                    Previous
                  </Button>
                )}
                {currentIdx < questions.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentIdx(currentIdx + 1);
                      setFeedback(null);
                      setStudentAnswer('');
                    }}
                  >
                    Next Question
                  </Button>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                loading={evaluating}
                disabled={!studentAnswer.trim()}
                onClick={handleEvaluate}
                icon={<Sparkles className="w-4 h-4 ml-1 text-amber-300" />}
              >
                Evaluate with AI
              </Button>
            </div>
          </Card>
        ) : null}

        {/* AI Constructive Feedback Card */}
        {feedback && (
          <Card className="p-8 sm:p-10 space-y-6 bg-white border-brand-200 ring-2 ring-brand-500/10">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-bold text-slate-900">AI Evaluation & Constructive Feedback</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-sm">
                Score: {feedback.overallScore}/100
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Executive Summary:</strong>
              {feedback.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strengths Noted
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses / Improvements */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-2">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Areas for Improvement
                </h4>
                <ul className="space-y-1.5 text-xs text-rose-900">
                  {feedback.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="p-4 rounded-2xl bg-ai-50/40 border border-ai-100 space-y-2">
                <h4 className="text-xs font-bold text-ai-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-ai-600" /> Actionable Preparation Suggestions
                </h4>
                <ul className="space-y-1.5 text-xs text-ai-800">
                  {feedback.suggestions.map((sug, i) => (
                    <li key={i}>• {sug}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal Educational Disclaimer */}
            <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {disclaimer ||
                  'Note: AI evaluation feedback provides constructive educational guidance and is not an official hiring or employment assessment.'}
              </span>
            </div>
          </Card>
        )}

        {/* Past Sessions History */}
        {sessions.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-base text-slate-900">Recent Mock Interview Drills</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.slice(0, 4).map((s: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {s.trackType} Round • {s.career?.name || 'Career Track'}
                    </span>
                    <span className="text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString()} • {s.questions?.[0]?.substring(0, 60)}...
                    </span>
                  </div>
                  <Badge variant="brand" size="sm">
                    {s.feedback?.overallScore || 75}%
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
