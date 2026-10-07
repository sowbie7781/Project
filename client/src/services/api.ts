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
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(payload: any): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMe(): Promise<{ user: User }> {
    return this.request('/users/me');
  }

  async updateMe(payload: Partial<User>): Promise<{ user: User }> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // --- Careers ---
  async getCareers(): Promise<{ careers: Career[] }> {
    return this.request('/careers');
  }

  async getCareerById(id: string): Promise<{ career: Career }> {
    return this.request(`/careers/${id}`);
  }

  async selectCareerGoal(careerId: string): Promise<{ user: User; career: Career }> {
    return this.request('/careers/select', {
      method: 'POST',
      body: JSON.stringify({ careerId }),
    });
  }

  // --- Skills ---
  async getSkills(): Promise<{ skills: Skill[] }> {
    return this.request('/skills');
  }

  // --- Assessments ---
  async getAssessments(): Promise<{ assessments: Assessment[] }> {
    return this.request('/assessments');
  }

  async getAssessmentForCareer(careerId: string): Promise<{ assessment: Assessment }> {
    return this.request(`/assessments/career/${careerId}`);
  }

  async submitAssessment(
    assessmentId: string,
    answers: Record<string, string>
  ): Promise<{ result: AssessmentResult }> {
    return this.request(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getAssessmentResults(): Promise<{ results: AssessmentResult[] }> {
    return this.request('/assessments/results');
  }

  // --- Skill Gap ---
  async getSkillGapAnalysis(careerId?: string): Promise<SkillGapAnalysis> {
    const q = careerId ? `?careerId=${careerId}` : '';
    return this.request(`/skill-gap${q}`);
  }

  // --- Roadmap ---
  async getRoadmap(careerId?: string): Promise<{ roadmap: Roadmap }> {
    const q = careerId ? `?careerId=${careerId}` : '';
    return this.request(`/roadmap${q}`);
  }

  async generateRoadmap(careerId?: string): Promise<{ roadmap: Roadmap }> {
    return this.request('/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify({ careerId }),
    });
  }

  async updateRoadmapTopic(topicId: string, completed: boolean): Promise<{ roadmap: Roadmap }> {
    return this.request(`/roadmap/topic/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
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
    const searchParams = new URLSearchParams();
    if (params.skillId) searchParams.set('skillId', params.skillId);
    if (params.difficulty) searchParams.set('difficulty', params.difficulty);

    const qs = searchParams.toString();
    return this.request(`/quizzes${qs ? `?${qs}` : ''}`);
  }

  async getQuizById(id: string): Promise<{ quiz: Quiz }> {
    return this.request(`/quizzes/${id}`);
  }

  async submitQuiz(id: string, answers: Record<string, number> | number[]): Promise<{ result: QuizAttemptResult }> {
    return this.request(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getQuizHistory(): Promise<{ attempts: any[] }> {
    return this.request('/quizzes/history');
  }

  // --- Projects ---
  async getProjects(params: { difficulty?: string; careerId?: string } = {}): Promise<{ projects: Project[] }> {
    const searchParams = new URLSearchParams();
    if (params.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params.careerId) searchParams.set('careerId', params.careerId);

    const qs = searchParams.toString();
    return this.request(`/projects${qs ? `?${qs}` : ''}`);
  }

  async getProjectById(id: string): Promise<{ project: Project }> {
    return this.request(`/projects/${id}`);
  }

  async submitProject(id: string, payload: { githubUrl: string; demoUrl?: string; description?: string }): Promise<any> {
    return this.request(`/projects/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Mock Interview ---
  async generateInterviewQuestions(trackType: string, careerId?: string): Promise<{ questions: InterviewQuestion[]; track: string }> {
    return this.request('/interview/generate', {
      method: 'POST',
      body: JSON.stringify({ trackType, careerId }),
    });
  }

  async evaluateInterviewAnswer(payload: {
    question: string;
    answer: string;
    trackType: string;
    careerId?: string;
  }): Promise<{ feedback: InterviewFeedback; disclaimer: string }> {
    return this.request('/interview/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getInterviewHistory(): Promise<{ sessions: any[] }> {
    return this.request('/interview/history');
  }

  // --- Career Readiness ---
  async getCareerReadiness(careerId?: string): Promise<CareerReadiness> {
    const q = careerId ? `?careerId=${careerId}` : '';
    return this.request(`/readiness${q}`);
  }

  // --- Admin ---
  async getAdminStats(): Promise<{ stats: any }> {
    return this.request('/admin/stats');
  }

  async getAdminUsers(): Promise<{ users: User[] }> {
    return this.request('/admin/users');
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
