import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Skill } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Network,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  BookOpen,
  ArrowDown,
  Info,
} from 'lucide-react';

export const SkillGraphPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.getSkills();
        if (res.skills) {
          setSkills(res.skills);
        }
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Standard ordered learning hierarchy for Full Stack progression
  const sequenceTiers = [
    { tier: 1, label: 'Tier 1 — Foundational Markup & Logic', skills: ['HTML', 'CSS', 'Git', 'SQL', 'Python'] },
    { tier: 2, label: 'Tier 2 — Scripting & Dynamic Web', skills: ['JavaScript', 'Data Analysis', 'UI/UX'] },
    { tier: 3, label: 'Tier 3 — Modern Ecosystems & APIs', skills: ['TypeScript', 'React', 'Node.js', 'REST APIs', 'Docker'] },
    { tier: 4, label: 'Tier 4 — Backend Frameworks & Storage', skills: ['Express', 'MongoDB', 'Cybersecurity'] },
    { tier: 5, label: 'Tier 5 — Advanced Cloud & AI Systems', skills: ['Cloud', 'Machine Learning'] },
  ];

  const getStatus = (skillName: string): 'Completed' | 'In Progress' | 'Recommended' | 'Locked' => {
    if (['HTML', 'CSS', 'Git'].includes(skillName)) return 'Completed';
    if (['JavaScript', 'React', 'Node.js', 'SQL'].includes(skillName)) return 'In Progress';
    if (['TypeScript', 'Express', 'MongoDB', 'REST APIs'].includes(skillName)) return 'Recommended';
    return 'Locked';
  };

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Programming', 'DevOps & Tools'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Prerequisite Dependency Tree
              </span>
              <Badge variant="brand">Interactive DAG</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interactive Skill Graph
            </h1>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle text-xs font-medium">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Status Legend:</span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
          </span>
          <span className="flex items-center gap-1.5 text-brand-700">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> In Progress
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Recommended
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Locked (Prereqs Missing)
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Assembling hierarchical skill network..." />
        ) : (
          <div className="space-y-8">
            {sequenceTiers.map((tier, tIdx) => {
              const tierSkills = skills.filter(
                (s) =>
                  tier.skills.includes(s.name) &&
                  (activeFilter === 'All' || s.category === activeFilter)
              );

              if (tierSkills.length === 0) return null;

              return (
                <div key={tier.tier} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      {tier.label}
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tierSkills.map((skill) => {
                      const status = getStatus(skill.name);
                      const statusConfig = {
                        Completed: { border: 'border-emerald-300 bg-emerald-50/40', badge: 'success' },
                        'In Progress': { border: 'border-brand-300 bg-brand-50/40', badge: 'brand' },
                        Recommended: { border: 'border-amber-300 bg-amber-50/40', badge: 'warning' },
                        Locked: { border: 'border-slate-200 bg-slate-50/70', badge: 'slate' },
                      }[status];

                      return (
                        <div
                          key={skill._id}
                          onClick={() => setSelectedSkill({ ...skill, status })}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-card-hover hover:scale-[1.01] ${statusConfig.border}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-base text-slate-900">{skill.name}</span>
                            <Badge variant={statusConfig.badge as any} size="sm">
                              {status}
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                            {skill.description}
                          </p>

                          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200/40">
                            <span>{skill.category}</span>
                            <span className="text-brand-600 font-semibold flex items-center gap-1">
                              Inspect <Info className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {tIdx < sequenceTiers.length - 1 && (
                    <div className="flex justify-center text-slate-300 py-2">
                      <ArrowDown className="w-5 h-5 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Skill Details Modal */}
        {selectedSkill && (
          <Modal
            isOpen={!!selectedSkill}
            onClose={() => setSelectedSkill(null)}
            title={`${selectedSkill.name} Competency Details`}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Badge variant={selectedSkill.status === 'Completed' ? 'success' : 'brand'}>
                  {selectedSkill.status}
                </Badge>
                <Badge variant="slate">{selectedSkill.category}</Badge>
                <Badge variant="slate">{selectedSkill.difficulty} Level</Badge>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Skill Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Current Competency</span>
                  <span className="text-brand-600">
                    {selectedSkill.status === 'Completed'
                      ? '90%'
                      : selectedSkill.status === 'In Progress'
                      ? '65%'
                      : '0%'}
                  </span>
                </div>
                <ProgressBar
                  value={
                    selectedSkill.status === 'Completed'
                      ? 90
                      : selectedSkill.status === 'In Progress'
                      ? 65
                      : 0
                  }
                  color={selectedSkill.status === 'Completed' ? 'success' : 'brand'}
                  showPercent={false}
                />
              </div>

              {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Direct Prerequisites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.prerequisites.map((p: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {typeof p === 'object' ? p.name : 'Foundational Skill'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recommended Learning Action
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Check out curated courses, documentation, and quizzes for {selectedSkill.name}.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedSkill(null);
                      window.location.assign('/resources');
                    }}
                    icon={<BookOpen className="w-3.5 h-3.5" />}
                  >
                    View Vetted Resources
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSkill(null);
                      window.location.assign('/quizzes');
                    }}
                  >
                    Take Topic Quiz
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};
