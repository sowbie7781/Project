import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  GraduationCap,
  Sparkles,
  Target,
  BrainCircuit,
  Compass,
  ArrowRight,
  Code2,
  Users,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs uppercase tracking-wider border border-brand-200">
            College Capstone Project
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About COMPETENCY AI
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover Your Skills. Build Your Future. An academic AI-powered career competency platform bridging the gap between college curricula and tech industry benchmarks.
          </p>
        </div>

        {/* Abstract & Problem Statement Card */}
        <Card className="p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Project Abstract & Mission</h2>
              <p className="text-xs text-slate-500">Autonomous Engineering Capstone Demonstration</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              In conventional collegiate computer science programs, students often complete theory-heavy courses without clear visibility into how their competencies map against real industry job descriptions. Traditional learning management systems (LMS) track exam marks rather than practical industry readiness.
            </p>
            <p>
              <strong className="text-slate-900 font-semibold">COMPETENCY AI</strong> introduces an automated, deterministic career-competency assessment and guidance framework. By evaluating student performance across diagnostic assessments, hands-on portfolio submissions, topic quizzes, and AI-evaluated mock interview rounds, the system synthesizes a comprehensive Career Readiness score alongside a personalized learning roadmap powered by Google Gemini.
            </p>
          </div>
        </Card>

        {/* Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ai-50 text-ai-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Integration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Gemini models provide personalized learning curricula and natural-language evaluation for mock interview answers, backed by deterministic fallback algorithms.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Deterministic Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent, weighted career readiness calculation combining exams (25%), skills (25%), roadmaps (20%), quizzes (10%), projects (10%), and interviews (10%).
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Prerequisite DAG</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive prerequisite tree enforcing strict pedagogical order so students never attempt advanced frameworks before mastering core syntax.
            </p>
          </Card>
        </div>

        {/* Tech Stack Summary */}
        <Card className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-600" /> Technology Architecture
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="font-bold text-slate-900 block">Frontend</span>
              <span className="text-slate-500">React 18, Vite, TypeScript, Tailwind CSS</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="font-bold text-slate-900 block">Backend</span>
              <span className="text-slate-500">Node.js, Express, TypeScript</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="font-bold text-slate-900 block">Database</span>
              <span className="text-slate-500">MongoDB, Mongoose ODM</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="font-bold text-slate-900 block">AI Engine</span>
              <span className="text-slate-500">Google Gemini API via Backend</span>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link to="/register">
            <Button size="lg" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Get Started with COMPETENCY AI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
