// Automated E2E API Verification Script for SKILLPATH AI
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING AUTOMATED E2E VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(health.status === 'ok', 'Server Health Check');

    // 2. Student Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@college.edu', password: 'Student@2026!' }),
    }).then(r => r.json());
    assert(loginRes.success === true && !!loginRes.token, 'Student Authentication');
    const token = loginRes.token;
    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    // 3. User Profile
    const meRes = await fetch(`${BASE_URL}/users/me`, { headers: authHeaders }).then(r => r.json());
    assert(meRes.success === true && meRes.user.email === 'student@college.edu', 'Get Student Profile');

    // 4. Careers List & Detail
    const careersRes = await fetch(`${BASE_URL}/careers`).then(r => r.json());
    assert(careersRes.success === true && careersRes.careers.length >= 10, `Loaded ${careersRes.careers?.length} Careers`);
    const fullstack = careersRes.careers.find(c => c.slug === 'full-stack-developer') || careersRes.careers[0];

    // 5. Select Career Goal
    const selectCareer = await fetch(`${BASE_URL}/careers/select`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ careerId: fullstack._id }),
    }).then(r => r.json());
    assert(selectCareer.success === true, 'Select Career Goal');

    // 6. Diagnostic Assessment Retrieval
    const assessmentRes = await fetch(`${BASE_URL}/assessments/career/${fullstack._id}`, { headers: authHeaders }).then(r => r.json());
    assert(assessmentRes.success === true && assessmentRes.assessment.questions.length > 0, `Loaded Assessment with ${assessmentRes.assessment?.questions?.length} questions`);

    // Verify correct answers are hidden before submission
    const hasLeakedAnswer = assessmentRes.assessment.questions.some(q => q.correctAnswer !== undefined);
    assert(!hasLeakedAnswer, 'Security Check: Correct answers hidden on frontend');

    // 7. Submit Assessment
    const firstQ = assessmentRes.assessment.questions[0];
    const answers = { [firstQ._id]: firstQ.options[0] };
    const submitRes = await fetch(`${BASE_URL}/assessments/${assessmentRes.assessment._id}/submit`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ answers }),
    }).then(r => r.json());
    assert(submitRes.success === true && submitRes.result.overallScore !== undefined, `Assessment Submitted (Score: ${submitRes.result?.overallScore}%)`);

    // 8. Skill Gap Analysis
    const skillGapRes = await fetch(`${BASE_URL}/skill-gap`, { headers: authHeaders }).then(r => r.json());
    assert(skillGapRes.success === true && skillGapRes.gaps.length > 0, `Skill Gap Analysis Computed (${skillGapRes.gaps?.length} skills mapped)`);

    // 9. AI Roadmap Generation & Progression
    const roadmapRes = await fetch(`${BASE_URL}/roadmap`, { headers: authHeaders }).then(r => r.json());
    assert(roadmapRes.success === true && roadmapRes.roadmap.phases.length >= 5, `5-Phase Roadmap Verified (Phases: ${roadmapRes.roadmap?.phases?.length})`);
    
    // Toggle a topic
    const topicId = roadmapRes.roadmap.phases[0].topics[0].id;
    const toggleTopic = await fetch(`${BASE_URL}/roadmap/topic/${topicId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ completed: true }),
    }).then(r => r.json());
    assert(toggleTopic.success === true, 'Roadmap Topic Progress Updated');

    // 10. Quizzes & Interactive Submission
    const quizList = await fetch(`${BASE_URL}/quizzes`).then(r => r.json());
    assert(quizList.success === true && quizList.quizzes.length > 0, `Loaded Quizzes (${quizList.quizzes?.length})`);
    const quizId = quizList.quizzes[0]._id;
    const quizSubmit = await fetch(`${BASE_URL}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ answers: [0, 1, 0] }),
    }).then(r => r.json());
    assert(quizSubmit.success === true && quizSubmit.result.score !== undefined, `Quiz Completed (Score: ${quizSubmit.result?.score}%)`);

    // 11. Projects & Submission
    const projList = await fetch(`${BASE_URL}/projects`, { headers: authHeaders }).then(r => r.json());
    assert(projList.success === true && projList.projects.length > 0, `Loaded Practical Projects (${projList.projects?.length})`);
    const projId = projList.projects[0]._id;
    const projSubmit = await fetch(`${BASE_URL}/projects/${projId}/submit`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        githubUrl: 'https://github.com/student/fullstack-portfolio-task-manager',
        demoUrl: 'https://task-manager-demo.vercel.app',
        description: 'MERN stack task management capstone with drag-and-drop',
      }),
    }).then(r => r.json());
    assert(projSubmit.success === true && projSubmit.submission.status === 'Submitted', 'Applied Project Submitted & Validated');

    // 12. Mock Interview Evaluation
    const interviewQuestions = await fetch(`${BASE_URL}/interview/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ trackType: 'Technical', careerId: fullstack._id }),
    }).then(r => r.json());
    assert(interviewQuestions.success === true && interviewQuestions.questions.length > 0, 'Interview Questions Generated');

    const interviewFeedback = await fetch(`${BASE_URL}/interview/feedback`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        question: 'Explain how asynchronous operations work in JavaScript.',
        answer: 'JavaScript handles asynchronous code via the single-threaded event loop and libuv thread pool. Promises and async/await allow non-blocking I/O execution.',
        trackType: 'Technical',
        careerId: fullstack._id,
      }),
    }).then(r => r.json());
    assert(interviewFeedback.success === true && !!interviewFeedback.feedback.overallScore, `AI Mock Interview Evaluated (Score: ${interviewFeedback.feedback?.overallScore})`);

    // 13. Career Readiness Index
    const readinessRes = await fetch(`${BASE_URL}/readiness`, { headers: authHeaders }).then(r => r.json());
    assert(readinessRes.success === true && readinessRes.overallReadiness !== undefined, `Deterministic Career Readiness Computed: ${readinessRes.overallReadiness}% (${readinessRes.stage})`);

    // 14. Admin Authentication & Dashboard
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@skillpath.ai', password: 'Admin@SkillPath2026!' }),
    }).then(r => r.json());
    assert(adminLogin.success === true && adminLogin.user.role === 'admin', 'Admin Authentication');
    const adminHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminLogin.token}` };

    const adminStats = await fetch(`${BASE_URL}/admin/stats`, { headers: adminHeaders }).then(r => r.json());
    assert(adminStats.success === true && adminStats.stats.totalStudents >= 1, `Admin Telemetry Verified (${adminStats.stats?.totalStudents} students, ${adminStats.stats?.totalCareers} careers)`);

    console.log(`\n=== VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal Test Exception:', error);
    process.exit(1);
  }
}

runTests();
