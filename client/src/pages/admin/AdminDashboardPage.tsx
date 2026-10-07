import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Layers,
  HelpCircle,
  BookOpen,
  FolderGit2,
  Trash2,
  Plus,
  TrendingUp,
  Award,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'users' | 'careers' | 'skills' | 'questions' | 'resources' | 'projects'>('users');

  // Entities state
  const [users, setUsers] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Creation Modals
  const [addCareerOpen, setAddCareerOpen] = useState(false);
  const [newCareer, setNewCareer] = useState({ name: '', description: '', difficulty: 'Intermediate' });

  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', description: '', difficulty: 'Beginner' });

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, careersRes, skillsRes, resourcesRes, projectsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getCareers(),
        api.getSkills(),
        api.getResources(),
        api.getProjects(),
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (usersRes.users) setUsers(usersRes.users);
      if (careersRes.careers) setCareers(careersRes.careers);
      if (skillsRes.skills) setSkills(skillsRes.skills);
      if (resourcesRes.resources) setResources(resourcesRes.resources);
      if (projectsRes.projects) setProjects(projectsRes.projects);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      await api.updateAdminUserRole(userId, nextRole);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to update role.');
    }
  };

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCareer(newCareer);
      setAddCareerOpen(false);
      setNewCareer({ name: '', description: '', difficulty: 'Intermediate' });
      await fetchAdminData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSkill(newSkill);
      setAddSkillOpen(false);
      setNewSkill({ name: '', category: 'Frontend', description: '', difficulty: 'Beginner' });
      await fetchAdminData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteEntity = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'career') await api.deleteCareer(deleteConfirm.id);
      if (deleteConfirm.type === 'skill') await api.deleteSkill(deleteConfirm.id);
      if (deleteConfirm.type === 'resource') await api.deleteResource(deleteConfirm.id);
      if (deleteConfirm.type === 'project') await api.deleteProject(deleteConfirm.id);
      setDeleteConfirm(null);
      await fetchAdminData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Administrator Control Suite
              </span>
              <Badge variant="danger">Restricted RBAC</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic System Administration
            </h1>
          </div>
        </div>

        {/* Stats Telemetry Cards */}
        {loading ? (
          <LoadingSpinner message="Aggregating platform administrative metrics..." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="p-4">
                <span className="text-xs font-semibold text-slate-500">Total Students</span>
                <p className="text-2xl font-black text-slate-900 mt-2">{stats?.totalStudents || 0}</p>
                <span className="text-[10px] text-slate-400">Registered</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-slate-500">Active Students</span>
                <p className="text-2xl font-black text-brand-600 mt-2">{stats?.activeStudents || 0}</p>
                <span className="text-[10px] text-slate-400">30-day activity</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-slate-500">Assessments Taken</span>
                <p className="text-2xl font-black text-ai-600 mt-2">{stats?.totalAssessmentsTaken || 0}</p>
                <span className="text-[10px] text-slate-400">Exams recorded</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-slate-500">Avg Competency</span>
                <p className="text-2xl font-black text-emerald-600 mt-2">{stats?.averageCompetency || 72}%</p>
                <span className="text-[10px] text-slate-400">Benchmarked score</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-slate-500">Avg Readiness</span>
                <p className="text-2xl font-black text-amber-600 mt-2">{stats?.averageReadiness || 65}%</p>
                <span className="text-[10px] text-slate-400">Readiness index</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-slate-500">Curriculum Paths</span>
                <p className="text-2xl font-black text-brand-600 mt-2">{stats?.totalCareers || 10}</p>
                <span className="text-[10px] text-slate-400">Configured tracks</span>
              </Card>
            </div>

            {/* Management Tabs */}
            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
              {[
                { id: 'users', label: 'Students & Users', icon: Users, count: users.length },
                { id: 'careers', label: 'Careers', icon: Briefcase, count: careers.length },
                { id: 'skills', label: 'Skills', icon: Layers, count: skills.length },
                { id: 'resources', label: 'Resources', icon: BookOpen, count: resources.length },
                { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200/50 text-slate-700">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab: Users Management */}
            {activeTab === 'users' && (
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Registered Students</h3>
                  <span className="text-xs text-slate-500">{users.length} Records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Name & Email</th>
                        <th className="py-3 px-4">College / Course</th>
                        <th className="py-3 px-4">Career Goal</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-slate-500">{u.email}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {u.college || 'College N/A'} • {u.course || 'B.Tech'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="brand" size="sm">
                              {u.careerGoal?.name || 'Full Stack'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={u.role === 'admin' ? 'danger' : 'slate'} size="sm">
                              {u.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleToggle(u._id, u.role)}
                            >
                              Toggle {u.role === 'admin' ? 'Student' : 'Admin'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Tab: Careers Management */}
            {activeTab === 'careers' && (
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Career Competency Tracks</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setAddCareerOpen(true)}
                    icon={<Plus className="w-4 h-4 mr-1" />}
                  >
                    Add Career Path
                  </Button>
                </div>

                <div className="divide-y divide-slate-100">
                  {careers.map((c) => (
                    <div key={c._id} className="py-3.5 flex justify-between items-center text-xs">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                          <Badge variant="brand" size="sm">{c.difficulty}</Badge>
                        </div>
                        <p className="text-slate-500 line-clamp-1">{c.description}</p>
                      </div>

                      <button
                        onClick={() => setDeleteConfirm({ type: 'career', id: c._id, name: c.name })}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tab: Skills Management */}
            {activeTab === 'skills' && (
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Skill Competency Registry</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setAddSkillOpen(true)}
                    icon={<Plus className="w-4 h-4 mr-1" />}
                  >
                    Add Skill
                  </Button>
                </div>

                <div className="divide-y divide-slate-100">
                  {skills.map((s) => (
                    <div key={s._id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{s.name}</span>
                        <span className="text-slate-500 ml-2">({s.category} • {s.difficulty})</span>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'skill', id: s._id, name: s.name })}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tab: Resources Management */}
            {activeTab === 'resources' && (
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Curated Learning Resources</h3>
                  <span className="text-xs text-slate-500">{resources.length} Links</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {resources.map((r) => (
                    <div key={r._id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{r.title}</span>
                        <span className="text-slate-500">{r.type} • {r.url}</span>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'resource', id: r._id, name: r.title })}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tab: Projects Management */}
            {activeTab === 'projects' && (
              <Card className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Capstone Projects</h3>
                  <span className="text-xs text-slate-500">{projects.length} Projects</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {projects.map((p) => (
                    <div key={p._id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{p.title}</span>
                        <span className="text-slate-500">{p.difficulty} • {p.technologies?.join(', ')}</span>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'project', id: p._id, name: p.title })}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Add Career Modal */}
        <Modal isOpen={addCareerOpen} onClose={() => setAddCareerOpen(false)} title="Add Career Path">
          <form onSubmit={handleCreateCareer} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Career Title</label>
              <input
                type="text"
                required
                value={newCareer.name}
                onChange={(e) => setNewCareer({ ...newCareer, name: e.target.value })}
                placeholder="e.g. DevOps Engineer"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={newCareer.description}
                onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
                placeholder="Overview of this career track and responsibilities..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setAddCareerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Create Career Path
              </Button>
            </div>
          </form>
        </Modal>

        {/* Add Skill Modal */}
        <Modal isOpen={addSkillOpen} onClose={() => setAddSkillOpen(false)} title="Add Skill Competency">
          <form onSubmit={handleCreateSkill} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. Next.js"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Programming">Programming</option>
                <option value="DevOps & Tools">DevOps & Tools</option>
                <option value="AI & Data">AI & Data</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
              <input
                type="text"
                required
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                placeholder="Brief summary of technology..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setAddSkillOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Register Skill
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <Modal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            title="Confirm Deletion"
          >
            <div className="space-y-4 text-sm">
              <p className="text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">{deleteConfirm.name}</strong>?
                This action is permanent and cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeleteEntity}>
                  Delete Permanently
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};
