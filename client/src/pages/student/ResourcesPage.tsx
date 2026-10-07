import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Resource, Skill } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  BookOpen,
  Search,
  ExternalLink,
  Clock,
  Filter,
  PlayCircle,
  FileText,
  Bookmark,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.getResources({
        search,
        difficulty: selectedDifficulty,
        type: selectedType,
        skillId: selectedSkill,
      });
      if (res.resources) {
        setResources(res.resources);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const skillsRes = await api.getSkills();
        if (skillsRes.skills) setSkills(skillsRes.skills);
        await fetchResources();
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  const typeIcons: Record<string, any> = {
    Video: PlayCircle,
    Article: FileText,
    Documentation: BookOpen,
    Course: Bookmark,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Curated Learning Repository
              </span>
              <Badge variant="brand">Vetted Links</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning Resources & Documentation
            </h1>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-5 shadow-subtle">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources by title or topic..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Skills</option>
                {skills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Types</option>
                <option value="Documentation">Documentation</option>
                <option value="Course">Course</option>
                <option value="Article">Article</option>
                <option value="Video">Video</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <Button type="submit" variant="primary" size="sm" className="w-full h-full py-2">
                Apply
              </Button>
            </div>
          </form>
        </Card>

        {/* Resources Grid */}
        {loading ? (
          <LoadingSpinner message="Querying learning catalog..." />
        ) : resources.length === 0 ? (
          <Card className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching resources found</h3>
            <p className="text-xs text-slate-500">Try adjusting your keyword search or category filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => {
              const Icon = typeIcons[res.type] || BookOpen;
              return (
                <Card key={res._id} hover className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold text-slate-500">{res.type}</span>
                      </div>
                      <Badge
                        variant={res.difficulty === 'Advanced' ? 'brand' : 'slate'}
                        size="sm"
                      >
                        {res.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {res.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <Badge variant="brand" size="sm">
                        {res.skill?.name || 'General'}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {res.duration}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full justify-between" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                        Open Official Resource
                      </Button>
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
