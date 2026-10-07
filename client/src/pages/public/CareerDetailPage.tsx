import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Career } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  CheckCircle,
  FolderGit2,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const CareerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [selectionSuccess, setSelectionSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCareer = async () => {
      if (!id) return;
      try {
        const res = await api.getCareerById(id);
        if (res.career) {
          setCareer(res.career);
        }
      } catch (err) {
        console.error('Failed to load career:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [id]);

  const handleSelectCareer = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!career) return;

    setSelecting(true);
    try {
      await api.selectCareerGoal(career._id);
      await refreshUser();
      setSelectionSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Failed to choose career:', err);
    } finally {
      setSelecting(false);
    }
  };

  const isCurrentGoal =
    user?.careerGoal &&
    (typeof user.careerGoal === 'string'
      ? user.careerGoal === career?._id
      : (user.careerGoal as any)._id === career?._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <LoadingSpinner message="Loading career track details..." />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Career Not Found</h2>
        <Link to="/careers" className="mt-4 inline-block text-brand-600 font-semibold">
          Return to Career Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Career Directory
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <Badge variant={career.difficulty === 'Advanced' ? 'brand' : 'success'}>
                {career.difficulty} Difficulty
              </Badge>
              {isCurrentGoal && (
                <Badge variant="brand">Your Current Target Career</Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {career.name}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">{career.description}</p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Button
              size="lg"
              variant={isCurrentGoal ? 'secondary' : 'primary'}
              loading={selecting}
              disabled={isCurrentGoal || selectionSuccess}
              onClick={handleSelectCareer}
              className="w-full md:w-auto"
              icon={selectionSuccess ? <Check className="w-5 h-5 text-emerald-400" /> : <Sparkles className="w-5 h-5" />}
            >
              {selectionSuccess
                ? 'Selected as Goal!'
                : isCurrentGoal
                ? 'Active Career Target'
                : 'Choose This Career'}
            </Button>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skills & Phases */}
          <div className="lg:col-span-2 space-y-8">
            {/* Required Skills Section */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Required Skills & Benchmark Levels</h3>
                  <p className="text-xs text-slate-500">Minimum industry competence required for entry-level hiring</p>
                </div>
              </div>

              <div className="space-y-5">
                {career.requiredSkills?.map((item: any, idx: number) => {
                  const skill = item.skill;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-sm text-slate-900">{skill?.name || 'Skill'}</span>
                          <span className="ml-2 text-xs text-slate-500">({skill?.category || 'General'})</span>
                        </div>
                        <Badge variant={item.importance === 'Essential' ? 'brand' : 'slate'} size="sm">
                          {item.importance}
                        </Badge>
                      </div>
                      <ProgressBar
                        value={item.requiredLevel}
                        label="Target Benchmark"
                        color={item.requiredLevel >= 85 ? 'brand' : 'success'}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Learning Phases */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-ai-50 text-ai-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Curriculum Progression Phases</h3>
                  <p className="text-xs text-slate-500">Structured academic milestones from foundational basics to capstones</p>
                </div>
              </div>

              <div className="space-y-4">
                {career.learningPhases?.map((phase, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-brand-600 font-bold flex items-center justify-center text-sm shrink-0 shadow-subtle">
                      {phase.phaseNumber}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{phase.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Projects & Interview Topics */}
          <div className="space-y-8">
            {/* Example Projects */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Capstone Projects</h3>
              </div>

              <div className="space-y-4">
                {career.exampleProjects?.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{proj.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Interview Topics */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Core Interview Topics</h3>
              </div>

              <ul className="space-y-2.5">
                {career.interviewTopics?.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
