import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/common/Sidebar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  User,
  School,
  BookOpen,
  Briefcase,
  Award,
  Sparkles,
  Save,
  CheckCircle,
  FolderGit2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    course: user?.course || '',
    department: user?.department || '',
    year: user?.year || '',
    bio: user?.bio || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateUser(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update student profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const careerName =
    user?.careerGoal && typeof user.careerGoal === 'object'
      ? (user.careerGoal as any).name
      : 'Full Stack Developer';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Student Identity & Portfolio
              </span>
              <Badge variant="brand">{user?.role === 'admin' ? 'Administrator' : 'Student'}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Profile
            </h1>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-ai-500 text-white font-black text-3xl flex items-center justify-center shadow-md shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <Badge variant="brand">{careerName}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-600">
              {user?.course} • {user?.department} • {user?.college || 'University Student'} ({user?.year})
            </p>
          </div>
        </div>

        {/* Profile Edit Form & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Edit Form */}
          <Card className="p-8 lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Edit Academic Credentials
            </h3>

            {success && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / Career Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell campus recruiters about your technical interests and aspirations..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" loading={saving} icon={<Save className="w-4 h-4 ml-1" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Right: Verified Skills & Milestones */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" /> Academic Achievements
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Onboarding Certified</h5>
                    <span className="text-slate-400">Baseline goal established</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Personalized Roadmap</h5>
                    <span className="text-slate-400">5 academic milestones active</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Current Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {user?.knownSkills && user.knownSkills.length > 0 ? (
                  user.knownSkills.map((s: string) => (
                    <Badge key={s} variant="slate">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No skills tagged yet</span>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
