import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import {
  User,
  Career,
  Skill,
  Question,
  Assessment,
  Resource,
  Quiz,
  Project,
} from './models';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database for seeding...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Career.deleteMany({});
    await Skill.deleteMany({});
    await Question.deleteMany({});
    await Assessment.deleteMany({});
    await Resource.deleteMany({});
    await Quiz.deleteMany({});
    await Project.deleteMany({});

    console.log('[Seed] 1. Seeding Skills with DAG Prerequisites...');
    // Create Skills
    const gitSkill = await Skill.create({
      name: 'Git',
      category: 'DevOps & Tools',
      description: 'Distributed version control system for tracking changes in source code.',
      difficulty: 'Beginner',
      prerequisites: [],
    });

    const htmlSkill = await Skill.create({
      name: 'HTML',
      category: 'Frontend',
      description: 'Standard markup language for documents designed to be displayed in a web browser.',
      difficulty: 'Beginner',
      prerequisites: [],
    });

    const cssSkill = await Skill.create({
      name: 'CSS',
      category: 'Frontend',
      description: 'Style sheet language used for describing presentation of HTML documents.',
      difficulty: 'Beginner',
      prerequisites: [htmlSkill._id],
    });

    const jsSkill = await Skill.create({
      name: 'JavaScript',
      category: 'Programming',
      description: 'Dynamic scripting language that enables interactive web features and server runtimes.',
      difficulty: 'Beginner',
      prerequisites: [htmlSkill._id, cssSkill._id],
    });

    const tsSkill = await Skill.create({
      name: 'TypeScript',
      category: 'Programming',
      description: 'Typed superset of JavaScript that compiles to plain JavaScript.',
      difficulty: 'Intermediate',
      prerequisites: [jsSkill._id],
    });

    const reactSkill = await Skill.create({
      name: 'React',
      category: 'Frontend',
      description: 'Declarative component-driven frontend library for building modern interfaces.',
      difficulty: 'Intermediate',
      prerequisites: [jsSkill._id, htmlSkill._id, cssSkill._id],
    });

    const nodeSkill = await Skill.create({
      name: 'Node.js',
      category: 'Backend',
      description: 'Asynchronous event-driven JavaScript runtime designed to build scalable network applications.',
      difficulty: 'Intermediate',
      prerequisites: [jsSkill._id],
    });

    const expressSkill = await Skill.create({
      name: 'Express',
      category: 'Backend',
      description: 'Fast, unopinionated, minimalist web framework for Node.js.',
      difficulty: 'Intermediate',
      prerequisites: [nodeSkill._id],
    });

    const restApiSkill = await Skill.create({
      name: 'REST APIs',
      category: 'Backend',
      description: 'Architectural style for designing networked applications and endpoints.',
      difficulty: 'Intermediate',
      prerequisites: [nodeSkill._id],
    });

    const mongoSkill = await Skill.create({
      name: 'MongoDB',
      category: 'Database',
      description: 'NoSQL document-oriented database using flexible JSON-like documents.',
      difficulty: 'Intermediate',
      prerequisites: [nodeSkill._id],
    });

    const sqlSkill = await Skill.create({
      name: 'SQL',
      category: 'Database',
      description: 'Domain-specific language used in programming and designed for managing relational data.',
      difficulty: 'Beginner',
      prerequisites: [],
    });

    const pythonSkill = await Skill.create({
      name: 'Python',
      category: 'Programming',
      description: 'High-level general-purpose language renowned for readability and data ecosystems.',
      difficulty: 'Beginner',
      prerequisites: [],
    });

    const dockerSkill = await Skill.create({
      name: 'Docker',
      category: 'DevOps & Tools',
      description: 'Containerization platform packaging software into standardized units for development and deployment.',
      difficulty: 'Intermediate',
      prerequisites: [gitSkill._id],
    });

    const cloudSkill = await Skill.create({
      name: 'Cloud',
      category: 'DevOps & Tools',
      description: 'On-demand availability of computer system resources including computing and cloud storage.',
      difficulty: 'Advanced',
      prerequisites: [dockerSkill._id],
    });

    const dataAnalysisSkill = await Skill.create({
      name: 'Data Analysis',
      category: 'Data',
      description: 'Process of inspecting, cleansing, transforming, and modeling data to discover useful insights.',
      difficulty: 'Intermediate',
      prerequisites: [pythonSkill._id, sqlSkill._id],
    });

    const mlSkill = await Skill.create({
      name: 'Machine Learning',
      category: 'AI & Data',
      description: 'Study of computer algorithms that improve automatically through experience and the use of data.',
      difficulty: 'Advanced',
      prerequisites: [pythonSkill._id, dataAnalysisSkill._id],
    });

    const cyberSkill = await Skill.create({
      name: 'Cybersecurity',
      category: 'Security',
      description: 'Protection of computer systems and networks from information disclosure and cyberattacks.',
      difficulty: 'Intermediate',
      prerequisites: [gitSkill._id],
    });

    const uiuxSkill = await Skill.create({
      name: 'UI/UX',
      category: 'Design',
      description: 'User Interface and User Experience design principles, wireframing, and usability heuristics.',
      difficulty: 'Beginner',
      prerequisites: [],
    });

    console.log('[Seed] 2. Seeding Careers with benchmark competencies...');
    // Create Careers
    const fullstackCareer = await Career.create({
      name: 'Full Stack Developer',
      slug: 'full-stack-developer',
      description: 'Engineers who master both frontend clients and backend servers, delivering end-to-end web applications with modern databases and APIs.',
      difficulty: 'Advanced',
      requiredSkills: [
        { skill: htmlSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: cssSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: jsSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: tsSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: reactSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: nodeSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: expressSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: mongoSkill._id, requiredLevel: 80, importance: 'Essential' },
        { skill: gitSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: restApiSkill._id, requiredLevel: 90, importance: 'Essential' },
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
    });

    const frontendCareer = await Career.create({
      name: 'Frontend Developer',
      slug: 'frontend-developer',
      description: 'Specializes in creating accessible, responsive, and engaging user interfaces using modern client-side libraries and web standards.',
      difficulty: 'Intermediate',
      requiredSkills: [
        { skill: htmlSkill._id, requiredLevel: 95, importance: 'Essential' },
        { skill: cssSkill._id, requiredLevel: 95, importance: 'Essential' },
        { skill: jsSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: tsSkill._id, requiredLevel: 85, importance: 'Important' },
        { skill: reactSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: gitSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: uiuxSkill._id, requiredLevel: 75, importance: 'Important' },
      ],
      prerequisites: ['Design awareness', 'Basic logic'],
      learningPhases: [
        { phaseNumber: 1, title: 'HTML & CSS Layouts', description: 'Flexbox, CSS Grid, mobile responsiveness, and accessibility.' },
        { phaseNumber: 2, title: 'Modern JavaScript (ES6+)', description: 'Closures, promises, fetch API, and DOM manipulation.' },
        { phaseNumber: 3, title: 'React Ecosystem', description: 'Hooks, routing, performance optimization, and custom hooks.' },
      ],
      exampleProjects: [
        { title: 'Interactive Analytics Dashboard', description: 'Clean data visualizations with theme toggling and live metric cards.' },
      ],
      interviewTopics: ['CSS specificity and Box Model', 'React performance optimization (useMemo, useCallback)', 'Web accessibility (WCAG)'],
    });

    const backendCareer = await Career.create({
      name: 'Backend Developer',
      slug: 'backend-developer',
      description: 'Focuses on server architecture, database modeling, business logic, microservices, and robust API endpoints.',
      difficulty: 'Advanced',
      requiredSkills: [
        { skill: jsSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: nodeSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: expressSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: mongoSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: sqlSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: restApiSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: dockerSkill._id, requiredLevel: 75, importance: 'Important' },
      ],
      prerequisites: ['Computer science foundations', 'Algorithmic thinking'],
      learningPhases: [
        { phaseNumber: 1, title: 'Server Fundamentals', description: 'Node.js modules, streams, event emitters, and buffers.' },
        { phaseNumber: 2, title: 'RESTful API Engineering', description: 'HTTP verbs, headers, status codes, and input validation.' },
        { phaseNumber: 3, title: 'Database & Security', description: 'Query tuning, authentication, rate limiting, and caching.' },
      ],
      exampleProjects: [
        { title: 'High-Throughput E-Commerce API', description: 'Robust order processing, inventory locking, and webhook handlers.' },
      ],
      interviewTopics: ['Relational vs Non-relational databases', 'Rate limiting algorithms', 'Concurrency in Node.js'],
    });

    const dataAnalystCareer = await Career.create({
      name: 'Data Analyst',
      slug: 'data-analyst',
      description: 'Translates raw datasets into actionable commercial and academic insights through statistical queries, visualization, and reporting.',
      difficulty: 'Intermediate',
      requiredSkills: [
        { skill: sqlSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: pythonSkill._id, requiredLevel: 80, importance: 'Essential' },
        { skill: dataAnalysisSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: gitSkill._id, requiredLevel: 70, importance: 'Important' },
      ],
      prerequisites: ['Analytical thinking', 'Basic math & statistics'],
      learningPhases: [
        { phaseNumber: 1, title: 'SQL & Querying', description: 'Complex joins, window functions, and subqueries.' },
        { phaseNumber: 2, title: 'Python for Data', description: 'Pandas, NumPy, and exploratory data analysis.' },
        { phaseNumber: 3, title: 'Data Storytelling', description: 'Interactive dashboard creation and executive summaries.' },
      ],
      exampleProjects: [
        { title: 'College Student Placement Predictor', description: 'Historical data analysis identifying factors influencing graduate hiring.' },
      ],
      interviewTopics: ['Window functions in SQL', 'Handling missing data', 'Interpreting standard deviation and variance'],
    });

    const dataScientistCareer = await Career.create({
      name: 'Data Scientist',
      slug: 'data-scientist',
      description: 'Applies statistical modeling, machine learning, and mathematical rigor to extract deep patterns and make predictive inferences.',
      difficulty: 'Advanced',
      requiredSkills: [
        { skill: pythonSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: sqlSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: dataAnalysisSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: mlSkill._id, requiredLevel: 85, importance: 'Essential' },
      ],
      prerequisites: ['Linear algebra', 'Probability and statistics'],
      learningPhases: [
        { phaseNumber: 1, title: 'Data Engineering & EDA', description: 'Data cleansing, feature engineering, and normalization.' },
        { phaseNumber: 2, title: 'Statistical Modeling', description: 'Regression, classification, and clustering algorithms.' },
        { phaseNumber: 3, title: 'Model Evaluation', description: 'ROC curves, cross-validation, and hyperparameter tuning.' },
      ],
      exampleProjects: [
        { title: 'Student Churn & Retention Model', description: 'Predictive algorithm analyzing academic risk indicators with 88% precision.' },
      ],
      interviewTopics: ['Bias-variance tradeoff', 'Overfitting remedies', 'Confusion matrix metrics'],
    });

    const aimlCareer = await Career.create({
      name: 'AI/ML Engineer',
      slug: 'aiml-engineer',
      description: 'Designs, trains, and deploys scalable machine learning models and generative AI systems into production cloud infrastructure.',
      difficulty: 'Advanced',
      requiredSkills: [
        { skill: pythonSkill._id, requiredLevel: 95, importance: 'Essential' },
        { skill: mlSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: dockerSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: cloudSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: restApiSkill._id, requiredLevel: 80, importance: 'Important' },
      ],
      prerequisites: ['Python mastery', 'Deep learning basics'],
      learningPhases: [
        { phaseNumber: 1, title: 'Machine Learning Pipelines', description: 'Scikit-learn, feature pipelines, and model evaluation.' },
        { phaseNumber: 2, title: 'Deep Learning & LLMs', description: 'Neural networks, transformer architectures, and prompt tuning.' },
        { phaseNumber: 3, title: 'MLOps & Deployment', description: 'Dockerizing model endpoints and cloud inference optimization.' },
      ],
      exampleProjects: [
        { title: 'AI Resume & Skill Matcher', description: 'Transformer-based embeddings scoring resume alignment against job descriptions.' },
      ],
      interviewTopics: ['Gradient descent optimization', 'Transformer attention mechanisms', 'Inference latency optimization'],
    });

    const cyberCareer = await Career.create({
      name: 'Cybersecurity Analyst',
      slug: 'cybersecurity-analyst',
      description: 'Monitors, protects, and hardens digital systems against security breaches, vulnerability exploitation, and cyber attacks.',
      difficulty: 'Intermediate',
      requiredSkills: [
        { skill: cyberSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: pythonSkill._id, requiredLevel: 75, importance: 'Important' },
        { skill: gitSkill._id, requiredLevel: 75, importance: 'Important' },
        { skill: cloudSkill._id, requiredLevel: 75, importance: 'Important' },
      ],
      prerequisites: ['Networking fundamentals', 'Operating system principles'],
      learningPhases: [
        { phaseNumber: 1, title: 'Network Security', description: 'TCP/IP, firewall rules, ports, protocols, and packet inspection.' },
        { phaseNumber: 2, title: 'Vulnerability Analysis', description: 'OWASP Top 10, penetration testing, and security scanning.' },
        { phaseNumber: 3, title: 'Incident Response', description: 'Threat hunting, log analysis, and forensics.' },
      ],
      exampleProjects: [
        { title: 'Automated Port & Vulnerability Scanner', description: 'Python utility scanning web servers for open ports and known CVEs.' },
      ],
      interviewTopics: ['CIA Triad principles', 'Mitigating SQL injection and XSS', 'Public key infrastructure (PKI)'],
    });

    const cloudCareer = await Career.create({
      name: 'Cloud Engineer',
      slug: 'cloud-engineer',
      description: 'Architects, provisions, and automates scalable cloud computing infrastructure and CI/CD pipelines.',
      difficulty: 'Advanced',
      requiredSkills: [
        { skill: cloudSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: dockerSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: gitSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: nodeSkill._id, requiredLevel: 70, importance: 'Important' },
      ],
      prerequisites: ['Linux command line', 'Networking'],
      learningPhases: [
        { phaseNumber: 1, title: 'Containerization', description: 'Dockerfiles, multi-stage builds, and volume management.' },
        { phaseNumber: 2, title: 'Cloud Core Services', description: 'Compute instances, serverless functions, VPCs, and IAM.' },
        { phaseNumber: 3, title: 'Infrastructure as Code', description: 'Terraform and automated deployment pipelines.' },
      ],
      exampleProjects: [
        { title: 'Zero-Downtime Microservices Deployment', description: 'Automated CI/CD pipeline building Docker images and deploying to cloud containers.' },
      ],
      interviewTopics: ['Horizontal vs vertical scaling', 'Stateless vs stateful application design', 'IAM principle of least privilege'],
    });

    const uiuxCareer = await Career.create({
      name: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      description: 'Researches user needs, builds wireframes, designs high-fidelity design systems, and ensures intuitive digital experiences.',
      difficulty: 'Intermediate',
      requiredSkills: [
        { skill: uiuxSkill._id, requiredLevel: 95, importance: 'Essential' },
        { skill: htmlSkill._id, requiredLevel: 75, importance: 'Important' },
        { skill: cssSkill._id, requiredLevel: 75, importance: 'Important' },
      ],
      prerequisites: ['Visual communication', 'Empathy for users'],
      learningPhases: [
        { phaseNumber: 1, title: 'Design Foundations', description: 'Color theory, typography, spacing hierarchies, and contrast.' },
        { phaseNumber: 2, title: 'UX Research & Wireframing', description: 'User personas, journey mapping, and low-fidelity prototypes.' },
        { phaseNumber: 3, title: 'Design Systems', description: 'Component libraries, tokenization, and developer handoff.' },
      ],
      exampleProjects: [
        { title: 'College Campus Life Mobile App UI', description: 'End-to-end design system and prototype tested with 25 college students.' },
      ],
      interviewTopics: ['Heuristic evaluation rules', 'Designing for accessibility (WCAG AA)', 'Usability testing methods'],
    });

    const mobileCareer = await Career.create({
      name: 'Mobile App Developer',
      slug: 'mobile-app-developer',
      description: 'Builds responsive, high-performance native and cross-platform mobile applications for iOS and Android.',
      difficulty: 'Intermediate',
      requiredSkills: [
        { skill: jsSkill._id, requiredLevel: 85, importance: 'Essential' },
        { skill: reactSkill._id, requiredLevel: 90, importance: 'Essential' },
        { skill: tsSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: gitSkill._id, requiredLevel: 80, importance: 'Important' },
        { skill: restApiSkill._id, requiredLevel: 85, importance: 'Essential' },
      ],
      prerequisites: ['JavaScript/TypeScript', 'Mobile UX understanding'],
      learningPhases: [
        { phaseNumber: 1, title: 'React Native Basics', description: 'Core components, styling, Flexbox on mobile, and navigation.' },
        { phaseNumber: 2, title: 'State & Device APIs', description: 'Camera, geolocation, AsyncStorage, and offline sync.' },
        { phaseNumber: 3, title: 'Publishing & Performance', description: 'App Store guidelines, Play Store packaging, and memory profiling.' },
      ],
      exampleProjects: [
        { title: 'Student Habit & Attendance Tracker', description: 'Cross-platform app featuring push notifications and offline data cache.' },
      ],
      interviewTopics: ['React Native bridge vs TurboModules', 'App lifecycle states in iOS and Android', 'Offline data persistence strategies'],
    });

    console.log('[Seed] 3. Seeding Assessment Questions for Full Stack Developer...');
    // Questions for Full Stack Developer
    const fullstackQuestions = [
      {
        career: fullstackCareer._id,
        skill: jsSkill._id,
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
        career: fullstackCareer._id,
        skill: jsSkill._id,
        question: 'In JavaScript, "const" variables cannot have their internal object properties mutated.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'const prevents reassigning the variable identifier to a new reference, but objects declared with const can still have their properties modified.',
        difficulty: 'Beginner',
        type: 'true_false',
      },
      {
        career: fullstackCareer._id,
        skill: reactSkill._id,
        question: 'Scenario: A React component re-renders frequently causing lag when typing into an unrelated form input. What is the most appropriate hook to memoize the computed expensive calculation?',
        options: ['useEffect', 'useMemo', 'useCallback', 'useRef'],
        correctAnswer: 'useMemo',
        explanation: 'useMemo caches the result of an expensive calculation between renders unless its dependencies change.',
        difficulty: 'Intermediate',
        type: 'scenario',
      },
      {
        career: fullstackCareer._id,
        skill: reactSkill._id,
        question: 'What is the primary purpose of the "key" prop in React list rendering?',
        options: [
          'To help React identify which items have changed, been added, or removed during reconciliation',
          'To set the CSS class name for styling elements',
          'To encrypt the element in the DOM tree',
          'To bind automatic event listeners',
        ],
        correctAnswer: 'To help React identify which items have changed, been added, or removed during reconciliation',
        explanation: 'Keys give elements a stable identity so React can match elements in the previous tree to elements in the next tree.',
        difficulty: 'Beginner',
        type: 'mcq',
      },
      {
        career: fullstackCareer._id,
        skill: nodeSkill._id,
        question: 'Which mechanism enables Node.js to perform non-blocking I/O operations despite being single-threaded?',
        options: [
          'The Event Loop with the libuv thread pool',
          'Multi-threaded JavaScript engines',
          'Synchronous file reading system calls',
          'Automatic CPU overclocking',
        ],
        correctAnswer: 'The Event Loop with the libuv thread pool',
        explanation: 'Node.js delegates I/O tasks to the libuv abstraction layer and underlying system kernel, picking up callbacks via the event loop.',
        difficulty: 'Intermediate',
        type: 'mcq',
      },
      {
        career: fullstackCareer._id,
        skill: expressSkill._id,
        question: 'Scenario: You want to log incoming request timings and protect all subsequent endpoints with authentication. Where should this logic be placed?',
        options: [
          'Directly inside the MongoDB connection string',
          'Inside Express middleware functions mounted before the route handlers',
          'In the client-side localStorage',
          'In the index.html head tag',
        ],
        correctAnswer: 'Inside Express middleware functions mounted before the route handlers',
        explanation: 'Express middleware functions execute sequentially in the request-response lifecycle and can inspect headers, authenticate tokens, and call next().',
        difficulty: 'Intermediate',
        type: 'scenario',
      },
      {
        career: fullstackCareer._id,
        skill: mongoSkill._id,
        question: 'In MongoDB, which method is best suited for computing multi-stage analytics such as grouping, filtering, and averaging numbers across documents?',
        options: ['find()', 'aggregate()', 'replaceOne()', 'distinct()'],
        correctAnswer: 'aggregate()',
        explanation: 'The MongoDB aggregation framework processes documents through pipeline stages ($match, $group, $project) to return computed results.',
        difficulty: 'Intermediate',
        type: 'mcq',
      },
      {
        career: fullstackCareer._id,
        skill: restApiSkill._id,
        question: 'Which HTTP status code should be returned when a client makes a request without providing valid authentication credentials?',
        options: ['200 OK', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
        correctAnswer: '401 Unauthorized',
        explanation: 'HTTP 401 Unauthorized indicates that the request requires user authentication or the provided credentials are missing/invalid.',
        difficulty: 'Beginner',
        type: 'mcq',
      },
      {
        career: fullstackCareer._id,
        skill: htmlSkill._id,
        question: 'Which HTML5 semantic element should be used to enclose self-contained content intended to be independently distributable (e.g., a blog post or news item)?',
        options: ['<div>', '<article>', '<section>', '<aside>'],
        correctAnswer: '<article>',
        explanation: '<article> represents a self-contained composition in a document that is intended to be independently reusable or syndicateable.',
        difficulty: 'Beginner',
        type: 'mcq',
      },
      {
        career: fullstackCareer._id,
        skill: gitSkill._id,
        question: 'What is the command to create and immediately switch to a new branch named "feature-roadmap" in Git?',
        options: ['git branch feature-roadmap', 'git checkout -b feature-roadmap', 'git merge feature-roadmap', 'git commit -m feature-roadmap'],
        correctAnswer: 'git checkout -b feature-roadmap',
        explanation: 'git checkout -b creates the branch and checks it out in a single step (or git switch -c).',
        difficulty: 'Beginner',
        type: 'mcq',
      },
    ];

    const createdQuestions = await Question.insertMany(fullstackQuestions);

    // Create default assessment for Full Stack Developer
    await Assessment.create({
      title: 'Full Stack Developer Diagnostic Assessment',
      career: fullstackCareer._id,
      description: 'Comprehensive 10-question assessment evaluating your HTML, JavaScript, React, Node.js, Express, MongoDB, and Git proficiency.',
      durationMinutes: 20,
      questions: createdQuestions.map((q) => q._id),
    });

    console.log('[Seed] 4. Seeding Curated Learning Resources...');
    await Resource.insertMany([
      {
        title: 'JavaScript Modern ES6+ Complete Guide',
        description: 'Comprehensive documentation and interactive examples of modern JavaScript language features.',
        skill: jsSkill._id,
        type: 'Documentation',
        difficulty: 'Beginner',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        duration: '4 hours',
      },
      {
        title: 'React Official Documentation: Quick Start & Hooks',
        description: 'Hands-on tutorial explaining components, JSX, state, and rendering cycles with interactive sandboxes.',
        skill: reactSkill._id,
        type: 'Documentation',
        difficulty: 'Intermediate',
        url: 'https://react.dev/learn',
        duration: '6 hours',
      },
      {
        title: 'freeCodeCamp Relational Database & SQL Certification',
        description: 'Interactive terminal exercises teaching relational database queries, schemas, and normalization.',
        skill: sqlSkill._id,
        type: 'Course',
        difficulty: 'Beginner',
        url: 'https://www.freecodecamp.org/learn/relational-database/',
        duration: '15 hours',
      },
      {
        title: 'Node.js Architecture & Event Loop Deep Dive',
        description: 'Technical guide into how Node.js handles asynchronous events, timers, and worker threads.',
        skill: nodeSkill._id,
        type: 'Article',
        difficulty: 'Intermediate',
        url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
        duration: '45 mins',
      },
      {
        title: 'MongoDB University: Basics Course',
        description: 'Official free course covering document databases, CRUD operations, indexing, and Mongoose ODM.',
        skill: mongoSkill._id,
        type: 'Course',
        difficulty: 'Intermediate',
        url: 'https://learn.mongodb.com/',
        duration: '8 hours',
      },
      {
        title: 'Docker Get Started & Containerization Essentials',
        description: 'Hands-on walk-through building images, running containers, and orchestrating multi-container networks.',
        skill: dockerSkill._id,
        type: 'Documentation',
        difficulty: 'Intermediate',
        url: 'https://docs.docker.com/get-started/',
        duration: '3 hours',
      },
      {
        title: 'OWASP Top 10 Web Application Security Risks',
        description: 'The definitive standard awareness document for web developers detailing critical security vulnerabilities.',
        skill: cyberSkill._id,
        type: 'Documentation',
        difficulty: 'Advanced',
        url: 'https://owasp.org/www-project-top-ten/',
        duration: '2 hours',
      },
    ]);

    console.log('[Seed] 5. Seeding Quizzes...');
    await Quiz.create({
      title: 'JavaScript Async & Promises Mastery Quiz',
      skill: jsSkill._id,
      difficulty: 'Intermediate',
      questions: [
        {
          question: 'What is the output of console.log(typeof NaN)?',
          options: ['"undefined"', '"number"', '"NaN"', '"object"'],
          correctAnswer: 1, // "number"
          explanation: 'In JavaScript, NaN (Not-a-Number) is a special numeric value conforming to IEEE-754 floating-point specifications, so its typeof is "number".',
        },
        {
          question: 'Which method returns a promise that resolves or rejects as soon as one of the promises in an iterable settles?',
          options: ['Promise.all', 'Promise.race', 'Promise.allSettled', 'Promise.any'],
          correctAnswer: 1, // Promise.race
          explanation: 'Promise.race takes an iterable of promises and returns a single promise that settles as soon as any input promise settles.',
        },
        {
          question: 'Which statement correctly describes closures in JavaScript?',
          options: [
            'A closure gives an inner function access to an outer function scope',
            'A closure terminates the program immediately',
            'A closure prevents garbage collection of the entire window object',
            'A closure is only created when using the class keyword',
          ],
          correctAnswer: 0,
          explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment.',
        },
      ],
    });

    await Quiz.create({
      title: 'React Components & Hooks Essentials Quiz',
      skill: reactSkill._id,
      difficulty: 'Beginner',
      questions: [
        {
          question: 'Can React Hooks be invoked inside regular loops or condition blocks?',
          options: ['Yes, always', 'No, hooks must be called at the top level of React functions', 'Only inside while loops', 'Only in class components'],
          correctAnswer: 1,
          explanation: 'React enforces the rule that hooks must only be called at the top level to guarantee that hooks are called in the same order on every render.',
        },
        {
          question: 'What does the useState hook return?',
          options: [
            'A tuple/array containing the current state value and a function to update it',
            'An object with getter and setter methods',
            'Only a single primitive number',
            'A reference to the DOM element',
          ],
          correctAnswer: 0,
          explanation: 'useState returns a pair: the current state value and a state updater function: [state, setState].',
        },
      ],
    });

    console.log('[Seed] 6. Seeding Practical Portfolio Projects...');
    await Project.insertMany([
      {
        title: 'Full-Stack Task & Workflow Management System',
        description: 'Build a production-quality task board with real-time drag-and-drop, priority tagging, and secure user authentication.',
        skills: [reactSkill._id, nodeSkill._id, mongoSkill._id, jsSkill._id],
        difficulty: 'Intermediate',
        requirements: [
          'User registration and JWT-based authentication',
          'CRUD operations for tasks with status columns (To Do, In Progress, Done)',
          'Filter tasks by priority, due date, and assigned tag',
          'Responsive UI built with Tailwind CSS',
        ],
        expectedOutcome: 'A deployable web application demonstrating end-to-end full stack architecture and clean state management.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        career: fullstackCareer._id,
      },
      {
        title: 'College Placement Analytics Dashboard',
        description: 'Create an interactive analytical dashboard visualizing campus interview placement trends and salary insights.',
        skills: [reactSkill._id, jsSkill._id, sqlSkill._id],
        difficulty: 'Beginner',
        requirements: [
          'Interactive charts displaying department placement rates',
          'Search and filter table with pagination for company records',
          'Export summary data to CSV format',
        ],
        expectedOutcome: 'A portfolio-grade data visualization web interface highlighting frontend state and styling proficiency.',
        technologies: ['React', 'Chart.js / SVG', 'Tailwind CSS'],
        career: fullstackCareer._id,
      },
    ]);

    console.log('[Seed] 7. Seeding Default Administrator and Demo Student...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@SkillPath2026!', salt);
    const studentPasswordHash = await bcrypt.hash('Student@2026!', salt);

    await User.create({
      name: 'System Administrator',
      email: 'admin@skillpath.ai',
      passwordHash: adminPasswordHash,
      role: 'admin',
      college: 'Global Institute of Technology',
      course: 'M.Tech',
      department: 'Computer Science & Engineering',
      year: 'Faculty / Admin',
      bio: 'Platform administrator overseeing academic competencies, curricula, and system integrity.',
      onboardingCompleted: true,
    });

    const demoStudent = await User.create({
      name: 'Alex Johnson',
      email: 'student@college.edu',
      passwordHash: studentPasswordHash,
      role: 'student',
      college: 'Apex Engineering College',
      course: 'B.Tech',
      department: 'Information Technology',
      year: '3rd Year',
      careerGoal: fullstackCareer._id,
      experienceLevel: 'Intermediate',
      interests: ['Web Development', 'Cloud Computing', 'AI Applications'],
      knownSkills: ['HTML', 'CSS', 'JavaScript'],
      bio: 'Aspiring Full Stack Engineer passionate about building scalable web applications and AI-driven solutions.',
      onboardingCompleted: true,
    });

    console.log(`[Seed] Seeded successfully!`);
    console.log(`Admin User: admin@skillpath.ai / Admin@SkillPath2026!`);
    console.log(`Demo Student: student@college.edu / Student@2026!`);
    console.log(`Careers Seeded: 10`);
    console.log(`Skills Seeded: 18`);
    console.log(`Diagnostic Questions Seeded: ${createdQuestions.length}`);

    return { success: true };
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  }
};

// If run directly via command line
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Failed:', err);
      process.exit(1);
    });
}
