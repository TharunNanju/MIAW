/* ===== Assessments Page ===== */
const ASSESSMENT_QUESTIONS = [
    'How would you rate your overall mood today?',
    'How well did you sleep last night?',
    'How would you rate your energy level?',
    'How stressed do you feel?',
    'How connected do you feel to others?',
    'How motivated are you to accomplish your goals?',
    'How would you rate your physical health today?',
    'How calm and peaceful do you feel?',
    'How hopeful do you feel about the future?',
    'How well are you taking care of yourself?',
];
const SCORE_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

function renderAssessments() {
    const pc = document.getElementById('page-content');
    pc.innerHTML = `
    <div style="max-width:680px;margin:0 auto">
      <div class="card" id="assess-landing">
        <div style="text-align:center;padding:1rem 0">
          <h2 style="margin-bottom:0.5rem">Wellness Self-Assessment</h2>
          <p style="color:var(--text-secondary);margin-bottom:1.5rem">Answer a few questions to get your wellness score.</p>
          <div id="assess-last-score"></div>
          <button class="btn btn-primary" id="btn-start-assess" style="margin-top:1rem">Start Assessment</button>
        </div>
      </div>
      <div class="card mt-1">
        <div class="card-header"><span class="card-title">Assessment History</span></div>
        <div id="assess-list"></div>
      </div>
    </div>
  `;
    document.getElementById('btn-start-assess').addEventListener('click', startAssessment);
    loadAssessments();
}

async function loadAssessments() {
    try {
        const list = await API.get('/api/assessments');
        const el = document.getElementById('assess-list');
        const lastScore = document.getElementById('assess-last-score');

        if (list.length > 0 && lastScore) {
            const latest = list[0];
            const maxScore = ASSESSMENT_QUESTIONS.length * 5;
            const pct = Math.round((latest.score / maxScore) * 100);
            let color = 'var(--primary)';
            if (pct <= 40) color = 'var(--danger)';
            else if (pct <= 70) color = 'var(--warning)';
            const circumference = 2 * Math.PI * 52;
            const dashLen = (pct / 100) * circumference;
            lastScore.innerHTML = `
                <div class="score-ring" style="position:relative">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" stroke="var(--border)" stroke-width="10" fill="none"/>
                        <circle cx="60" cy="60" r="52" stroke="${color}" stroke-width="10" fill="none"
                            stroke-linecap="round" stroke-dasharray="${dashLen} ${circumference}" style="transform:rotate(-90deg);transform-origin:center"/>
                    </svg>
                    <div style="position:absolute;text-align:center;top:50%;left:50%;transform:translate(-50%,-50%)">
                        <div class="score-value">${pct}</div>
                        <div class="score-label">out of 100</div>
                    </div>
                </div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Last assessed ${new Date(latest.takenAt).toLocaleDateString()}</div>`;
        }

        if (!list.length) {
            el.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">No assessments yet</div><div class="empty-sub">Take a wellness self-assessment to track your progress</div></div>';
            return;
        }
        el.innerHTML = `<table><thead><tr><th>Date</th><th>Score</th><th>Rating</th></tr></thead><tbody>` +
            list.map(a => {
                const maxScore = ASSESSMENT_QUESTIONS.length * 5;
                const pct = Math.round((a.score / maxScore) * 100);
                let rating = 'Needs Attention', color = 'var(--danger)';
                if (pct >= 80) { rating = 'Excellent'; color = 'var(--success)'; }
                else if (pct >= 60) { rating = 'Good'; color = 'var(--info)'; }
                else if (pct >= 40) { rating = 'Fair'; color = 'var(--warning)'; }
                return `<tr><td>${new Date(a.takenAt).toLocaleDateString()}</td><td>${a.score} / ${maxScore}</td><td style="color:${color};font-weight:600">${rating}</td></tr>`;
            }).join('') + '</tbody></table>';
    } catch (e) { showToast(e.message, 'error'); }
}

function startAssessment() {
    const pc = document.getElementById('page-content');
    const answers = new Array(ASSESSMENT_QUESTIONS.length).fill(0);
    let currentQ = 0;

    function renderQuestion() {
        const progress = ((currentQ + 1) / ASSESSMENT_QUESTIONS.length) * 100;
        pc.innerHTML = `
        <div style="max-width:680px;margin:0 auto">
            <div style="margin-bottom:1rem">
                <div class="flex justify-between items-center" style="margin-bottom:0.35rem">
                    <span style="font-size:0.85rem;font-weight:600">Question ${currentQ + 1} of ${ASSESSMENT_QUESTIONS.length}</span>
                    <span style="font-size:0.85rem;color:var(--text-muted)">${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
            </div>
            <div class="card">
                <div style="font-size:1.1rem;font-weight:600;margin-bottom:1.5rem">${ASSESSMENT_QUESTIONS[currentQ]}</div>
                <div id="assess-options" style="display:flex;flex-direction:column;gap:0.5rem"></div>
                <div class="flex justify-between mt-1">
                    <button class="btn btn-ghost" id="assess-back" ${currentQ === 0 ? 'disabled' : ''}>← Back</button>
                    <button class="btn btn-primary" id="assess-next" ${answers[currentQ] === 0 ? 'disabled' : ''}>${currentQ === ASSESSMENT_QUESTIONS.length - 1 ? 'Submit' : 'Next →'}</button>
                </div>
            </div>
        </div>`;

        const optContainer = document.getElementById('assess-options');
        SCORE_LABELS.forEach((label, idx) => {
            const v = idx + 1;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `question-opt ${answers[currentQ] === v ? 'selected' : ''}`;
            btn.style.cssText = 'width:100%;text-align:left;padding:0.75rem 1rem';
            btn.textContent = `${v} — ${label}`;
            btn.addEventListener('click', () => {
                optContainer.querySelectorAll('.question-opt').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers[currentQ] = v;
                document.getElementById('assess-next').disabled = false;
            });
            optContainer.appendChild(btn);
        });

        document.getElementById('assess-back').addEventListener('click', () => { if (currentQ > 0) { currentQ--; renderQuestion(); } });
        document.getElementById('assess-next').addEventListener('click', async () => {
            if (answers[currentQ] === 0) return;
            if (currentQ < ASSESSMENT_QUESTIONS.length - 1) { currentQ++; renderQuestion(); }
            else { await submitAssessment(answers); }
        });
    }

    renderQuestion();
}

async function submitAssessment(answers) {
    try {
        const result = await API.post('/api/assessments', { answers });
        const maxScore = ASSESSMENT_QUESTIONS.length * 5;
        const pct = Math.round((result.score / maxScore) * 100);
        let color = 'var(--primary)', label = 'Excellent';
        if (pct <= 40) { color = 'var(--danger)'; label = 'Needs Attention'; }
        else if (pct <= 70) { color = 'var(--warning)'; label = 'Good'; }
        const circumference = 2 * Math.PI * 52;
        const dashLen = (pct / 100) * circumference;

        const pc = document.getElementById('page-content');
        pc.innerHTML = `
        <div style="max-width:680px;margin:0 auto">
            <div class="card" style="text-align:center;padding:2rem">
                <h2 style="margin-bottom:1.5rem">Assessment Complete!</h2>
                <div class="score-ring" style="position:relative">
                    <svg width="140" height="140" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" stroke="var(--border)" stroke-width="10" fill="none"/>
                        <circle id="result-arc" cx="60" cy="60" r="52" stroke="${color}" stroke-width="10" fill="none"
                            stroke-linecap="round" stroke-dasharray="0 ${circumference}" style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dasharray 1.5s ease"/>
                    </svg>
                    <div style="position:absolute;text-align:center;top:50%;left:50%;transform:translate(-50%,-50%)">
                        <div class="score-value" style="font-size:2.5rem">${pct}</div>
                        <div class="score-label">out of 100</div>
                    </div>
                </div>
                <div style="margin-top:1rem;font-size:1.1rem;font-weight:700;color:${color}">${pct} / 100 — ${label}</div>
                <div class="flex gap-sm" style="justify-content:center;margin-top:1.5rem">
                    <button class="btn btn-outline" onclick="renderAssessments()">View Score History</button>
                    <button class="btn btn-ghost" onclick="startAssessment()">Retake Assessment</button>
                </div>
            </div>
        </div>`;
        // Animate the score arc
        setTimeout(() => {
            document.getElementById('result-arc').setAttribute('stroke-dasharray', `${dashLen} ${circumference}`);
        }, 100);
    } catch (e) { showToast(e.message, 'error'); }
}

Router.register('#/assessments', renderAssessments, 'Assessment');
