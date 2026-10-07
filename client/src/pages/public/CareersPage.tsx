import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Career } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await api.getCareers();
        if (res.careers) {
          setCareers(res.careers);
        }
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const filteredCareers = careers.filter((c) => {
    if (filterDifficulty === 'All') return true;
    return c.difficulty === filterDifficulty;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs uppercase tracking-wider border border-brand-200">
            Industry Paths
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Target Career Competency Paths
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Explore 10 curated tech careers complete with real-world skill benchmarks, learning phases, capstone project blueprints, and interview expectations.
          </p>

          {/* Difficulty Filters */}
          <div className="flex justify-center gap-2 pt-4">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filterDifficulty === diff
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading career specifications..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCareers.map((career) => (
              <Card key={career._id} hover className="p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant={
                        career.difficulty === 'Advanced'
                          ? 'brand'
                          : career.difficulty === 'Intermediate'
                          ? 'slate'
                          : 'success'
                      }
                    >
                      {career.difficulty}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {career.requiredSkills ? `${career.requiredSkills.length} Core Skills` : ''}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{career.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {career.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.requiredSkills &&
                        career.requiredSkills.slice(0, 5).map((item: any, idx: number) => {
                          const skillName = item.skill?.name || 'Skill';
                          return (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                            >
                              {skillName} ({item.requiredLevel}%)
                            </span>
                          );
                        })}
                      {career.requiredSkills && career.requiredSkills.length > 5 && (
                        <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold">
                          +{career.requiredSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link to={`/careers/${career.slug || career._id}`}>
                    <Button variant="outline" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />}>
                      Explore Path Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
