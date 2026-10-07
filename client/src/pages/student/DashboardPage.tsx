import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Sparkles,
  Award,
  TrendingUp,
  Map,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  Flame,
  BrainCircuit,
  ClipboardCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState<any>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [assessmentResults, setAssessmentResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [readinessRes, skillGapRes, roadmapRes, assessmentsRes] = await Promise.all([
          api.getCareerReadiness().catch(() => null),
          api.getSkillGapAnalysis().catch(() => null),
          api.getRoadmap().catch(() => null),
          api.getAssessmentResults().catch(() => ({ results: [] })),
        ]);

        if (readinessRes) setReadiness(readinessRes);
        if (skillGapRes) setSkillGap(skillGapRes);
        if (roadmapRes?.roadmap) setRoadmap(roadmapRes.roadmap);
        if (assessmentsRes?.results) setAssessmentResults(assessmentsRes.results);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute actual metrics from database
  const competencyScore = skillGap?.summary?.averageCompetency || 0;
  const careerReadinessScore = readiness?.overallReadiness || 0;
  const roadmapProgress = roadmap?.progress || 0;
  const masteredSkillsCount = skillGap?.summary?.masteredCount || 0;
  const totalSkillsCount = skillGap?.summary?.totalSkills || 0;
  const hasTakenAssessment = assessmentResults.length > 0;
  const latestAssessment = hasTakenAssessment ? assessmentResults[0] : null;

  // Derive Recommended Next Step from actual skill gaps
  const criticalGaps = skillGap?.gaps?.filter((g: any) => g.gap > 0) || [];
  const topRecommendation = criticalGaps.length > 0 ? criticalGaps[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Target Goal:{' '}
              <span className="font-semibold text-brand-600">
                {typeof user?.careerGoal === 'object' && user?.careerGoal !== null
                  ? (user.careerGoal as any).name
                  : 'Full Stack Developer'}
              </span>{' '}
              • University Year:{' '}
              <span className="font-semibold text-slate-700">{user?.year || '3rd Year'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!hasTakenAssessment && (
              <Link to="/assessment">
                <Button variant="primary" size="sm" icon={<ClipboardCheck className="w-4 h-4" />}>
                  Take Diagnostic Exam
                </Button>
              </Link>
            )}
            <Link to="/roadmap">
              <Button variant="outline" size="sm" icon={<Map className="w-4 h-4" />}>
                View AI Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Calculating real-time competency analytics..." />
        ) : (
          <>
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card className="p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Competency</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-brand-600">{competencyScore}%</span>
                </div>
                <span className="text-[10px] text-slate-400">Average skill benchmark</span>
              </Card>

              <Card className="p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Readiness</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-emerald-600">{careerReadinessScore}%</span>
                </div>
                <span className="text-[10px] text-slate-400">Placement index</span>
              </Card>

              <Card className="p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Roadmap</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-ai-600">{roadmapProgress}%</span>
                </div>
                <span className="text-[10px] text-slate-400">Curriculum done</span>
              </Card>

              <Card className="p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Skills Mastered</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-brand-600">
                    {masteredSkillsCount}/{totalSkillsCount || 10}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Industry verified</span>
              </Card>

              <Card className="p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Projects</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-cyan-600">
                    {readiness?.breakdown?.find((b: any) => b.category === 'Applied Project Submissions')?.score || 0}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Verified portfolio</span>
              </Card>

              <Card className="p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Quiz Average</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-amber-600">
                    {readiness?.breakdown?.find((b: any) => b.category === 'Knowledge Quizzes')?.score || 0}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Test retention</span>
              </Card>

              <Card className="p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Streak
                </span>
                <div className="my-2">
                  <span className="text-2xl font-black text-orange-500">5 Days</span>
                </div>
                <span className="text-[10px] text-slate-400">Active learning</span>
              </Card>
            </div>

            {/* Recommended Next Step Section */}
            {topRecommendation ? (
              <Card className="p-6 bg-gradient-to-r from-brand-900 to-slate-950 text-white border-0 shadow-lg relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        Recommended Next Step
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        Target Gap: {topRecommendation.gap}%
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                       Master {topRecommendation.skillName} Core Concepts
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Your current benchmark is at {topRecommendation.currentLevel}%, while {typeof user?.careerGoal === 'object' ? (user.careerGoal as any).name : 'Full Stack'} positions require at least {topRecommendation.requiredLevel}%. Closing this {topRecommendation.priority.toLowerCase()} priority gap will increase your Career Readiness by ~8%.
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link to="/resources">
                      <Button size="md" className="bg-white text-slate-900 hover:bg-slate-100 font-bold" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-gradient-to-r from-brand-900 to-slate-950 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Begin With Diagnostic Assessment</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Take your first diagnostic exam to reveal your personalized skill gap and AI recommendation.
                    </p>
                  </div>
                  <Link to="/assessment">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100">
                      Start Assessment
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Dashboard Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Technical Skills Competency Breakdown */}
              <Card className="p-6 space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Technical Skills Competency</h3>
                    <p className="text-xs text-slate-500">Current proficiency vs industry benchmark</p>
                  </div>
                  <Link to="/skill-gap" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Full Analysis →
                  </Link>
                </div>

                {skillGap?.gaps && skillGap.gaps.length > 0 ? (
                  <div className="space-y-4">
                    {skillGap.gaps.slice(0, 5).map((g: any, idx: number) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">{g.skillName}</span>
                          <span className="font-medium text-slate-500">
                            {g.currentLevel}% / {g.requiredLevel}%
                          </span>
                        </div>
                        <ProgressBar
                          value={g.currentLevel}
                          max={g.requiredLevel || 100}
                          showPercent={false}
                          color={g.currentLevel >= g.requiredLevel ? 'success' : g.gap > 30 ? 'warning' : 'brand'}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No skill evaluations yet"
                    description="Take the diagnostic assessment to evaluate your technical competencies."
                    actionLabel="Take Assessment"
                    onAction={() => window.location.assign('/assessment')}
                  />
                )}
              </Card>

              {/* Assessment Performance & History */}
              <Card className="p-6 space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Diagnostic Exam Performance</h3>
                    <p className="text-xs text-slate-500">Evaluation results and strengths breakdown</p>
                  </div>
                  <Link to="/assessment" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Exam Hub →
                  </Link>
                </div>

                {latestAssessment ? (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Latest Overall Score</span>
                        <span className="text-3xl font-black text-brand-600">
                          {latestAssessment.overallScore}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Questions Solved</span>
                        <span className="text-sm font-bold text-slate-800">
                          {latestAssessment.correctCount} of {latestAssessment.totalQuestions}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-xs font-bold text-emerald-800 block mb-2">Verified Strengths</span>
                        <div className="flex flex-wrap gap-1">
                          {latestAssessment.strengths?.length > 0 ? (
                            latestAssessment.strengths.map((s: string) => (
                              <Badge key={s} variant="success" size="sm">
                                {s}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">None identified yet</span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                        <span className="text-xs font-bold text-rose-800 block mb-2">Focus Areas</span>
                        <div className="flex flex-wrap gap-1">
                          {latestAssessment.weaknesses?.length > 0 ? (
                            latestAssessment.weaknesses.map((w: string) => (
                              <Badge key={w} variant="danger" size="sm">
                                {w}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">None flagged</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No assessments taken yet"
                    description="Take a quick 10-question test to establish your benchmark."
                    actionLabel="Start Exam"
                    onAction={() => window.location.assign('/assessment')}
                  />
                )}
              </Card>

              {/* Career Readiness Breakdown Chart */}
              <Card className="p-6 lg:col-span-2 space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Career Readiness Deterministic Breakdown</h3>
                    <p className="text-xs text-slate-500">6-pillar weighted index mapping graduation readiness</p>
                  </div>
                  <Link to="/career-readiness" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Formula Specs →
                  </Link>
                </div>

                {readiness?.breakdown ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {readiness.breakdown.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-800">{item.category}</span>
                          <span className="text-xs font-bold text-brand-600">{item.score}%</span>
                        </div>
                        <ProgressBar value={item.score} showPercent={false} color="brand" size="sm" />
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                          <span>Weight: {item.weight}%</span>
                          <span>Contribution: +{item.weightedValue}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Readiness index initializing"
                    description="Complete your first quiz or assessment to generate weighted metrics."
                  />
                )}
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
