import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { AssessmentResult } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Target,
  Map,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const AssessmentResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try session storage first (immediate submission)
    const cached = sessionStorage.getItem('skillpath_latest_result');
    if (cached) {
      try {
        setResult(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Otherwise fetch historical results
    const fetchLatest = async () => {
      try {
        const res = await api.getAssessmentResults();
        if (res.results && res.results.length > 0) {
          setResult(res.results[0]);
        }
      } catch (err) {
        console.error('Failed to load assessment results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <LoadingSpinner message="Calculating assessment metrics..." />
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900">No Assessment Results Found</h3>
            <p className="text-sm text-slate-500">
              You haven't completed any career diagnostic assessments yet.
            </p>
            <Button variant="primary" onClick={() => navigate('/assessment')}>
              Take Diagnostic Exam
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Diagnostic Results Summary
              </span>
              <Badge variant="success">Completed</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Performance Review
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/skill-gap">
              <Button variant="primary" size="sm" icon={<Target className="w-4 h-4 ml-1" />}>
                Analyze Skill Gaps
              </Button>
            </Link>
            <Link to="/roadmap">
              <Button variant="outline" size="sm" icon={<Map className="w-4 h-4 ml-1" />}>
                View AI Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* Score Banner Card */}
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Verified Competency Index
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Overall Score: {result.overallScore}%
            </h2>
            <p className="text-sm text-slate-300 max-w-lg">
              You answered <span className="font-bold text-white">{result.correctCount}</span> of{' '}
              <span className="font-bold text-white">{result.totalQuestions}</span> questions correctly.
              Your skill metrics have been recorded in MongoDB.
            </p>
          </div>

          <div className="shrink-0 text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-brand-400 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center">
              <span className="text-3xl font-black">{result.overallScore}%</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Accuracy
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown by Skill */}
        <Card className="p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Per-Skill Competency Scores</h3>
              <p className="text-xs text-slate-500">Subject-by-subject score performance</p>
            </div>
            <span className="text-xs font-bold text-brand-600">
              {result.skillScores?.length || 0} Evaluated Areas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.skillScores?.map((sc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-800">{sc.skillName}</span>
                  <span className="text-xs font-bold text-brand-600">{sc.score}%</span>
                </div>
                <ProgressBar
                  value={sc.score}
                  showPercent={false}
                  color={sc.score >= 70 ? 'success' : sc.score >= 40 ? 'brand' : 'danger'}
                />
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    {sc.correctAnswers} / {sc.totalQuestions} correct
                  </span>
                  <Badge variant={sc.score >= 70 ? 'success' : 'warning'} size="sm">
                    {sc.score >= 70 ? 'Mastered' : 'Needs Practice'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths & Weaknesses Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="p-6 space-y-4 bg-emerald-50/30 border-emerald-200/60">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base">Identified Strengths (≥70%)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.strengths && result.strengths.length > 0 ? (
                result.strengths.map((s, idx) => (
                  <Badge key={idx} variant="success" size="md">
                    {s}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  Focus on closing foundational skill gaps to cultivate core strengths.
                </p>
              )}
            </div>
          </Card>

          {/* Weaknesses */}
          <Card className="p-6 space-y-4 bg-rose-50/30 border-rose-200/60">
            <div className="flex items-center gap-2 text-rose-800">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base">Priority Focus Areas (&lt;70%)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.weaknesses && result.weaknesses.length > 0 ? (
                result.weaknesses.map((w, idx) => (
                  <Badge key={idx} variant="danger" size="md">
                    {w}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-slate-500">No major critical weaknesses detected.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Detailed Question Review (if available) */}
        {result.questionReview && result.questionReview.length > 0 && (
          <Card className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Question-by-Question Solution Review
            </h3>

            <div className="space-y-6">
              {result.questionReview.map((rev, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    rev.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <Badge variant={rev.isCorrect ? 'success' : 'danger'}>
                      {rev.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>

                  <p className="text-sm font-bold text-slate-900 mb-3">{rev.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold">Your Answer:</span>
                      <span
                        className={`font-bold ${
                          rev.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {rev.userAnswer || 'No answer selected'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold">Correct Answer:</span>
                      <span className="font-bold text-emerald-700">{rev.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 font-semibold block mb-0.5">Rationale:</strong>
                    {rev.explanation}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};
