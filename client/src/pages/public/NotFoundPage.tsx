import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home, LayoutDashboard, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-card">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <span className="text-5xl font-black text-slate-900">404</span>
          <h1 className="text-xl font-bold text-slate-800">Page not found.</h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            The page you are looking for doesn't exist or has been relocated within the SkillPath curriculum.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto" icon={<Home className="w-4 h-4" />}>
              Back Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" className="w-full sm:w-auto" icon={<LayoutDashboard className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
