import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoStudent = async () => {
    setEmail('student@college.edu');
    setPassword('Student@2026!');
    setError(null);
    setLoading(true);
    try {
      await login({ email: 'student@college.edu', password: 'Student@2026!' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoAdmin = async () => {
    setEmail('admin@skillpath.ai');
    setPassword('Admin@SkillPath2026!');
    setError(null);
    setLoading(true);
    try {
      await login({ email: 'admin@skillpath.ai', password: 'Admin@SkillPath2026!' });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500">Sign in to resume your career competency roadmap</p>
        </div>

        {/* Demo Fast Login Pills for Evaluation */}
        <div className="p-3 bg-brand-50/70 border border-brand-200/60 rounded-2xl space-y-2">
          <p className="text-xs font-semibold text-brand-800 text-center">College Evaluation Fast Logins:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFastDemoStudent}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-brand-100/50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-200 transition-colors shadow-subtle flex items-center justify-center gap-1.5"
            >
              <span>Demo Student</span>
              <span className="text-[10px] text-brand-500 font-normal">→ Sign In</span>
            </button>
            <button
              type="button"
              onClick={handleFastDemoAdmin}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-brand-100/50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-200 transition-colors shadow-subtle flex items-center justify-center gap-1.5"
            >
              <span>Demo Admin</span>
              <span className="text-[10px] text-brand-500 font-normal">→ Sign In</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2 shadow-md shadow-brand-500/20"
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-slate-500">
          New to SkillPath AI?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
