import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Target,
  BrainCircuit,
  Map,
  Compass,
  FileCode2,
  CheckCircle2,
  Layers,
  GraduationCap,
  MessageSquareCode,
  TrendingUp,
  Cpu,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const LandingPage: React.FC = () => {
  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Profile',
      desc: 'Input your college, department, graduation year, and self-reported current tech stack.',
    },
    {
      step: '02',
      title: 'Choose Your Career',
      desc: 'Select from 10 industry-aligned paths such as Full Stack, AI/ML, Cloud, or Cyber Analyst.',
    },
    {
      step: '03',
      title: 'Assess Your Skills',
      desc: 'Take career-calibrated scenario questions that benchmark your foundational and core competencies.',
    },
    {
      step: '04',
      title: 'Discover Your Skill Gaps',
      desc: 'Uncover exact percentage discrepancies between your current mastery and real hiring standards.',
    },
    {
      step: '05',
      title: 'Follow Your AI Roadmap',
      desc: 'Receive a personalized 5-phase learning curriculum generated to fast-track your job readiness.',
    },
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI Skill Assessment',
      desc: 'Adaptive, career-specific diagnostic questions testing syntax, problem solving, and architecture.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      desc: 'Clear visual comparison graphs mapping your current skills against industry benchmark standards.',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: Map,
      title: 'Personalized AI Roadmap',
      desc: '5-phase structured milestones from fundamentals to capstones, generated using Google Gemini.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Compass,
      title: 'Interactive Skill Graph',
      desc: 'Visual prerequisite knowledge tree helping you master concepts in the correct logical sequence.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Layers,
      title: 'Curated Learning Resources',
      desc: 'Vetted, high-quality documentation, interactive courses, and tutorials from MDN and freeCodeCamp.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: CheckCircle2,
      title: 'Interactive Quizzes',
      desc: 'Topic-specific micro-quizzes with immediate answer explanations and attempt history tracking.',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      icon: FileCode2,
      title: 'Practical Portfolio Projects',
      desc: 'Hand-picked portfolio challenges with requirement checklists and GitHub submission validation.',
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      icon: MessageSquareCode,
      title: 'AI Mock Interviews',
      desc: 'Simulate technical, HR, and behavioral rounds with AI-generated feedback and constructive guidance.',
      color: 'text-fuchsia-600 bg-fuchsia-50',
    },
    {
      icon: TrendingUp,
      title: 'Career Readiness Index',
      desc: 'A deterministic, formula-backed score that synthesizes tests, projects, and interview drills.',
      color: 'text-teal-600 bg-teal-50',
    },
  ];

  const popularCareers = [
    { title: 'Full Stack Developer', difficulty: 'Advanced', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], slug: 'full-stack-developer' },
    { title: 'AI/ML Engineer', difficulty: 'Advanced', skills: ['Python', 'Machine Learning', 'Docker', 'Cloud'], slug: 'aiml-engineer' },
    { title: 'Frontend Developer', difficulty: 'Intermediate', skills: ['React', 'TypeScript', 'CSS', 'UI/UX'], slug: 'frontend-developer' },
    { title: 'Data Analyst', difficulty: 'Intermediate', skills: ['SQL', 'Python', 'Data Analysis'], slug: 'data-analyst' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/60 via-slate-50/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                AI Career Competency Platform for College Students
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Discover Your Skills.{' '}
                <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                  Build Your Future.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                SkillPath AI helps students understand their current skills, identify career gaps, build personalized learning paths, and become career ready.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full shadow-lg shadow-brand-500/20" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Student Proof stats */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6 text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900">10+</p>
                  <p className="text-xs text-slate-500">Tech Career Tracks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Personalized AI Roadmaps</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-600">Deterministic</p>
                  <p className="text-xs text-slate-500">Readiness Scoring</p>
                </div>
              </div>
            </div>

            {/* Right Abstract AI Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glass Card */}
                <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 shadow-2xl text-white border border-slate-700/50 overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-52 h-52 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Header of Visual */}
                  <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-xs text-white">
                        AI
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Career Alignment Engine</h4>
                        <p className="text-xs text-slate-400">Target: Full Stack Developer</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      Live Assessment
                    </span>
                  </div>

                  {/* Visual Skill Metrics */}
                  <div className="py-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-300">React & Modern UI Architecture</span>
                        <span className="text-brand-400 font-bold">85% Required / 72% Current</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full w-[72%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-300">Node.js Server & REST Logic</span>
                        <span className="text-emerald-400 font-bold">85% Required / 80% Current</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[80%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-300">MongoDB Database Schemas</span>
                        <span className="text-amber-400 font-bold">80% Required / 45% Current</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[45%]" />
                      </div>
                    </div>
                  </div>

                  {/* Floating AI Recommendation Badge */}
                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Recommended Next Step</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Complete "MongoDB Aggregation Pipelines" quiz to close your 35% database competency gap.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-5 -left-4 sm:left-4 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Career Readiness</p>
                    <p className="text-base font-bold text-slate-900">78% Job-Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">A Proven Student Pathway</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How SkillPath AI Accelerates Your Career
            </p>
            <p className="text-base text-slate-600">
              From college enrollment to placement-ready confidence in five structured milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 hover:bg-white hover:shadow-subtle transition-all">
                <span className="text-3xl font-black text-brand-600 mb-3">{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 z-10">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">Built For Rigorous College Preparation</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Comprehensive Career Competency Features
            </p>
            <p className="text-base text-slate-600">
              Everything needed to transform theoretical classroom knowledge into industry-aligned mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} hover className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Careers Section */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Explore Opportunities</h2>
              <p className="text-3xl font-extrabold text-slate-900">High-Demand Career Tracks</p>
            </div>
            <Link to="/careers" className="mt-4 md:mt-0 text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
              View all 10 Career Paths <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCareers.map((c) => (
              <Card key={c.slug} hover className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={c.difficulty === 'Advanced' ? 'brand' : 'success'}>
                      {c.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{c.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {c.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link to={`/careers/${c.slug}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Career Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* College Project Callout Banner */}
      <section className="py-16 bg-gradient-to-r from-brand-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            College Demonstration & Academic Project Grade Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Technical Career?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Create your student profile today, select your dream role, and let our deterministic algorithm formulate your path to graduation readiness.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 shadow-xl">
                Start Free Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                SP
              </div>
              <span className="font-bold text-white text-base">SKILLPATH AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Career Competency Platform for College Students. Discover Your Skills. Build Your Future.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="/careers" className="hover:text-white">Career Paths</Link></li>
              <li><Link to="/about" className="hover:text-white">About Project</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Student Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white">Assessment</Link></li>
              <li><Link to="/login" className="hover:text-white">Skill Gap Analysis</Link></li>
              <li><Link to="/login" className="hover:text-white">Personalized Roadmaps</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Academic & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
              <li><span className="text-slate-500">College Capstone 2026</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 SKILLPATH AI. All rights reserved. Built with React, Node.js, and Google Gemini.</p>
          <p>College Project Demonstration Version 1.0.0</p>
        </div>
      </footer>
    </div>
  );
};
