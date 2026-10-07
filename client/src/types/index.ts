export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  college?: string;
  course?: string;
  department?: string;
  year?: string;
  careerGoal?: Career | string;
  profileImage?: string;
  bio?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  interests?: string[];
  knownSkills?: string[];
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: Skill[] | string[];
}

export interface RequiredSkill {
  skill: Skill;
  requiredLevel: number;
  importance: 'Essential' | 'Important' | 'Nice-to-have';
}

export interface Career {
  _id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredSkills: RequiredSkill[];
  prerequisites: string[];
  learningPhases: {
    phaseNumber: number;
    title: string;
    description: string;
  }[];
  exampleProjects: {
    title: string;
    description: string;
  }[];
  interviewTopics: string[];
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  skill?: Skill | { _id: string; name: string };
  difficulty: string;
  type: 'mcq' | 'true_false' | 'scenario';
}

export interface Assessment {
  _id: string;
  title: string;
  career: Career;
  durationMinutes: number;
  questions: Question[];
}

export interface SkillScoreItem {
  skillId?: string;
  skillName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface AssessmentResult {
  _id: string;
  overallScore: number;
  totalQuestions: number;
  correctCount: number;
  skillScores: SkillScoreItem[];
  strengths: string[];
  weaknesses: string[];
  recommendedSkills: string[];
  completedAt: string;
  questionReview?: {
    questionId: string;
    question: string;
    options: string[];
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
    skillName: string;
  }[];
}

export interface RoadmapTopic {
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
  completedAt?: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  name: string;
  description: string;
  topics: RoadmapTopic[];
}

export interface Roadmap {
  _id: string;
  career: Career;
  phases: RoadmapPhase[];
  progress: number;
  generatedByAI: boolean;
  aiNotes?: string;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  importance: string;
  status: string;
}

export interface SkillGapAnalysis {
  career: { id: string; name: string; difficulty: string };
  summary: {
    totalSkills: number;
    masteredCount: number;
    averageCompetency: number;
    readinessEstimate: number;
    criticalGapsCount: number;
    aiExecutiveSummary: string;
  };
  gaps: SkillGapItem[];
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  skill: Skill;
  type: 'Video' | 'Article' | 'Documentation' | 'Course' | 'Practice' | 'Project';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  duration: string;
}

export interface Quiz {
  _id: string;
  title: string;
  skill: Skill;
  difficulty: string;
  questionCount?: number;
  questions?: {
    questionIndex: number;
    question: string;
    options: string[];
  }[];
}

export interface QuizAttemptResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  questionReview: {
    questionIndex: number;
    question: string;
    options: string[];
    userAnswer: number;
    correctAnswer: number;
    explanation: string;
    isCorrect: boolean;
  }[];
  stats: {
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    latestScore: number;
  };
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  skills: Skill[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requirements: string[];
  expectedOutcome: string;
  technologies: string[];
  submissionStatus?: 'Not Started' | 'In Progress' | 'Submitted' | 'Reviewed' | 'Approved';
  submission?: {
    _id: string;
    githubUrl: string;
    demoUrl: string;
    status: string;
    submittedAt: string;
  };
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  difficulty: string;
  hints: string[];
}

export interface InterviewFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvementAreas: string[];
  overallScore: number;
  summary: string;
}

export interface CareerReadiness {
  career: { id: string; name: string };
  overallReadiness: number;
  stage: string;
  summaryNote: string;
  breakdown: {
    category: string;
    weight: number;
    score: number;
    weightedValue: number;
    description: string;
    status: string;
  }[];
  formulaExplanation: string;
}
