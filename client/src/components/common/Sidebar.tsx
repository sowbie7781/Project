import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  GitCompare,
  Map,
  Network,
  BookOpen,
  HelpCircle,
  FolderGit2,
  Mic,
  Award,
  User,
  LogOut,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assessment', path: '/assessment', icon: ClipboardCheck },
    { label: 'Skill Gap', path: '/skill-gap', icon: GitCompare },
    { label: 'AI Roadmap', path: '/roadmap', icon: Map },
    { label: 'Skill Graph', path: '/skills', icon: Network },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Interview Prep', path: '/interview', icon: Mic },
    { label: 'Career Readiness', path: '/career-readiness', icon: Award },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* User mini profile card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Student'}</h4>
            <p className="text-xs text-brand-600 font-medium truncate capitalize">
              {user?.role === 'admin' ? 'Administrator' : user?.careerGoal ? (typeof user.careerGoal === 'object' ? (user.careerGoal as any).name : 'Target Career Selected') : 'Career Explorer'}
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-subtle'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-brand-500" />}
                  </>
                )}
              </NavLink>
            );
          })}

          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-slate-100">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50/50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Admin Portal</span>
                </div>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
