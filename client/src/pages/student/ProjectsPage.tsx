import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Project } from '../../types';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  FolderGit2,
  CheckCircle,
  ExternalLink,
  Github,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Send,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Submission modal state
  const [submittingProject, setSubmittingProject] = useState<Project | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [submissionDesc, setSubmissionDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects({
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      });
      if (res.projects) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedDifficulty]);

  const handleOpenSubmit = (proj: Project) => {
    setSubmittingProject(proj);
    setGithubUrl(proj.submission?.githubUrl || '');
    setDemoUrl(proj.submission?.demoUrl || '');
    setSubmissionDesc('');
    setModalError(null);
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!submittingProject) return;

    if (!githubUrl.trim()) {
      setModalError('A valid GitHub repository link is required.');
      return;
    }

    if (!githubUrl.includes('github.com')) {
      setModalError('Please enter a valid GitHub URL (e.g., https://github.com/your-username/repo).');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitProject(submittingProject._id, {
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim(),
        description: submissionDesc.trim(),
      });
      setSubmittingProject(null);
      await fetchProjects();
    } catch (err: any) {
      setModalError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
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
                Hands-on Applied Deliverables
              </span>
              <Badge variant="brand">Portfolio Capstones</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Practical Projects
            </h1>
          </div>

          <div className="flex gap-2">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <LoadingSpinner message="Loading capstone specifications..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => {
              const status = proj.submissionStatus || 'Not Started';
              const statusVariant =
                status === 'Submitted'
                  ? 'success'
                  : status === 'Reviewed'
                  ? 'brand'
                  : 'slate';

              return (
                <Card key={proj._id} className="p-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant={proj.difficulty === 'Advanced' ? 'brand' : 'slate'}
                        size="sm"
                      >
                        {proj.difficulty}
                      </Badge>
                      <Badge variant={statusVariant} size="sm">
                        {status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{proj.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    </div>

                    {/* Requirements Checklist */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Deliverable Requirements:
                      </h4>
                      <ul className="space-y-1.5">
                        {proj.requirements?.map((req, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies Tagging */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies?.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submission Status Action Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {proj.submission ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={proj.submission.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                        >
                          <Github className="w-3.5 h-3.5" /> View Repo <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Ready to build</span>
                    )}

                    <Button
                      variant={proj.submission ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleOpenSubmit(proj)}
                      icon={<Send className="w-3.5 h-3.5" />}
                    >
                      {proj.submission ? 'Update Submission' : 'Submit Project'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Project Submission Modal */}
        {submittingProject && (
          <Modal
            isOpen={!!submittingProject}
            onClose={() => setSubmittingProject(null)}
            title={`Submit Project: ${submittingProject.title}`}
          >
            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Provide your code repository and optional live deployment URL to verify your hands-on competencies in MongoDB.
              </p>

              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GitHub Repository URL *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project-repo"
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Live Demo URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Notes / Features Implemented
                </label>
                <textarea
                  rows={3}
                  value={submissionDesc}
                  onChange={(e) => setSubmissionDesc(e.target.value)}
                  placeholder="Summarize key features, architectures, or challenges resolved..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setSubmittingProject(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" loading={submitting}>
                  Verify & Submit Deliverable
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
};
