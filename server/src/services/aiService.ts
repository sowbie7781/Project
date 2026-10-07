import { GoogleGenerativeAI } from '@google/generative-ai';

// Strongly-typed AI contracts
export interface AIRoadmapTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
  completed: boolean;
}

export interface AIRoadmapPhase {
  phaseNumber: number;
  name: string;
  description: string;
  topics: AIRoadmapTopic[];
}

export interface AILearningRoadmap {
  phases: AIRoadmapPhase[];
  generatedByAI: boolean;
  notes: string;
}

export interface AISkillGapItem {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reason: string;
  recommendedAction: string;
}

export interface AISkillGapAnalysis {
  gaps: AISkillGapItem[];
  summary: string;
  readinessEstimate: number;
}

export interface AIInterviewQuestion {
  id: string;
  category: string;
  question: string;
  difficulty: string;
  hints: string[];
}

export interface AIInterviewFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvementAreas: string[];
  overallScore: number;
  summary: string;
}

export interface AIProjectRecommendation {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  requirements: string[];
  expectedOutcome: string;
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        console.log('[AIService] Google Gemini AI initialized successfully.');
      } catch (err: any) {
        console.warn('[AIService] Failed to initialize Gemini client:', err.message);
      }
    } else {
      console.log('[AIService] GEMINI_API_KEY not configured. Autonomous fallback engine active.');
    }
  }

  /**
   * Generates a 5-phase personalized learning roadmap
   */
  async generateLearningRoadmap(params: {
    careerName: string;
    experienceLevel: string;
    skillGaps: Array<{ skillName: string; currentLevel: number; requiredLevel: number; gap: number }>;
    knownSkills: string[];
  }): Promise<AILearningRoadmap> {
    const { careerName, experienceLevel, skillGaps, knownSkills } = params;

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
You are a senior software career mentor. Generate a personalized 5-phase learning roadmap for a student aiming to become a "${careerName}".
Student Profile:
- Experience Level: ${experienceLevel}
- Known Skills: ${knownSkills.join(', ') || 'None stated'}
- Skill Gaps Identified: ${skillGaps.map((g) => `${g.skillName} (Current: ${g.currentLevel}%, Target: ${g.requiredLevel}%)`).join('; ')}

Return ONLY a valid JSON object matching this TypeScript structure:
{
  "phases": [
    {
      "phaseNumber": 1,
      "name": "Phase 1 — Fundamentals",
      "description": "Foundational computer science and baseline principles",
      "topics": [
        {
          "id": "t1-1",
          "title": "Topic Title",
          "description": "Clear learning objective",
          "difficulty": "Beginner",
          "estimatedTime": "12 hours",
          "prerequisites": [],
          "resources": [
            { "title": "Resource Name", "url": "https://developer.mozilla.org", "type": "Documentation" }
          ],
          "completed": false
        }
      ]
    },
    ... (Must include all 5 phases: Phase 1 — Fundamentals, Phase 2 — Core Skills, Phase 3 — Advanced Skills, Phase 4 — Projects, Phase 5 — Interview Preparation)
  ],
  "notes": "Custom advice for this student"
}
Ensure each phase has 2-4 comprehensive topics. Do not wrap in markdown quotes if possible, or use standard \`\`\`json.
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed.phases) && parsed.phases.length >= 3) {
          return {
            phases: parsed.phases.map((p: any, idx: number) => ({
              phaseNumber: p.phaseNumber || idx + 1,
              name: p.name || `Phase ${idx + 1}`,
              description: p.description || '',
              topics: Array.isArray(p.topics)
                ? p.topics.map((t: any, tIdx: number) => ({
                    id: t.id || `topic-${idx + 1}-${tIdx + 1}`,
                    title: t.title || 'Core Topic',
                    description: t.description || '',
                    difficulty: t.difficulty || 'Intermediate',
                    estimatedTime: t.estimatedTime || '10 hours',
                    prerequisites: Array.isArray(t.prerequisites) ? t.prerequisites : [],
                    resources: Array.isArray(t.resources) ? t.resources : [],
                    completed: false,
                  }))
                : [],
            })),
            generatedByAI: true,
            notes: parsed.notes || `AI-tailored curriculum for ${careerName}`,
          };
        }
      } catch (err: any) {
        console.warn('[AIService] Gemini roadmap generation error, switching to algorithmic fallback:', err.message);
      }
    }

    // High quality deterministic fallback roadmap
    return this.generateFallbackRoadmap(careerName, experienceLevel, skillGaps);
  }

  /**
   * Skill gap analysis
   */
  async analyzeSkillGap(
    careerName: string,
    skills: Array<{ name: string; current: number; required: number }>
  ): Promise<AISkillGapAnalysis> {
    const gaps: AISkillGapItem[] = skills.map((s) => {
      const diff = Math.max(0, s.required - s.current);
      let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (diff >= 50) priority = 'Critical';
      else if (diff >= 30) priority = 'High';
      else if (diff >= 15) priority = 'Medium';

      return {
        skillName: s.name,
        currentLevel: s.current,
        requiredLevel: s.required,
        gap: diff,
        priority,
        reason:
          diff > 40
            ? `Fundamental requirement for ${careerName} with significant room for proficiency development.`
            : `Important skill where targeted hands-on labs will close the ${diff}% margin.`,
        recommendedAction: `Engage in structured mini-projects and assessments for ${s.name}.`,
      };
    });

    const avgCurrent = skills.reduce((acc, s) => acc + s.current, 0) / (skills.length || 1);
    const avgRequired = skills.reduce((acc, s) => acc + s.required, 0) / (skills.length || 1);
    const readiness = Math.round((avgCurrent / (avgRequired || 1)) * 100);

    return {
      gaps,
      summary: `Identified ${gaps.filter((g) => g.gap > 0).length} skill areas requiring targeted mastery for ${careerName}. Overall alignment is currently at ${Math.min(100, readiness)}%.`,
      readinessEstimate: Math.min(100, readiness),
    };
  }

  /**
   * Generates mock interview questions
   */
  async generateInterviewQuestions(
    careerName: string,
    track: 'Technical' | 'HR' | 'Behavioral' | 'Mock Interview'
  ): Promise<AIInterviewQuestion[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
Generate 4 realistic interview questions for a college graduate preparing for a "${careerName}" position in the "${track}" round.
Return ONLY a JSON array with this schema:
[
  {
    "id": "q1",
    "category": "${track}",
    "question": "Question text here",
    "difficulty": "Intermediate",
    "hints": ["Hint 1", "Hint 2"]
  }
]
`;
        const res = await model.generateContent(prompt);
        const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err: any) {
        console.warn('[AIService] Gemini interview question error, using fallback:', err.message);
      }
    }

    return this.getFallbackInterviewQuestions(careerName, track);
  }

  /**
   * Evaluates student's interview answers
   */
  async evaluateInterviewAnswer(params: {
    careerName: string;
    track: string;
    question: string;
    answer: string;
  }): Promise<AIInterviewFeedback> {
    const { careerName, track, question, answer } = params;

    if (this.genAI && answer.length > 15) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
You are an expert technical interviewer evaluating a student candidate for "${careerName}".
Round: ${track}
Question: "${question}"
Candidate Answer: "${answer}"

Provide constructive educational feedback. Return ONLY a valid JSON object matching:
{
  "strengths": ["Clear communication of concepts", "..."],
  "weaknesses": ["Missed edge cases", "..."],
  "suggestions": ["Include quantifiable results or metrics", "..."],
  "improvementAreas": ["Deepen understanding of lifecycle nuances"],
  "overallScore": 82,
  "summary": "Educational evaluation overview."
}
`;
        const res = await model.generateContent(prompt);
        const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        if (parsed.strengths && parsed.overallScore) {
          return {
            strengths: parsed.strengths,
            weaknesses: parsed.weaknesses || [],
            suggestions: parsed.suggestions || [],
            improvementAreas: parsed.improvementAreas || [],
            overallScore: Math.min(100, Math.max(20, Number(parsed.overallScore) || 75)),
            summary: parsed.summary || 'Constructive review completed.',
          };
        }
      } catch (err: any) {
        console.warn('[AIService] Gemini interview evaluation error, using fallback:', err.message);
      }
    }

    // Deterministic feedback analysis based on answer quality and depth
    const wordCount = answer.trim().split(/\s+/).length;
    let score = 50;
    if (wordCount > 60) score = 85;
    else if (wordCount > 30) score = 72;
    else if (wordCount > 10) score = 60;

    return {
      strengths: [
        'Addressed the core intent of the question directly.',
        wordCount > 30 ? 'Demonstrated foundational familiarity with terminology.' : 'Concise response formulation.',
        'Structured thought process relevant to college level expectations.',
      ],
      weaknesses: [
        wordCount < 40 ? 'Response is relatively brief; expanding on practical experience will improve impact.' : 'Could elaborate more on error-handling and production considerations.',
        'Connect theoretical knowledge with a concrete project story or real-world example.',
      ],
      suggestions: [
        'Use the STAR method (Situation, Task, Action, Result) when framing technical challenges.',
        'Mention testing and validation steps you undertook during development.',
        'Highlight performance tradeoffs and security considerations in your solutions.',
      ],
      improvementAreas: [
        'Depth in architectural explanation',
        'Real-world implementation metrics and scalability details',
      ],
      overallScore: score,
      summary: `Solid effort demonstrating foundational grasp. For technical interviews, substantiate key assertions with specific tools, frameworks, and architecture patterns. (Note: AI feedback is educational guidance and not an official hiring assessment).`,
    };
  }

  // Fallback roadmap generator
  private generateFallbackRoadmap(
    careerName: string,
    experienceLevel: string,
    skillGaps: Array<{ skillName: string; currentLevel: number; requiredLevel: number; gap: number }>
  ): AILearningRoadmap {
    return {
      phases: [
        {
          phaseNumber: 1,
          name: 'Phase 1 — Fundamentals',
          description: `Core computer science principles, syntax, and foundations tailored for ${careerName}.`,
          topics: [
            {
              id: 'p1-t1',
              title: 'Programming Foundations & Algorithms',
              description: 'Master time/space complexity, core data structures, and clean coding best practices.',
              difficulty: 'Beginner',
              estimatedTime: '15 hours',
              prerequisites: [],
              resources: [
                { title: 'freeCodeCamp JavaScript Algorithms', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'Course' },
                { title: 'MDN Web Docs Guides', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'Documentation' },
              ],
              completed: false,
            },
            {
              id: 'p1-t2',
              title: 'Version Control & Collaborative Git Workflows',
              description: 'Branching strategies, pull requests, resolving merge conflicts, and GitHub repository hygiene.',
              difficulty: 'Beginner',
              estimatedTime: '8 hours',
              prerequisites: [],
              resources: [
                { title: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2', type: 'Documentation' },
              ],
              completed: false,
            },
          ],
        },
        {
          phaseNumber: 2,
          name: 'Phase 2 — Core Skills',
          description: `Industry-standard technologies and framework competencies directly demanded by ${careerName}.`,
          topics: [
            {
              id: 'p2-t1',
              title: 'Modern Component Architectures & State Management',
              description: 'Component lifecycles, hooks, context patterns, and responsive UI composition.',
              difficulty: 'Intermediate',
              estimatedTime: '24 hours',
              prerequisites: ['Programming Foundations'],
              resources: [
                { title: 'Official React Documentation', url: 'https://react.dev/learn', type: 'Documentation' },
                { title: 'Tailwind CSS Fundamentals', url: 'https://tailwindcss.com/docs', type: 'Documentation' },
              ],
              completed: false,
            },
            {
              id: 'p2-t2',
              title: 'RESTful API Engineering & Server Logic',
              description: 'Building secure micro-services, route validation, middleware orchestration, and error handlers.',
              difficulty: 'Intermediate',
              estimatedTime: '20 hours',
              prerequisites: ['Version Control'],
              resources: [
                { title: 'Express.js Documentation', url: 'https://expressjs.com/', type: 'Documentation' },
                { title: 'MDN HTTP & REST Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'Article' },
              ],
              completed: false,
            },
          ],
        },
        {
          phaseNumber: 3,
          name: 'Phase 3 — Advanced Skills',
          description: 'Production-ready database modeling, security enforcement, and cloud infrastructure.',
          topics: [
            {
              id: 'p3-t1',
              title: 'Database Schema Optimization & Querying',
              description: 'Indexing, aggregations, data integrity constraints, and scalable database operations.',
              difficulty: 'Advanced',
              estimatedTime: '18 hours',
              prerequisites: ['RESTful API Engineering'],
              resources: [
                { title: 'MongoDB University Courses', url: 'https://learn.mongodb.com/', type: 'Course' },
              ],
              completed: false,
            },
            {
              id: 'p3-t2',
              title: 'Authentication, Authorization & Security Best Practices',
              description: 'JWT rotation, bcrypt salting, rate limiting, CORS configuration, and OWASP Top 10 mitigation.',
              difficulty: 'Advanced',
              estimatedTime: '16 hours',
              prerequisites: ['RESTful API Engineering'],
              resources: [
                { title: 'OWASP Security Guidelines', url: 'https://owasp.org/www-project-top-ten/', type: 'Documentation' },
              ],
              completed: false,
            },
          ],
        },
        {
          phaseNumber: 4,
          name: 'Phase 4 — Projects',
          description: 'Comprehensive, full-lifecycle portfolio capstones to demonstrate end-to-end competency.',
          topics: [
            {
              id: 'p4-t1',
              title: 'End-to-End Enterprise Web Application Build',
              description: 'Architect, implement, and deploy a production-ready application with CI/CD and telemetry.',
              difficulty: 'Advanced',
              estimatedTime: '40 hours',
              prerequisites: ['Database Schema Optimization', 'Authentication'],
              resources: [
                { title: 'Vercel Deployment Docs', url: 'https://vercel.com/docs', type: 'Documentation' },
                { title: 'Render Hosting Guide', url: 'https://render.com/docs', type: 'Documentation' },
              ],
              completed: false,
            },
          ],
        },
        {
          phaseNumber: 5,
          name: 'Phase 5 — Interview Preparation',
          description: 'System design, behavioral interview tactics, and live coding performance readiness.',
          topics: [
            {
              id: 'p5-t1',
              title: 'Technical & System Design Mock Interviews',
              description: 'High-level architectures, scaling tradeoffs, database sharding, and caching strategies.',
              difficulty: 'Advanced',
              estimatedTime: '20 hours',
              prerequisites: ['End-to-End Enterprise Web Application Build'],
              resources: [
                { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Article' },
              ],
              completed: false,
            },
            {
              id: 'p5-t2',
              title: 'Behavioral STAR Preparation & Resume Alignment',
              description: 'Communicating project milestones, problem solving, leadership, and college-to-workplace transitions.',
              difficulty: 'Intermediate',
              estimatedTime: '10 hours',
              prerequisites: [],
              resources: [
                { title: 'Career Prep Best Practices', url: 'https://www.coursera.org/articles/star-method', type: 'Article' },
              ],
              completed: false,
            },
          ],
        },
      ],
      generatedByAI: false,
      notes: `Targeted ${experienceLevel} curriculum for ${careerName} structured to close current competency margins.`,
    };
  }

  // Fallback interview questions
  private getFallbackInterviewQuestions(
    careerName: string,
    track: 'Technical' | 'HR' | 'Behavioral' | 'Mock Interview'
  ): AIInterviewQuestion[] {
    if (track === 'Behavioral') {
      return [
        {
          id: 'b1',
          category: 'Behavioral',
          question: 'Describe a time when a team project hit a major roadblock or technical disagreement. How did you resolve it?',
          difficulty: 'Intermediate',
          hints: ['Focus on active listening', 'Explain the specific compromise or data-driven decision reached', 'Highlight the outcome'],
        },
        {
          id: 'b2',
          category: 'Behavioral',
          question: 'Tell me about a project where you had to learn a completely new framework or tool under tight deadlines.',
          difficulty: 'Intermediate',
          hints: ['Detail your self-directed learning approach', 'Mention documentation usage', 'Describe the final delivered work'],
        },
        {
          id: 'b3',
          category: 'Behavioral',
          question: 'How do you prioritize competing deadlines across different academic assignments and software milestones?',
          difficulty: 'Beginner',
          hints: ['Explain your task planning tools', 'Discuss communication with mentors or team members'],
        },
      ];
    }

    if (track === 'HR') {
      return [
        {
          id: 'hr1',
          category: 'HR',
          question: `Why are you interested in launching your career specifically as a ${careerName}?`,
          difficulty: 'Beginner',
          hints: ['Connect your college coursework with industry aspirations', 'Cite specific problems you enjoy solving'],
        },
        {
          id: 'hr2',
          category: 'HR',
          question: 'Where do you envision yourself developing professionally within 3 years of graduating?',
          difficulty: 'Beginner',
          hints: ['Focus on continuous skill depth', 'Express interest in mentorship and architectural growth'],
        },
      ];
    }

    // Technical / Mock Interview
    return [
      {
        id: 't1',
        category: 'Technical',
        question: `Explain how asynchronous operations and event-driven architectures work in modern applications built for ${careerName}.`,
        difficulty: 'Intermediate',
        hints: ['Mention the event loop, microtasks vs macrotasks', 'Explain promises and async/await error propagation'],
      },
      {
        id: 't2',
        category: 'Technical',
        question: 'How do you design a database schema to prevent N+1 query bottlenecks and ensure high read performance?',
        difficulty: 'Advanced',
        hints: ['Discuss indexing strategies', 'Explain relational joins vs document referencing / population'],
      },
      {
        id: 't3',
        category: 'Technical',
        question: 'What security practices do you enforce in API endpoints handling sensitive user credentials and session tokens?',
        difficulty: 'Intermediate',
        hints: ['Discuss hashing with salt rounds', 'Explain HTTP-only cookies, JWT verification, and rate limiting'],
      },
      {
        id: 't4',
        category: 'Technical',
        question: 'Walk through how you would isolate and debug a sudden memory leak or performance degradation in production.',
        difficulty: 'Advanced',
        hints: ['Mention profilers and heap snapshots', 'Discuss logging, monitoring dashboards, and incremental rollout'],
      },
    ];
  }
}

export const aiService = new AIService();
