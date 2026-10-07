import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Career, Skill } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  User,
  BrainCircuit,
  Heart,
  Check,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [careers, setCareers] = useState<Career[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [saving, setSaving] = useState(false);

  // Persistent form state retained across steps
  const [formData, setFormData] = useState({
    college: user?.college || '',
    course: user?.course || 'B.Tech',
    department: user?.department || 'Computer Science & Engineering',
    year: user?.year || '3rd Year',
    careerGoal: user?.careerGoal ? (typeof user.careerGoal === 'string' ? user.careerGoal : (user.careerGoal as any)._id) : '',
    experienceLevel: user?.experienceLevel || 'Beginner',
    interests: user?.interests || ([] as string[]),
    knownSkills: user?.knownSkills || ([] as string[]),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [careersRes, skillsRes] = await Promise.all([
          api.getCareers(),
          api.getSkills(),
        ]);
        if (careersRes.careers) setCareers(careersRes.careers);
        if (skillsRes.skills) setSkills(skillsRes.skills);
      } catch (err) {
        console.error('Failed to load onboarding options:', err);
      }
    };
    fetchData();
  }, []);

  const interestOptions = [
    'Web Development',
    'Mobile Apps',
    'Artificial Intelligence',
    'Cloud Architecture',
    'Cybersecurity',
    'Data Analytics',
    'Distributed Systems',
    'UI/UX Design',
    'Open Source Contribution',
  ];

  const toggleInterest = (item: string) => {
    const exists = formData.interests.includes(item);
    setFormData({
      ...formData,
      interests: exists
        ? formData.interests.filter((i) => i !== item)
        : [...formData.interests, item],
    });
  };

  const toggleKnownSkill = (skillName: string) => {
    const exists = formData.knownSkills.includes(skillName);
    setFormData({
      ...formData,
      knownSkills: exists
        ? formData.knownSkills.filter((s) => s !== skillName)
        : [...formData.knownSkills, skillName],
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateUser({
        college: formData.college,
        course: formData.course,
        department: formData.department,
        year: formData.year,
        careerGoal: formData.careerGoal,
        experienceLevel: formData.experienceLevel as any,
        interests: formData.interests,
        knownSkills: formData.knownSkills,
        onboardingCompleted: true,
      });

      // Auto-generate starting roadmap for their career
      if (formData.careerGoal) {
        await api.generateRoadmap(formData.careerGoal).catch(() => null);
      }

      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to finalize onboarding:', err);
    } finally {
      setSaving(false);
    }
  };

  const stepTitles = [
    'Academic Information',
    'Target Career Goal',
    'Experience Level',
    'Tech Interests',
    'Current Skill Stack',
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-card p-8 sm:p-12 space-y-8">
        {/* Onboarding Stepper Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Step {step} of 5: {stepTitles[step - 1]}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {Math.round((step / 5) * 100)}% Completed
            </span>
          </div>

          {/* Stepper bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Student Academic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">Confirm Your Academic Profile</h2>
              <p className="text-sm text-slate-500">
                This helps us calibrate deadlines and project complexity to your university year.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Apex Institute of Technology"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course / Degree
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="B.Sc">B.Sc Computer Science</option>
                    <option value="BCA">BCA</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication">ECE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year (Final)</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Career Goal */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">Choose Your Primary Career Goal</h2>
              <p className="text-sm text-slate-500">
                Select the target role you want to be placement-ready for upon graduation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {careers.map((c) => {
                const selected = formData.careerGoal === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setFormData({ ...formData, careerGoal: c._id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selected
                        ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-2 ring-brand-500/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                      <Badge variant={c.difficulty === 'Advanced' ? 'brand' : 'slate'} size="sm">
                        {c.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Experience Level */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">What is Your Current Experience Level?</h2>
              <p className="text-sm text-slate-500">
                This sets the baseline velocity and difficulty curve of your AI roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  level: 'Beginner',
                  title: 'Beginner',
                  desc: 'Learning fundamentals and syntax. Minimal practical project experience.',
                },
                {
                  level: 'Intermediate',
                  title: 'Intermediate',
                  desc: 'Familiar with core web/data technologies. Built 1-2 small projects.',
                },
                {
                  level: 'Advanced',
                  title: 'Advanced',
                  desc: 'Strong software principles. Looking to optimize architecture and interview performance.',
                },
              ].map((item) => {
                const selected = formData.experienceLevel === item.level;
                return (
                  <div
                    key={item.level}
                    onClick={() => setFormData({ ...formData, experienceLevel: item.level as any })}
                    className={`p-6 rounded-2xl border cursor-pointer text-center space-y-3 transition-all ${
                      selected
                        ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-2 ring-brand-500/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-bold text-lg ${
                        selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.level.charAt(0)}
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">Select Your Technical Interests</h2>
              <p className="text-sm text-slate-500">
                Choose domains you find engaging so we can suggest matching capstones.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      selected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    {selected ? <Check className="w-3.5 h-3.5" /> : null}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Known Skills */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">Which Technologies Do You Know?</h2>
              <p className="text-sm text-slate-500">
                Tag skills you have used before so your diagnostic test can accurately measure gap margins.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {skills.map((s) => {
                const selected = formData.knownSkills.includes(s.name);
                return (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => toggleKnownSkill(s.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? <Check className="w-3.5 h-3.5" /> : null}
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 1}
            icon={<ArrowLeft className="w-4 h-4 mr-1" />}
          >
            Previous
          </Button>

          {step < 5 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={step === 2 && !formData.careerGoal}
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Continue Next
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              loading={saving}
              onClick={handleFinish}
              icon={<Sparkles className="w-4 h-4 ml-1 text-amber-300" />}
            >
              Finish & Launch Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
