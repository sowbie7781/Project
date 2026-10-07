import React from 'react';
import { Card } from '../../components/common/Card';
import { ShieldCheck } from 'lucide-react';

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: October 2026 • COMPETENCY AI Academic Demonstration
          </p>
        </div>

        <Card className="p-8 sm:p-10 space-y-6 text-sm text-slate-600 leading-relaxed">
          {isPrivacy ? (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
                <p>
                  COMPETENCY AI collects academic profiles provided during onboarding (name, college name, department, year of study), diagnostic test responses, quiz attempt scores, and project submission URLs solely for calculating competency roadmaps.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Usage of AI Models</h2>
                <p>
                  Student queries, skill gap profiles, and typed mock interview responses are evaluated by the Google Gemini API. Personal identifiable information (passwords, tokens) is never transmitted to the generative models.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
                <p>
                  Passwords are encrypted using salted bcrypt hashes. Session credentials are authenticated via standard JSON Web Tokens. We do not sell or monetize student data.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Platform Scope & Purpose</h2>
                <p>
                  COMPETENCY AI is an educational demonstration platform designed for collegiate skill tracking. Assessments and AI feedback are instructional indicators and do not constitute official hiring guarantees by employers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Student Code of Conduct</h2>
                <p>
                  Students are expected to provide authentic project repository links and truthful self-assessments to ensure the learning roadmap remains accurate to their actual capabilities.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. Open Source Curriculum</h2>
                <p>
                  Curated links to MDN Web Docs, freeCodeCamp, and official documentation are provided for direct reference and attribution under open educational licensing.
                </p>
              </section>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
