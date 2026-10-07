# SKILLPATH AI

> **Discover Your Skills. Build Your Future.**
> AI-Powered Career Competency & Personalized Roadmap Platform for College Students.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Embedded-green.svg)](https://mongodb.com)

---

## 1. Abstract

In modern computer science education, a substantial discrepancy persists between academic classroom curricula and the practical competencies demanded by the software industry. College students often graduate with strong theoretical foundations in algorithms and basic syntax, yet struggle to benchmark their readiness against live job descriptions or understand which specific prerequisite technologies they lack.

**SKILLPATH AI** is an enterprise-grade academic career competency and intelligent guidance platform. It establishes a deterministic, AI-orchestrated bridge between college coursework and industry employment requirements. Through career-specific diagnostic examinations, prioritized skill gap calculations, interactive prerequisite dependency graphs (DAG), hands-on portfolio validations, quiz analytics, and Google Gemini AI-driven mock interviews, the platform generates personalized, multi-phase learning roadmaps and calculates a deterministic Career Readiness Index.

---

## 2. Problem Statement & Existing System Limitations

### Existing System
Conventional educational technology architectures predominantly center on:
1. **Generic Learning Management Systems (LMS):** Platforms such as Moodle, Canvas, or Blackboard record assignment submissions and grade percentages, but offer zero context on industry job role alignments.
2. **Disconnected MOOC Course Catalogs:** Independent video learning sites present thousands of tutorials without diagnosing whether a student possesses prerequisite knowledge or which gaps are critical.
3. **Subjective Advice:** Placement counseling often relies on ad-hoc advice without quantifiable metrics or verified hands-on deliverables.

### Critical Limitations
- **Lack of Prerequisite Mapping:** Students attempt advanced frameworks (e.g., React, Next.js, Microservices) without having mastered core JavaScript fundamentals or DOM manipulation.
- **Vague Competency Benchmarks:** Students cannot determine whether their skill level matches entry-level industry expectations (e.g., 85% requirement in REST APIs).
- **No Unified Portfolio Verification:** Code repositories and project deliverables are isolated from competency reporting.
- **Absence of Objective Readiness Formulas:** Platforms often report arbitrary percentages without transparent mathematical justification.

---

## 3. Proposed System & Core Objectives

**SKILLPATH AI** resolves these limitations by providing:
1. **Career-Specific Diagnostic Assessments:** Evaluates students through Multiple Choice, True/False, and real-world Scenario-Based questions without exposing correct answers prior to submission.
2. **Automated Skill Gap Analysis:** Quantifies the exact margin between student competency and career benchmarks, categorizing priorities into *Critical*, *High*, *Medium*, and *Low*.
3. **Interactive Prerequisite DAG:** A visual prerequisite knowledge tree that prevents pedagogical skipping and guides students through sequential tiers.
4. **AI-Formulated Learning Roadmaps:** 5 structured academic phases (*Fundamentals*, *Core Skills*, *Advanced Skills*, *Projects*, *Interview Preparation*) customized to the student's background using Google Gemini.
5. **Practical Project Deliverable Tracking:** Verified submission mechanisms validating GitHub repository URLs and live deployment links.
6. **AI Mock Interview Coach:** Technical, HR, and behavioral interview simulation with constructive educational guidance adhering to the STAR method.
7. **Deterministic Career Readiness Index:** A mathematically documented, weighted scoring formula yielding a reliable placement readiness index.

---

## 4. System Architecture

The application adopts a decoupled client-server architecture built entirely with TypeScript:

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION                                 |
|                               (React 18 + Vite + Tailwind CSS)                         |
|                                                                                       |
|  [Public Routes]       [Student Portal]                   [Admin Dashboard]           |
|  - Landing Page        - Multi-Step Onboarding            - System KPI Metrics        |
|  - 10 Career Tracks    - Student Dashboard                - User Role Management      |
|  - Career Detail       - Diagnostic Assessment            - Full Entity CRUD Controls |
|  - Features & About    - Assessment Results & Review      - Confirmation Dialogs      |
|  - Authentication      - Prioritized Skill Gap Analysis                               |
|                        - AI 5-Phase Roadmap                                           |
|                        - Prerequisite Skill Graph                                     |
|                        - Vetted Learning Resources                                    |
|                        - Topic Quizzes & History                                      |
|                        - Applied Projects & GitHub Submissions                        |
|                        - AI Mock Interview Preparation                                |
|                        - Deterministic Career Readiness                               |
|                        - Profile & Credentials                                        |
+-------------------------------------------┬-------------------------------------------+
                                            │ RESTful API (Bearer JWT / JSON)
+-------------------------------------------▼-------------------------------------------+
|                                    BACKEND SERVER                                     |
|                                (Node.js + Express + TypeScript)                       |
|                                                                                       |
|  [Security & Middleware]   [Domain Controllers]           [AI Engine]                 |
|  - Helmet HTTP Headers     - Auth & RBAC Middleware       - Gemini API Integration    |
|  - CORS Safe Whitelist     - Careers & Assessments        - Schema Contract Validator |
|  - Rate Limiting           - Skill Gaps & Readiness       - Deterministic Fallback    |
|  - Centralized Errors      - Quizzes & Project Tracker                                |
+-------------------------------------------┬-------------------------------------------+
                                            │ Mongoose ODM
+-------------------------------------------▼-------------------------------------------+
|                                    DATA PERSISTENCE                                   |
|                             (MongoDB Atlas / Embedded Mongoose)                       |
|                                                                                       |
|  - Users Collection (Students / Admins)       - Assessments & Results Collections     |
|  - Careers Collection (10 Standard Tracks)    - Roadmaps Collection (5 Phases)        |
|  - Skills Collection (18 DAG Nodes)           - Resources, Quizzes & Projects         |
+---------------------------------------------------------------------------------------+
```

---

## 5. Database Schema & ER Design

The database schema is modeled using Mongoose ODM with strong referential integrity:

1. **User:**
   - `name`, `email` (unique index), `passwordHash` (bcrypt 10 rounds), `role` (`student` | `admin`), `college`, `course`, `department`, `year`, `careerGoal` (ref `Career`), `experienceLevel`, `interests`, `knownSkills`, `onboardingCompleted`.
2. **Career:**
   - `name`, `slug` (unique), `description`, `difficulty`, `requiredSkills` (array of `{ skill: ObjectId, requiredLevel: Number, importance: String }`), `learningPhases`, `exampleProjects`, `interviewTopics`.
3. **Skill:**
   - `name`, `category`, `description`, `difficulty`, `prerequisites` (array of self-referencing `Skill` ObjectIds forming a DAG).
4. **Question:**
   - `career` (ref `Career`), `skill` (ref `Skill`), `question`, `options`, `correctAnswer`, `explanation`, `difficulty`, `type` (`mcq` | `true_false` | `scenario`).
5. **Assessment & AssessmentResult:**
   - `assessment`: `career`, `durationMinutes`, `questions`.
   - `assessmentResult`: `user`, `career`, `overallScore`, `skillScores`, `strengths`, `weaknesses`, `completedAt`.
6. **Roadmap:**
   - `user`, `career`, `phases` (Array of 5 phases with topics: `{ id, title, description, difficulty, estimatedTime, prerequisites, resources, completed }`), `progress`, `generatedByAI`.
7. **Resource:**
   - `title`, `description`, `skill`, `type` (`Video` | `Article` | `Documentation` | `Course`), `difficulty`, `url`, `duration`.
8. **Quiz & QuizAttempt:**
   - `quiz`: `title`, `skill`, `difficulty`, `questions`.
   - `quizAttempt`: `user`, `quiz`, `score`, `correctAnswers`, `userAnswers`, `completedAt`.
9. **Project & ProjectSubmission:**
   - `project`: `title`, `description`, `skills`, `difficulty`, `requirements`, `technologies`, `career`.
   - `projectSubmission`: `user`, `project`, `githubUrl`, `demoUrl`, `description`, `status` (`Submitted` | `Reviewed` | `Approved`).
10. **Progress:**
    - `user`, `skill`, `percentage`, `status` (`locked` | `recommended` | `in_progress` | `completed`).
11. **InterviewSession:**
    - `user`, `career`, `trackType` (`Technical` | `HR` | `Behavioral` | `Mock Interview`), `questions`, `answers`, `feedback` (`strengths`, `weaknesses`, `suggestions`, `overallScore`).

---

## 6. Deterministic Career Readiness Scoring Formula

To ensure academic transparency and prevent arbitrary statistical generation, the **Career Readiness Index** is computed using a deterministic weighted formula:

$$\text{Readiness} = (\text{Assessment} \times 0.25) + (\text{Skills} \times 0.25) + (\text{Roadmap} \times 0.20) + (\text{Quizzes} \times 0.10) + (\text{Projects} \times 0.10) + (\text{Interviews} \times 0.10)$$

### Formula Breakdown:
| Component | Weight | Calculation Basis |
| :--- | :---: | :--- |
| **Diagnostic Assessment** | **25%** | Percentage score obtained on career-tailored diagnostic examination. |
| **Skill Mastery** | **25%** | Ratio of career-required skills verified at or above target benchmark: $(\text{Mastered} / \text{Required}) \times 100$. |
| **Curriculum Roadmap** | **20%** | Percentage of multi-phase roadmap topics completed and checked off. |
| **Knowledge Quizzes** | **10%** | Average score across all interactive topic quizzes attempted. |
| **Portfolio Projects** | **10%** | Practical portfolio deliverables submitted with validated GitHub URLs (2 projects = 100%). |
| **Mock Interviews** | **10%** | Technical & behavioral interview rounds completed and evaluated (2 sessions = 100%). |

---

## 7. AI Service & Structured Data Contracts

The server integrates Google Gemini (`gemini-1.5-flash`) through `aiService.ts`. The API key is stored exclusively on the server (`GEMINI_API_KEY`) and is never exposed to the client.

### Resilient Fallback Engine
When `GEMINI_API_KEY` is not provided or API calls experience rate limits, the system does not crash or fabricate fake data. Instead, it transitions to a deterministic algorithmic curriculum engine that generates structured 5-phase roadmaps based on the student's actual skill gap margins.

---

## 8. Technology Stack

### Frontend Client
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS (Custom SaaS palette, Glassmorphism)
- **Icons:** Lucide React
- **Routing:** React Router DOM v6
- **Architecture:** Centralized typed API service with JWT interceptors

### Backend Server
- **Runtime:** Node.js (v24.x compatible)
- **Framework:** Express
- **Language:** TypeScript 5.x (`tsx` execution)
- **Database:** MongoDB via Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs (10 rounds)
- **Security:** Helmet, CORS, express-rate-limit

---

## 9. Local Development & Setup

### Prerequisites
- Node.js (v18+ or v20+ or v24+)
- npm (v9+)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repo-url>
   cd skillpath-ai
   npm run install:all
   ```

2. **Configure Environment Variables:**
   - Server: Copy `server/.env.example` to `server/.env`
   - Client: Copy `client/.env.example` to `client/.env`

3. **Seed Database:**
   ```bash
   npm run seed
   ```
   *Populates 10 career paths, 18 skills with DAG prerequisites, diagnostic questions, quizzes, resources, projects, and default users.*

4. **Start Development Servers Concurrently:**
   ```bash
   npm run dev
   ```
   - Client: `http://localhost:5173`
   - Server API: `http://localhost:5000/api`

---

## 10. Default Accounts for Demonstration

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@college.edu` | `Student@2026!` |
| **Administrator** | `admin@skillpath.ai` | `Admin@SkillPath2026!` |

---

## 11. Production Deployment Guide

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist network access (`0.0.0.0/0`).
3. Copy the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/skillpath?retryWrites=true&w=majority`.

### Backend Deployment (Render or Railway)
1. Deploy from the `/server` directory.
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Set environment variables:
   - `MONGODB_URI`: Atlas connection string
   - `JWT_SECRET`: High-entropy 32+ character key
   - `GEMINI_API_KEY`: Google AI Studio API key
   - `CLIENT_URL`: Production Vercel URL
   - `NODE_ENV`: `production`

### Frontend Deployment (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variable:
   - `VITE_API_URL`: Backend production URL (e.g. `https://skillpath-api.onrender.com/api`)

---

## 12. Conclusion & Future Enhancements

SKILLPATH AI fulfills the requirements of an academic capstone while delivering production-grade engineering reliability. 

### Future Enhancements:
- **College Placement Officer Portal:** Institutional dashboard for placement cells to identify batch-wide competency gaps.
- **Audio Voice Mock Interviews:** Real-time WebRTC audio recording and transcription for mock interviews.
- **Automated Code Sandbox:** In-browser code runner executing test cases for coding challenges.
