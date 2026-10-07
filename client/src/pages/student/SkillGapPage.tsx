import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SkillGapAnalysis } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Target,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Map,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const res = await api.getSkillGapAnalysis();
        if (res && res.gaps) {
          setAnalysis(res);
        }
      } catch (err) {
        console.error('Failed to load skill gap analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <LoadingSpinner message="Benchmarking competencies against career standards..." />
        </main>
      </div>
    );
  }

  const gaps = analysis?.gaps || [];
  const summary = analysis?.summary;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Career Benchmark Discrepancy Engine
              </span>
              <Badge variant="brand">{analysis?.career?.name || 'Full Stack'}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill Gap Analysis
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/roadmap">
              <Button variant="primary" size="sm" icon={<Map className="w-4 h-4 ml-1" />}>
                Generate AI Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Executive Summary Banner */}
        {summary && (
          <Card className="p-6 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white border-0 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> AI Competency Diagnostic Executive Summary
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {summary.aiExecutiveSummary ||
                `Identified ${summary.criticalGapsCount} critical skill gaps. Your average competency currently matches ${summary.averageCompetency}% of industry standards.`}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Total Skills</span>
                <span className="text-xl font-bold text-white">{summary.totalSkills}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mastered (Target Met)</span>
                <span className="text-xl font-bold text-emerald-400">{summary.masteredCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Average Competency</span>
                <span className="text-xl font-bold text-brand-300">{summary.averageCompetency}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Readiness Index</span>
                <span className="text-xl font-bold text-amber-300">{summary.readinessEstimate}%</span>
              </div>
            </div>
          </Card>
        )}

        {/* Skill Gap Cards List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-slate-900">Skill-by-Skill Breakdown</h3>
            <span className="text-xs text-slate-500 font-medium">
              Sorted by Priority Severity
            </span>
          </div>

          <div className="space-y-4">
            {gaps.map((item, idx) => {
              const priorityVariant =
                item.priority === 'Critical'
                  ? 'critical'
                  : item.priority === 'High'
                  ? 'danger'
                  : item.priority === 'Medium'
                  ? 'warning'
                  : 'slate';

              return (
                <Card key={idx} className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{item.skillName}</h4>
                        <span className="text-xs text-slate-500">{item.category} • {item.importance}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={priorityVariant} size="sm">
                        {item.priority} Priority Gap
                      </Badge>
                      <Badge variant={item.currentLevel >= item.requiredLevel ? 'success' : 'slate'} size="sm">
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Visual Progress Gap */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-8 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Current Level: {item.currentLevel}%</span>
                        <span className="text-brand-600 font-bold">Target Benchmark: {item.requiredLevel}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                        {/* Target line indicator */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                          style={{ left: `${item.requiredLevel}%` }}
                          title={`Required: ${item.requiredLevel}%`}
                        />
                        {/* Current bar */}
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.currentLevel >= item.requiredLevel
                              ? 'bg-emerald-500'
                              : item.priority === 'Critical'
                              ? 'bg-rose-500'
                              : 'bg-brand-600'
                          }`}
                          style={{ width: `${Math.min(100, item.currentLevel)}%` }}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex justify-between sm:justify-end items-center sm:text-right gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Gap Margin</span>
                        <span className={`text-xl font-black ${item.gap > 30 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {item.gap > 0 ? `-${item.gap}%` : 'Target Met'}
                        </span>
                      </div>
                      <Link to="/resources">
                        <Button variant="outline" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                          Learn
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
