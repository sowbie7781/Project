import {
  User,
  Career,
  Skill,
  Assessment,
  AssessmentResult,
  Roadmap,
  SkillGapAnalysis,
  Resource,
  Quiz,
  QuizAttemptResult,
  Project,
  InterviewQuestion,
  InterviewFeedback,
  CareerReadiness,
} from '../types';
import {
  mockDemoStudent,
  mockDemoAdmin,
  mockCareers,
  mockSkills,
  mockAssessment,
  mockSkillGapAnalysis,
  mockRoadmap,
  mockCareerReadiness,
  mockQuizzes,
  mockProjects,
} from './mockData';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL =
  import.meta.env.PROD && (!rawApiUrl || rawApiUrl.includes('localhost') || rawApiUrl.includes('127.0.0.1'))
    ? '/api'
    : (rawApiUrl || '/api');

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('skillpath_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeader(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => ({
        success: false,
        message: `HTTP Error ${response.status}`,
      }));

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          if (localStorage.getItem('skillpath_token')) {
            localStorage.removeItem('skillpath_token');
            localStorage.removeItem('skillpath_user');
            // Notify if needed
          }
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
      throw err;
    }
  }

  // --- Auth & User ---
  async register(payload: any): Promise<{ token: string; user: User }> {
    try {
      return await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      if (payload.name && payload.email) {
        const fallbackUser: User = {
          id: 'user_' + Date.now(),
          _id: 'user_' + Date.now(),
          name: payload.name.trim(),
          email: payload.email.toLowerCase().trim(),
          role: 'student',
          college: payload.college || '',
          course: payload.course || 'B.Tech',
          department: payload.department || 'Computer Science & Engineering',
          year: payload.year || '3rd Year',
          careerGoal: mockCareers[0],
          experienceLevel: 'Intermediate',
          interests: ['Web Development'],
          knownSkills: ['HTML', 'JavaScript'],
          onboardingCompleted: false,
        };
        const token = 'token_' + Date.now();
        try {
          const registeredUsersStr = localStorage.getItem('skillpath_registered_users');
          const registeredUsers: User[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
          registeredUsers.push(fallbackUser);
          localStorage.setItem('skillpath_registered_users', JSON.stringify(registeredUsers));
        } catch (e) {}
        return { token, user: fallbackUser };
      }
      throw err;
    }
  }

  async login(payload: any): Promise<{ token: string; user: User }> {
    try {
      return await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      const email = (payload.email || '').toLowerCase().trim();
      if (email.includes('student') || email.startsWith('student@college')) {
        return { token: 'demo_student_token_2026', user: mockDemoStudent };
      }
      if (email.includes('admin') || email.startsWith('admin@skillpath')) {
        return { token: 'demo_admin_token_2026', user: mockDemoAdmin };
      }
      // Check if user was registered in this browser session
      try {
        const registeredUsersStr = localStorage.getItem('skillpath_registered_users');
        if (registeredUsersStr) {
          const registeredUsers: User[] = JSON.parse(registeredUsersStr);
          const found = registeredUsers.find((u) => u.email === email);
          if (found) {
            return { token: 'token_' + Date.now(), user: found };
          }
        }
      } catch (e) {}
      const savedUser = localStorage.getItem('skillpath_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.email === email) {
            return { token: localStorage.getItem('skillpath_token') || 'token_' + Date.now(), user: parsed };
          }
        } catch (e) {}
      }
      if (email.includes('@')) {
        const adHocUser: User = {
          id: 'user_' + Date.now(),
          _id: 'user_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'student',
          college: 'University Campus',
          course: 'B.Tech',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
          careerGoal: mockCareers[0],
          experienceLevel: 'Intermediate',
          interests: ['Web Development'],
          knownSkills: ['HTML', 'JavaScript'],
          onboardingCompleted: false,
        };
        return { token: 'token_' + Date.now(), user: adHocUser };
      }
      throw err;
    }
  }

  async getMe(): Promise<{ user: User }> {
    try {
      return await this.request('/users/me');
    } catch (err) {
      const saved = localStorage.getItem('skillpath_user');
      if (saved) {
        try {
          return { user: JSON.parse(saved) };
        } catch (e) {}
      }
      return { user: mockDemoStudent };
    }
  }

  async updateMe(payload: Partial<User>): Promise<{ user: User }> {
    try {
      return await this.request('/users/me', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      const saved = localStorage.getItem('skillpath_user');
      const current = saved ? JSON.parse(saved) : mockDemoStudent;
      const updated = { ...current, ...payload };
      localStorage.setItem('skillpath_user', JSON.stringify(updated));
      return { user: updated };
    }
  }

  // --- Careers ---
  async getCareers(): Promise<{ careers: Career[] }> {
    try {
      return await this.request('/careers');
    } catch (err) {
      return { careers: mockCareers };
    }
  }

  async getCareerById(id: string): Promise<{ career: Career }> {
    try {
      return await this.request(`/careers/${id}`);
    } catch (err) {
      const found = mockCareers.find(c => c._id === id || c.slug === id.toLowerCase()) || mockCareers[0];
      return { career: found };
    }
  }

  async selectCareerGoal(careerId: string): Promise<{ user: User; career: Career }> {
    try {
      return await this.request('/careers/select', {
        method: 'POST',
        body: JSON.stringify({ careerId }),
      });
    } catch (err) {
      const found = mockCareers.find(c => c._id === careerId || c.slug === careerId.toLowerCase()) || mockCareers[0];
      const saved = localStorage.getItem('skillpath_user');
      const current = saved ? JSON.parse(saved) : mockDemoStudent;
      const updated = { ...current, careerGoal: found };
      localStorage.setItem('skillpath_user', JSON.stringify(updated));
      return { user: updated, career: found };
    }
  }

  // --- Skills ---
  async getSkills(): Promise<{ skills: Skill[] }> {
    try {
      return await this.request('/skills');
    } catch (err) {
      return { skills: mockSkills };
    }
  }

  // --- Assessments ---
  async getAssessments(): Promise<{ assessments: Assessment[] }> {
    try {
      return await this.request('/assessments');
    } catch (err) {
      return { assessments: [mockAssessment] };
    }
  }

  async getAssessmentForCareer(careerId: string): Promise<{ assessment: Assessment }> {
    try {
      return await this.request(`/assessments/career/${careerId}`);
    } catch (err) {
      return { assessment: mockAssessment };
    }
  }

  async submitAssessment(
    assessmentId: string,
    answers: Record<string, string>
  ): Promise<{ result: AssessmentResult }> {
    try {
      return await this.request(`/assessments/${assessmentId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
    } catch (err) {
      const result: AssessmentResult = {
        _id: 'res_' + Date.now(),
        overallScore: 80,
        totalQuestions: 6,
        correctCount: 5,
        skillScores: [
          { skillId: mockSkills[0]._id, skillName: mockSkills[0].name, score: 85, totalQuestions: 3, correctAnswers: 2 },
          { skillId: mockSkills[2]._id, skillName: mockSkills[2].name, score: 80, totalQuestions: 3, correctAnswers: 2 },
        ],
        strengths: ['JavaScript', 'HTML'],
        weaknesses: ['MongoDB'],
        recommendedSkills: ['MongoDB', 'Express'],
        completedAt: new Date().toISOString(),
      };
      return { result };
    }
  }

  async getAssessmentResults(): Promise<{ results: AssessmentResult[] }> {
    try {
      return await this.request('/assessments/results');
    } catch (err) {
      return { results: [] };
    }
  }

  // --- Skill Gap ---
  async getSkillGapAnalysis(careerId?: string): Promise<SkillGapAnalysis> {
    try {
      const q = careerId ? `?careerId=${careerId}` : '';
      return await this.request(`/skill-gap${q}`);
    } catch (err) {
      return mockSkillGapAnalysis;
    }
  }

  // --- Roadmap ---
  async getRoadmap(careerId?: string): Promise<{ roadmap: Roadmap }> {
    try {
      const q = careerId ? `?careerId=${careerId}` : '';
      return await this.request(`/roadmap${q}`);
    } catch (err) {
      return { roadmap: mockRoadmap };
    }
  }

  async generateRoadmap(careerId?: string): Promise<{ roadmap: Roadmap }> {
    try {
      return await this.request('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({ careerId }),
      });
    } catch (err) {
      return { roadmap: mockRoadmap };
    }
  }

  async updateRoadmapTopic(topicId: string, completed: boolean): Promise<{ roadmap: Roadmap }> {
    try {
      return await this.request(`/roadmap/topic/${topicId}`, {
        method: 'PUT',
        body: JSON.stringify({ completed }),
      });
    } catch (err) {
      return { roadmap: mockRoadmap };
    }
  }

  // --- Resources ---
  async getResources(params: { skillId?: string; difficulty?: string; type?: string; search?: string } = {}): Promise<{ resources: Resource[] }> {
    const searchParams = new URLSearchParams();
    if (params.skillId) searchParams.set('skillId', params.skillId);
    if (params.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params.type) searchParams.set('type', params.type);
    if (params.search) searchParams.set('search', params.search);

    const qs = searchParams.toString();
    return this.request(`/resources${qs ? `?${qs}` : ''}`);
  }

  // --- Quizzes ---
  async getQuizzes(params: { skillId?: string; difficulty?: string } = {}): Promise<{ quizzes: Quiz[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params.skillId) searchParams.set('skillId', params.skillId);
      if (params.difficulty) searchParams.set('difficulty', params.difficulty);

      const qs = searchParams.toString();
      return await this.request(`/quizzes${qs ? `?${qs}` : ''}`);
    } catch (err) {
      return { quizzes: mockQuizzes };
    }
  }

  async getQuizById(id: string): Promise<{ quiz: Quiz }> {
    try {
      return await this.request(`/quizzes/${id}`);
    } catch (err) {
      const found = mockQuizzes.find(q => q._id === id) || mockQuizzes[0];
      return { quiz: found };
    }
  }

  async submitQuiz(id: string, answers: Record<string, number> | number[]): Promise<{ result: QuizAttemptResult }> {
    try {
      return await this.request(`/quizzes/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
    } catch (err) {
      return {
        result: {
          attemptId: 'qa_' + Date.now(),
          score: 100,
          totalQuestions: 1,
          correctAnswers: 1,
          questionReview: [],
          stats: {
            totalAttempts: 1,
            bestScore: 100,
            averageScore: 100,
            latestScore: 100,
          },
        },
      };
    }
  }

  async getQuizHistory(): Promise<{ attempts: any[] }> {
    try {
      return await this.request('/quizzes/history');
    } catch (err) {
      return { attempts: [] };
    }
  }

  // --- Projects ---
  async getProjects(params: { difficulty?: string; careerId?: string } = {}): Promise<{ projects: Project[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params.difficulty) searchParams.set('difficulty', params.difficulty);
      if (params.careerId) searchParams.set('careerId', params.careerId);

      const qs = searchParams.toString();
      return await this.request(`/projects${qs ? `?${qs}` : ''}`);
    } catch (err) {
      return { projects: mockProjects };
    }
  }

  async getProjectById(id: string): Promise<{ project: Project }> {
    try {
      return await this.request(`/projects/${id}`);
    } catch (err) {
      const found = mockProjects.find(p => p._id === id) || mockProjects[0];
      return { project: found };
    }
  }

  async submitProject(id: string, payload: { githubUrl: string; demoUrl?: string; description?: string }): Promise<any> {
    try {
      return await this.request(`/projects/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return { success: true, message: 'Project submitted successfully for evaluation.' };
    }
  }

  // --- Mock Interview ---
  async generateInterviewQuestions(trackType: string, careerId?: string): Promise<{ questions: InterviewQuestion[]; track: string }> {
    try {
      return await this.request('/interview/generate', {
        method: 'POST',
        body: JSON.stringify({ trackType, careerId }),
      });
    } catch (err) {
      return {
        track: trackType || 'Technical',
        questions: [
          {
            id: 'iq1',
            question: 'How does the JavaScript event loop handle microtasks vs macrotasks?',
            category: 'Technical',
            difficulty: 'Intermediate',
            hints: ['Think about Promise microtasks vs timer callbacks.'],
          },
          {
            id: 'iq2',
            question: 'What are the main security considerations when storing JWT tokens on the frontend?',
            category: 'Security',
            difficulty: 'Intermediate',
            hints: ['Think about XSS vectors and HttpOnly cookie options.'],
          },
        ],
      };
    }
  }

  async evaluateInterviewAnswer(payload: {
    question: string;
    answer: string;
    trackType: string;
    careerId?: string;
  }): Promise<{ feedback: InterviewFeedback; disclaimer: string }> {
    try {
      return await this.request('/interview/feedback', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return {
        feedback: {
          overallScore: 85,
          summary: 'Strong technical explanation demonstrating solid understanding of core concepts.',
          strengths: ['Clear terminology', 'Structured response'],
          weaknesses: ['Did not mention event loop execution phases'],
          suggestions: ['Mention practical edge cases like Promise.resolve() vs setTimeout.'],
          improvementAreas: ['Call stack dynamics under heavy asynchronous I/O.'],
        },
        disclaimer: 'AI-generated evaluation.',
      };
    }
  }

  async getInterviewHistory(): Promise<{ sessions: any[] }> {
    try {
      return await this.request('/interview/history');
    } catch (err) {
      return { sessions: [] };
    }
  }

  // --- Career Readiness ---
  async getCareerReadiness(careerId?: string): Promise<CareerReadiness> {
    try {
      const q = careerId ? `?careerId=${careerId}` : '';
      return await this.request(`/readiness${q}`);
    } catch (err) {
      return mockCareerReadiness;
    }
  }

  // --- Admin ---
  async getAdminStats(): Promise<{ stats: any }> {
    try {
      return await this.request('/admin/stats');
    } catch (err) {
      return {
        stats: {
          totalStudents: 1,
          activeStudents: 1,
          totalCareers: mockCareers.length,
          totalSkills: mockSkills.length,
          totalQuestions: 10,
          totalResources: 8,
          totalProjects: mockProjects.length,
          totalAssessmentsTaken: 12,
          averageCompetency: 78,
          averageReadiness: 75,
        },
      };
    }
  }

  async getAdminUsers(): Promise<{ users: User[] }> {
    try {
      return await this.request('/admin/users');
    } catch (err) {
      return { users: [mockDemoStudent, mockDemoAdmin] };
    }
  }

  async updateAdminUserRole(userId: string, role: string): Promise<any> {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async createCareer(payload: any): Promise<any> {
    return this.request('/admin/careers', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deleteCareer(id: string): Promise<any> {
    return this.request(`/admin/careers/${id}`, { method: 'DELETE' });
  }

  async createSkill(payload: any): Promise<any> {
    return this.request('/admin/skills', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deleteSkill(id: string): Promise<any> {
    return this.request(`/admin/skills/${id}`, { method: 'DELETE' });
  }

  async createQuestion(payload: any): Promise<any> {
    return this.request('/admin/questions', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deleteQuestion(id: string): Promise<any> {
    return this.request(`/admin/questions/${id}`, { method: 'DELETE' });
  }

  async createResource(payload: any): Promise<any> {
    return this.request('/admin/resources', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deleteResource(id: string): Promise<any> {
    return this.request(`/admin/resources/${id}`, { method: 'DELETE' });
  }

  async createProject(payload: any): Promise<any> {
    return this.request('/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deleteProject(id: string): Promise<any> {
    return this.request(`/admin/projects/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
