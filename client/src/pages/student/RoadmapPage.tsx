import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Roadmap, RoadmapPhase, RoadmapTopic } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.getRoadmap();
        if (res.roadmap) {
          setRoadmap(res.roadmap);
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const handleToggleTopic = async (topicId: string, currentCompleted: boolean) => {
    try {
      const res = await api.updateRoadmapTopic(topicId, !currentCompleted);
      if (res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error('Failed to update topic status:', err);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await api.generateRoadmap();
      if (res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error('Failed to regenerate roadmap:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const togglePhase = (phaseNumber: number) => {
    setExpandedPhases({
      ...expandedPhases,
      [phaseNumber]: !expandedPhases[phaseNumber],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <LoadingSpinner message="Loading personalized curriculum roadmap..." />
        </main>
      </div>
    );
  }

  const phases: RoadmapPhase[] = roadmap?.phases || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Personalized Learning Path
              </span>
              {roadmap?.generatedByAI ? (
                <Badge variant="brand">AI Formulated</Badge>
              ) : (
                <Badge variant="slate">Standard Curriculum</Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {roadmap?.career?.name || 'Full Stack Developer'} Roadmap
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              loading={regenerating}
              onClick={handleRegenerate}
              icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            >
              Regenerate with AI
            </Button>
          </div>
        </div>

        {/* Overall Progress Banner */}
        <Card className="p-6 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white shadow-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-xl font-bold">Curriculum Completion: {roadmap?.progress || 0}%</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {roadmap?.aiNotes ||
                  'Track your progression through foundational syntax, core libraries, advanced architecture, and mock interview preparations.'}
              </p>
            </div>
            <div className="w-full sm:w-48">
              <ProgressBar value={roadmap?.progress || 0} showPercent={false} color="brand" size="lg" />
            </div>
          </div>
        </Card>

        {/* Phases List */}
        <div className="space-y-6">
          {phases.map((phase) => {
            const isExpanded = expandedPhases[phase.phaseNumber] !== false;
            const completedCount = phase.topics.filter((t) => t.completed).length;
            const totalCount = phase.topics.length;

            return (
              <Card key={phase.phaseNumber} className="overflow-hidden border border-slate-200/80">
                {/* Phase Accordion Header */}
                <div
                  onClick={() => togglePhase(phase.phaseNumber)}
                  className="p-6 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-brand-600 font-extrabold flex items-center justify-center text-base shadow-subtle">
                      0{phase.phaseNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{phase.name}</h3>
                      <p className="text-xs text-slate-500">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-600">
                      {completedCount}/{totalCount} Completed
                    </span>
                    <button className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Topics in this phase */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 p-2">
                    {phase.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className={`p-5 rounded-xl transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          topic.completed ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleTopic(topic.id, topic.completed)}
                            className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors"
                          >
                            {topic.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm font-bold ${
                                  topic.completed ? 'line-through text-slate-500' : 'text-slate-900'
                                }`}
                              >
                                {topic.title}
                              </h4>
                              <Badge
                                variant={topic.difficulty === 'Advanced' ? 'brand' : 'slate'}
                                size="sm"
                              >
                                {topic.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 max-w-xl">{topic.description}</p>

                            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {topic.estimatedTime}
                              </span>
                              {topic.prerequisites?.length > 0 && (
                                <span>Prereq: {topic.prerequisites.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Resources Link */}
                        {topic.resources && topic.resources.length > 0 && (
                          <div className="shrink-0 flex items-center gap-2">
                            {topic.resources.map((r, rIdx) => (
                              <a
                                key={rIdx}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-brand-600 hover:bg-slate-50 transition-colors shadow-subtle"
                              >
                                <span>{r.title}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};
