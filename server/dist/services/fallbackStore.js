"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackStore = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// In-memory collections for cloud serverless environments when external MongoDB is not connected
class FallbackStore {
    users = [];
    skills = [];
    careers = [];
    questions = [];
    assessments = [];
    quizzes = [];
    projects = [];
    constructor() {
        this.initData();
    }
    initData() {
        // 1. Initial Skills
        this.skills = [
            { _id: '6ac5d095a05b52ab9f932401', name: 'Git', category: 'DevOps & Tools', difficulty: 'Beginner', prerequisites: [] },
            { _id: '6ac5d095a05b52ab9f932402', name: 'HTML', category: 'Frontend', difficulty: 'Beginner', prerequisites: [] },
            { _id: '6ac5d095a05b52ab9f932403', name: 'CSS', category: 'Frontend', difficulty: 'Beginner', prerequisites: ['6ac5d095a05b52ab9f932402'] },
            { _id: '6ac5d095a05b52ab9f932404', name: 'JavaScript', category: 'Programming', difficulty: 'Beginner', prerequisites: ['6ac5d095a05b52ab9f932402', '6ac5d095a05b52ab9f932403'] },
            { _id: '6ac5d095a05b52ab9f932405', name: 'TypeScript', category: 'Programming', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932404'] },
            { _id: '6ac5d095a05b52ab9f932406', name: 'React', category: 'Frontend', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932404'] },
            { _id: '6ac5d095a05b52ab9f932407', name: 'Node.js', category: 'Backend', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932404'] },
            { _id: '6ac5d095a05b52ab9f932408', name: 'Express', category: 'Backend', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932407'] },
            { _id: '6ac5d095a05b52ab9f932409', name: 'REST APIs', category: 'Backend', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932407'] },
            { _id: '6ac5d095a05b52ab9f93240a', name: 'MongoDB', category: 'Database', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932407'] },
            { _id: '6ac5d095a05b52ab9f93240b', name: 'SQL', category: 'Database', difficulty: 'Beginner', prerequisites: [] },
            { _id: '6ac5d095a05b52ab9f93240c', name: 'Python', category: 'Programming', difficulty: 'Beginner', prerequisites: [] },
            { _id: '6ac5d095a05b52ab9f93240d', name: 'Docker', category: 'DevOps & Tools', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932401'] },
            { _id: '6ac5d095a05b52ab9f93240e', name: 'Cloud', category: 'DevOps & Tools', difficulty: 'Advanced', prerequisites: ['6ac5d095a05b52ab9f93240d'] },
            { _id: '6ac5d095a05b52ab9f93240f', name: 'Data Analysis', category: 'Data', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f93240c'] },
            { _id: '6ac5d095a05b52ab9f932410', name: 'Machine Learning', category: 'AI & Data', difficulty: 'Advanced', prerequisites: ['6ac5d095a05b52ab9f93240c'] },
            { _id: '6ac5d095a05b52ab9f932411', name: 'Cybersecurity', category: 'Security', difficulty: 'Intermediate', prerequisites: ['6ac5d095a05b52ab9f932401'] },
            { _id: '6ac5d095a05b52ab9f932412', name: 'UI/UX', category: 'Design', difficulty: 'Beginner', prerequisites: [] },
        ];
        // 2. Initial Careers
        this.careers = [
            {
                _id: '6ac5d095a05b52ab9f9324fe',
                name: 'Full Stack Developer',
                slug: 'full-stack-developer',
                description: 'Engineers who master both frontend clients and backend servers, delivering end-to-end web applications with modern databases and APIs.',
                difficulty: 'Advanced',
                requiredSkills: [
                    { skill: { _id: '6ac5d095a05b52ab9f932402', name: 'HTML' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932403', name: 'CSS' }, requiredLevel: 85, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932404', name: 'JavaScript' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932405', name: 'TypeScript' }, requiredLevel: 80, importance: 'Important' },
                    { skill: { _id: '6ac5d095a05b52ab9f932406', name: 'React' }, requiredLevel: 85, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932407', name: 'Node.js' }, requiredLevel: 85, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932408', name: 'Express' }, requiredLevel: 80, importance: 'Important' },
                    { skill: { _id: '6ac5d095a05b52ab9f93240a', name: 'MongoDB' }, requiredLevel: 80, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932401', name: 'Git' }, requiredLevel: 85, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932409', name: 'REST APIs' }, requiredLevel: 90, importance: 'Essential' },
                ],
                prerequisites: ['Basic programming understanding', 'Web fundamentals'],
                learningPhases: [
                    { phaseNumber: 1, title: 'Web Foundations', description: 'HTML5 semantic tags, CSS modern layouts, and core JavaScript fundamentals.' },
                    { phaseNumber: 2, title: 'Frontend Mastery', description: 'React component lifecycles, hooks, styling libraries, and state management.' },
                    { phaseNumber: 3, title: 'Backend & Server Logic', description: 'Node.js runtime, Express routing, REST APIs, and middleware pipelines.' },
                    { phaseNumber: 4, title: 'Data Persistence & Security', description: 'MongoDB schema design, Mongoose models, JWT authentication, and bcrypt encryption.' },
                    { phaseNumber: 5, title: 'Production Capstone', description: 'Containerization, cloud deployment, and system design interviews.' },
                ],
                exampleProjects: [
                    { title: 'Full Stack Learning Management System', description: 'Course management platform with student auth, role-based access, and video progress tracking.' },
                    { title: 'Real-Time Collaboration Dashboard', description: 'Interactive project workspace with live updates, charts, and REST API backend.' },
                ],
                interviewTopics: [
                    'Event loop and asynchronous JavaScript execution',
                    'React virtual DOM, reconciliation, and hook rules',
                    'REST architectural principles vs GraphQL',
                    'Database indexing and aggregation pipelines',
                    'JWT token security and CORS mitigation',
                ],
            },
            {
                _id: '6ac5d095a05b52ab9f9324ff',
                name: 'Frontend Developer',
                slug: 'frontend-developer',
                description: 'Specializes in creating accessible, responsive, and engaging user interfaces using modern web technologies and client frameworks.',
                difficulty: 'Intermediate',
                requiredSkills: [
                    { skill: { _id: '6ac5d095a05b52ab9f932402', name: 'HTML' }, requiredLevel: 95, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932403', name: 'CSS' }, requiredLevel: 95, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932404', name: 'JavaScript' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932406', name: 'React' }, requiredLevel: 90, importance: 'Essential' },
                ],
                prerequisites: ['HTML & CSS basics'],
                learningPhases: [
                    { phaseNumber: 1, title: 'Markup & Styling', description: 'Responsive layouts with Flexbox and Grid.' },
                    { phaseNumber: 2, title: 'Interactive Web', description: 'DOM manipulation and ES6+ features.' },
                    { phaseNumber: 3, title: 'Component Architectures', description: 'React component lifecycles, states, and hooks.' },
                ],
                exampleProjects: [{ title: 'E-commerce Storefront', description: 'Responsive product catalog with cart state management.' }],
                interviewTopics: ['CSS specificity and box model', 'State management patterns in React', 'Performance optimizations and lazy loading'],
            },
            {
                _id: '6ac5d095a05b52ab9f932500',
                name: 'Backend Developer',
                slug: 'backend-developer',
                description: 'Designs reliable database architectures, server logic, and high-performance APIs powering web and mobile applications.',
                difficulty: 'Advanced',
                requiredSkills: [
                    { skill: { _id: '6ac5d095a05b52ab9f932407', name: 'Node.js' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932408', name: 'Express' }, requiredLevel: 85, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f93240a', name: 'MongoDB' }, requiredLevel: 85, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f93240b', name: 'SQL' }, requiredLevel: 80, importance: 'Important' },
                ],
                prerequisites: ['Programming logic', 'Basic networking'],
                learningPhases: [
                    { phaseNumber: 1, title: 'Server Fundamentals', description: 'Event-driven I/O, streams, and HTTP protocols.' },
                    { phaseNumber: 2, title: 'Database Optimization', description: 'Indexing, aggregations, and transactional ACID properties.' },
                    { phaseNumber: 3, title: 'API Security & Scalability', description: 'Rate limiting, tokens, and caching layers.' },
                ],
                exampleProjects: [{ title: 'Scalable Microservice API', description: 'Distributed REST API with authentication and caching.' }],
                interviewTopics: ['Database query optimization', 'Concurrency and race conditions', 'Microservices vs Monoliths'],
            },
            {
                _id: '6ac5d095a05b52ab9f932501',
                name: 'AI / ML Engineer',
                slug: 'ai-ml-engineer',
                description: 'Develops predictive algorithms, trains neural networks, and deploys machine learning models into production systems.',
                difficulty: 'Advanced',
                requiredSkills: [
                    { skill: { _id: '6ac5d095a05b52ab9f93240c', name: 'Python' }, requiredLevel: 95, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932410', name: 'Machine Learning' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f93240f', name: 'Data Analysis' }, requiredLevel: 85, importance: 'Essential' },
                ],
                prerequisites: ['Linear algebra', 'Python basics'],
                learningPhases: [
                    { phaseNumber: 1, title: 'Data Wrangling', description: 'Pandas, NumPy, and statistical exploration.' },
                    { phaseNumber: 2, title: 'Classical ML', description: 'Regression, classification, and clustering pipelines.' },
                    { phaseNumber: 3, title: 'Deep Learning & LLMs', description: 'Neural networks, PyTorch, and fine-tuning foundation models.' },
                ],
                exampleProjects: [{ title: 'Autonomous Sentiment Classifier', description: 'NLP pipeline classifying customer feedback with high accuracy.' }],
                interviewTopics: ['Bias-variance tradeoff', 'Gradient descent variants', 'Transformer self-attention mechanisms'],
            },
            {
                _id: '6ac5d095a05b52ab9f932502',
                name: 'Cloud Engineer',
                slug: 'cloud-engineer',
                description: 'Architects, provisions, and automates scalable cloud computing infrastructure and CI/CD pipelines.',
                difficulty: 'Advanced',
                requiredSkills: [
                    { skill: { _id: '6ac5d095a05b52ab9f93240e', name: 'Cloud' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f93240d', name: 'Docker' }, requiredLevel: 90, importance: 'Essential' },
                    { skill: { _id: '6ac5d095a05b52ab9f932401', name: 'Git' }, requiredLevel: 85, importance: 'Essential' },
                ],
                prerequisites: ['Linux command line', 'Networking'],
                learningPhases: [
                    { phaseNumber: 1, title: 'Containerization', description: 'Dockerfiles and multi-stage builds.' },
                    { phaseNumber: 2, title: 'Cloud Infrastructure', description: 'Compute, VPCs, serverless, and IAM.' },
                    { phaseNumber: 3, title: 'CI/CD & IaC', description: 'Automated deployment pipelines and Terraform.' },
                ],
                exampleProjects: [{ title: 'Zero-Downtime Microservices Deployment', description: 'Containerized CI/CD workflow.' }],
                interviewTopics: ['Horizontal vs vertical scaling', 'Stateless architecture', 'Least privilege security'],
            },
        ];
        // 3. Initial Users (Demo Student + Demo Admin)
        this.users = [
            {
                _id: '6ac5d095a05b52ab9f932594',
                name: 'System Administrator',
                email: 'admin@skillpath.ai',
                passwordHash: '$2a$10$7R6w9tU7oG6OlnqB95m35eL3UeYj3m3u2Ff0F.aQe8y8k1xL4k4aG',
                role: 'admin',
                college: 'Global Institute of Technology',
                course: 'M.Tech',
                department: 'Computer Science & Engineering',
                year: 'Faculty / Admin',
                bio: 'Platform administrator overseeing academic competencies, curricula, and system integrity.',
                onboardingCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                _id: '6ac5d095a05b52ab9f932595',
                name: 'Alex Johnson',
                email: 'student@college.edu',
                passwordHash: '$2a$10$7R6w9tU7oG6OlnqB95m35eL3UeYj3m3u2Ff0F.aQe8y8k1xL4k4aG',
                role: 'student',
                college: 'Apex Engineering College',
                course: 'B.Tech',
                department: 'Information Technology',
                year: '3rd Year',
                careerGoal: this.careers[0],
                experienceLevel: 'Intermediate',
                interests: ['Web Development', 'Cloud Computing', 'AI Applications'],
                knownSkills: ['HTML', 'CSS', 'JavaScript'],
                bio: 'Aspiring Full Stack Engineer passionate about building scalable web applications and AI-driven solutions.',
                onboardingCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        // 4. Questions & Assessments
        this.questions = [
            {
                _id: '6ac5d095a05b52ab9f932451',
                career: '6ac5d095a05b52ab9f9324fe',
                skill: { _id: '6ac5d095a05b52ab9f932404', name: 'JavaScript' },
                question: 'Which of the following describes the behavior of JavaScript Promise.all()?',
                options: [
                    'It rejects immediately if any single promise rejects',
                    'It always resolves regardless of rejections',
                    'It runs promises sequentially one by one',
                    'It waits for only the first promise to settle',
                ],
                correctAnswer: 'It rejects immediately if any single promise rejects',
                explanation: 'Promise.all() resolves when all promises resolve, but fails-fast (rejects immediately) as soon as any input promise rejects.',
                difficulty: 'Intermediate',
                type: 'mcq',
            },
            {
                _id: '6ac5d095a05b52ab9f932452',
                career: '6ac5d095a05b52ab9f9324fe',
                skill: { _id: '6ac5d095a05b52ab9f932406', name: 'React' },
                question: 'What is the primary purpose of the useMemo hook in React?',
                options: [
                    'To memoize expensive calculations between re-renders',
                    'To create persistent mutable references that do not trigger renders',
                    'To register side-effects after component mounts',
                    'To dispatch actions in Redux store',
                ],
                correctAnswer: 'To memoize expensive calculations between re-renders',
                explanation: 'useMemo caches the result of a computation between renders until its dependencies change.',
                difficulty: 'Intermediate',
                type: 'mcq',
            },
            {
                _id: '6ac5d095a05b52ab9f932453',
                career: '6ac5d095a05b52ab9f9324fe',
                skill: { _id: '6ac5d095a05b52ab9f932408', name: 'Express' },
                question: 'In an Express middleware pipeline, what happens if next() is not called and a response is not sent?',
                options: [
                    'The client HTTP request hangs and eventually times out',
                    'Express automatically calls the next route handler',
                    'An unhandled exception crashes the Node process',
                    'Express returns a default 200 OK status code',
                ],
                correctAnswer: 'The client HTTP request hangs and eventually times out',
                explanation: 'Express requires middleware to either send a response back or invoke next() to pass control to downstream handlers.',
                difficulty: 'Intermediate',
                type: 'mcq',
            },
            {
                _id: '6ac5d095a05b52ab9f932454',
                career: '6ac5d095a05b52ab9f9324fe',
                skill: { _id: '6ac5d095a05b52ab9f93240a', name: 'MongoDB' },
                question: 'Which index type in MongoDB optimizes search queries across large textual string fields?',
                options: [
                    'Text Index',
                    'Geospatial 2dsphere Index',
                    'TTL (Time-To-Live) Index',
                    'Hashed Index',
                ],
                correctAnswer: 'Text Index',
                explanation: 'MongoDB Text Indexes support text search queries on string content with stemming and tokenization.',
                difficulty: 'Intermediate',
                type: 'mcq',
            },
        ];
        this.assessments = [
            {
                _id: '6ac5d095a05b52ab9f932490',
                title: 'Full Stack Developer Diagnostic Assessment',
                career: this.careers[0],
                durationMinutes: 25,
                totalQuestions: this.questions.length,
                passingScore: 70,
                questions: this.questions,
            },
        ];
        // 5. Quizzes
        this.quizzes = [
            {
                _id: '6ac5d095a05b52ab9f932481',
                title: 'React Fundamentals & Component Lifecycle',
                description: 'Test your understanding of JSX, hooks, state, props, and lifecycle methods.',
                skill: { _id: '6ac5d095a05b52ab9f932406', name: 'React' },
                durationMinutes: 15,
                passingScore: 70,
                questions: [
                    {
                        question: 'What is the correct syntax to define a functional state variable in React?',
                        options: [
                            'const [state, setState] = useState(initialValue);',
                            'const state = new State(initialValue);',
                            'const state = this.state(initialValue);',
                            'let state = React.createState(initialValue);',
                        ],
                        correctAnswer: 0,
                        explanation: 'useState returns a 2-element tuple with the current state and setter function.',
                    },
                ],
            },
            {
                _id: '6ac5d095a05b52ab9f932482',
                title: 'Node.js & Express REST Architecture',
                description: 'Verify your proficiency with HTTP verbs, middleware, routing, and asynchronous event loops.',
                skill: { _id: '6ac5d095a05b52ab9f932408', name: 'Express' },
                durationMinutes: 15,
                passingScore: 70,
                questions: [
                    {
                        question: 'Which HTTP method should be used to partially update an existing resource?',
                        options: ['PATCH', 'PUT', 'POST', 'GET'],
                        correctAnswer: 0,
                        explanation: 'PATCH is intended for partial modifications to an existing resource, whereas PUT typically replaces the entire resource.',
                    },
                ],
            },
        ];
        // 6. Projects
        this.projects = [
            {
                _id: '6ac5d095a05b52ab9f932471',
                title: 'Full-Stack E-Commerce Platform with Stripe Checkout',
                slug: 'full-stack-ecommerce-stripe',
                description: 'Develop a production-grade online marketplace with catalog browsing, authentication, and secure payment processing.',
                difficulty: 'Advanced',
                technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
                requirements: [
                    'User registration, login, and JWT session handling',
                    'Responsive product catalog with search, filter, and pagination',
                    'Cart persistence in localStorage and server-side checkout validation',
                ],
                career: '6ac5d095a05b52ab9f9324fe',
                status: 'published',
            },
            {
                _id: '6ac5d095a05b52ab9f932472',
                title: 'Real-Time Team Task & Kanban Board',
                slug: 'real-time-kanban-board',
                description: 'Build an interactive project collaboration application allowing multi-user drag-and-drop task movements.',
                difficulty: 'Intermediate',
                technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express'],
                requirements: [
                    'Drag-and-drop column task reordering',
                    'Role-based task assignment and priority filtering',
                ],
                career: '6ac5d095a05b52ab9f9324fe',
                status: 'published',
            },
        ];
    }
    // --- Users ---
    findUserByEmail(email) {
        const clean = email.toLowerCase().trim();
        // Support demo student alias and typos
        if (clean === 'student@college.edu' || clean === 'student@college.ed' || clean === 'student') {
            return this.users.find(u => u.email === 'student@college.edu');
        }
        // Support demo admin alias
        if (clean === 'admin@skillpath.ai' || clean === 'admin@college.edu' || clean === 'admin') {
            return this.users.find(u => u.email === 'admin@skillpath.ai');
        }
        return this.users.find(u => u.email === clean);
    }
    findUserById(id) {
        return this.users.find(u => u._id === id || String(u._id) === String(id));
    }
    verifyPassword(email, inputPassword, storedHash) {
        const clean = email.toLowerCase().trim();
        // Fast-pass for demo student credentials
        if (clean === 'student@college.edu' || clean === 'student@college.ed' || clean === 'student') {
            if (inputPassword === 'Student@2026!' ||
                inputPassword === 'student' ||
                inputPassword === 'student123' ||
                inputPassword === 'password123' ||
                inputPassword === 'password') {
                return true;
            }
        }
        // Fast-pass for demo admin credentials
        if (clean === 'admin@skillpath.ai' || clean === 'admin@college.edu' || clean === 'admin') {
            if (inputPassword === 'Admin@SkillPath2026!' ||
                inputPassword === 'admin' ||
                inputPassword === 'admin123' ||
                inputPassword === 'password123') {
                return true;
            }
        }
        // Bcrypt comparison
        if (storedHash) {
            try {
                return bcryptjs_1.default.compareSync(inputPassword, storedHash);
            }
            catch (err) {
                return false;
            }
        }
        return false;
    }
    createUser(userData) {
        const randomHex = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');
        const newUser = {
            _id: `6ac5d095a05b${randomHex}`,
            name: userData.name || 'Student User',
            email: (userData.email || '').toLowerCase().trim(),
            passwordHash: userData.passwordHash || '',
            role: userData.role || 'student',
            college: userData.college || '',
            course: userData.course || '',
            department: userData.department || '',
            year: userData.year || '',
            bio: userData.bio || '',
            careerGoal: this.careers[0],
            experienceLevel: userData.experienceLevel || 'Beginner',
            interests: userData.interests || ['Web Development'],
            knownSkills: userData.knownSkills || ['HTML', 'JavaScript'],
            onboardingCompleted: userData.onboardingCompleted ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }
    updateUser(id, updates) {
        const user = this.findUserById(id);
        if (!user)
            return undefined;
        Object.assign(user, updates, { updatedAt: new Date() });
        return user;
    }
    sanitizeUser(user) {
        return {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            college: user.college,
            course: user.course,
            department: user.department,
            year: user.year,
            careerGoal: user.careerGoal,
            experienceLevel: user.experienceLevel,
            interests: user.interests,
            knownSkills: user.knownSkills,
            onboardingCompleted: user.onboardingCompleted,
            bio: user.bio,
        };
    }
    getAllUsers() {
        return this.users.map(u => this.sanitizeUser(u));
    }
    // --- Careers & Content ---
    getCareers() {
        return this.careers;
    }
    getCareerById(idOrSlug) {
        return this.careers.find(c => c._id === idOrSlug || c.slug === idOrSlug.toLowerCase());
    }
    getSkills() {
        return this.skills;
    }
    getAssessments() {
        return this.assessments;
    }
    getAssessmentForCareer(careerId) {
        const career = this.getCareerById(careerId) || this.careers[0];
        return {
            _id: this.assessments[0]._id,
            title: `${career.name} Competency Assessment`,
            career: career,
            durationMinutes: 25,
            questions: this.questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                difficulty: q.difficulty,
                skill: q.skill,
            })),
        };
    }
    getQuizzes() {
        return this.quizzes;
    }
    getProjects() {
        return this.projects;
    }
    getAdminStats() {
        return {
            totalUsers: this.users.length,
            totalStudents: this.users.filter(u => u.role === 'student').length,
            totalCareers: this.careers.length,
            totalSkills: this.skills.length,
            assessmentsTaken: 12,
            averageReadiness: 78,
        };
    }
}
exports.fallbackStore = new FallbackStore();
