import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CareerReadiness } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const CareerReadinessPage: React.FC = () => {
  const [readiness, setReadiness] = useState<CareerReadiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const res = await api.getCareerReadiness();
        if (res && res.breakdown) {
          setReadiness(res);
        }
      } catch (err) {
        console.error('Failed to load career readiness:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadiness();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <LoadingSpinner message="Calculating deterministic readiness formula..." />
        </main>
      </div>
    );
  }

  const score = readiness?.overallReadiness || 0;
  const breakdown = readiness?.breakdown || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Graduation & Hiring Alignment Index
              </span>
              <Badge variant="brand">{readiness?.career?.name || 'Full Stack'}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Career Readiness Index
            </h1>
          </div>
        </div>

        {/* Hero Score Card */}
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-300 backdrop-blur-sm">
              <Award className="w-4 h-4" />
              {readiness?.stage || 'Candidate Stage'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Total Score: {score}%
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {readiness?.summaryNote}
            </p>
          </div>

          <div className="shrink-0 text-center">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-400 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{score}%</span>
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold">
                Readiness
              </span>
            </div>
          </div>
        </div>

        {/* Documented Formula Explanation Box */}
        <Card className="p-6 bg-slate-50 border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-brand-600" />
            <span>Deterministic Scoring Formula Specification</span>
          </div>
          <p className="text-xs text-slate-600 font-mono bg-white p-3 rounded-xl border border-slate-200">
            {readiness?.formulaExplanation ||
              'Readiness = (Assessment × 25%) + (Skills × 25%) + (Roadmap × 20%) + (Quizzes × 10%) + (Projects × 10%) + (Interviews × 10%)'}
          </p>
          <p className="text-xs text-slate-500">
            Unlike random percentages, this deterministic model grounds your score in tangible deliverables: exams passed, skills mastered, curriculum progress, quiz averages, verified GitHub projects, and mock interview rounds.
          </p>
        </Card>

        {/* Granular Breakdown Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Weighted Component Breakdown</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {breakdown.map((item, idx) => (
              <Card key={idx} className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{item.category}</h4>
                    <span className="text-xs text-slate-500 font-medium">{item.description}</span>
                  </div>
                  <Badge variant={item.score >= 70 ? 'success' : item.score > 0 ? 'brand' : 'slate'} size="sm">
                    {item.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Metric Score: {item.score}%</span>
                    <span className="text-brand-600 font-bold">
                      Weight: {item.weight}% (Yields +{item.weightedValue}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={item.score}
                    showPercent={false}
                    color={item.score >= 70 ? 'success' : 'brand'}
                    size="sm"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
