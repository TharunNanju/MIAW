/* ===== Dashboard Page ===== */
function renderDashboard() {
  const pc = document.getElementById('page-content');
  const user = API.getUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  pc.innerHTML = `
    <div class="greeting">
      <div class="greeting-text">${greeting}, ${esc(user.name || 'there')}! 👋</div>
      <div class="greeting-date">${today}</div>
    </div>
    <div class="grid-60-40">
      <div class="flex-col gap-md" style="display:flex;flex-direction:column;gap:1rem;">
        <!-- Today's Mood Card -->
        <div class="card" id="dash-mood-card">
          <div class="card-header"><span class="card-title">Today's Mood</span></div>
          <div id="dash-mood-content">
            <div class="mood-selector" id="dash-mood-sel"></div>
            <div class="form-group mt-1" id="dash-mood-note-wrap" style="display:none">
              <textarea id="dash-mood-note" placeholder="How are you feeling? (optional)" rows="2"></textarea>
            </div>
            <button class="btn btn-primary btn-full mt-1" id="dash-mood-save" style="display:none">Save Mood</button>
          </div>
        </div>
        <!-- Habit Summary Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Today's Habits</span>
            <a href="#/habits" style="font-size:0.8rem;color:var(--primary);text-decoration:none;font-weight:600">View All Habits →</a>
          </div>
          <div id="dash-habit-progress" style="margin-bottom:0.75rem"></div>
          <div id="dash-habit-list"></div>
        </div>
        <!-- Recent Journal Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Latest Journal Entry</span>
            <a href="#/journals" style="font-size:0.8rem;color:var(--primary);text-decoration:none;font-weight:600">View All Entries →</a>
          </div>
          <div id="dash-journal-preview"><div class="empty-state"><div class="empty-icon">📓</div><div class="empty-text">No entries yet</div></div></div>
        </div>
      </div>
      <div class="flex-col gap-md" style="display:flex;flex-direction:column;gap:1rem;">
        <!-- Wellness Score Card -->
        <div class="card">
          <div class="card-header"><span class="card-title">Wellness Score</span></div>
          <div id="dash-wellness-score">
            <div class="score-ring" id="dash-score-ring">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="var(--border)" stroke-width="10" fill="none"/>
                <circle id="dash-score-arc" cx="60" cy="60" r="52" stroke="var(--primary)" stroke-width="10" fill="none"
                  stroke-linecap="round" stroke-dasharray="0 327" />
              </svg>
              <div style="position:absolute;text-align:center">
                <div class="score-value" id="dash-score-value">–</div>
                <div class="score-label">out of 100</div>
              </div>
            </div>
            <div style="text-align:center;margin-top:0.5rem">
              <div style="font-size:0.8rem;color:var(--text-muted)" id="dash-score-date"></div>
              <a href="#/assessments" class="btn btn-outline btn-sm" style="margin-top:0.5rem">Take New Assessment →</a>
            </div>
          </div>
        </div>
        <!-- Streak Card -->
        <div class="card">
          <div class="card-header"><span class="card-title">Current Streak 🔥</span></div>
          <div id="dash-streak-content" style="text-align:center">
            <div style="font-size:2.5rem;font-weight:800;color:var(--warning)" id="dash-streak-num">0</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">days in a row</div>
            <div class="week-dots" id="dash-week-dots" style="justify-content:center;margin-top:0.75rem"></div>
          </div>
        </div>
        <!-- Reminders Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Reminders</span>
            <a href="#/settings" style="font-size:0.8rem;color:var(--primary);text-decoration:none;font-weight:600">Manage →</a>
          </div>
          <div id="dash-reminders"><div style="font-size:0.85rem;color:var(--text-muted);padding:0.5rem 0">No active reminders</div></div>
        </div>
      </div>
    </div>
  `;

  const moods = [
    { level: 'HAPPY', emoji: '😁', label: 'Happy' },
    { level: 'CALM', emoji: '😌', label: 'Calm' },
    { level: 'ANXIOUS', emoji: '😟', label: 'Anxious' },
    { level: 'SAD', emoji: '😢', label: 'Sad' },
    { level: 'STRESSED', emoji: '😤', label: 'Angry' },
  ];
  const selContainer = document.getElementById('dash-mood-sel');
  let selectedMood = null;
  moods.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'mood-option';
    btn.innerHTML = `<span class="mood-emoji">${m.emoji}</span>${m.label}`;
    btn.addEventListener('click', () => {
      selContainer.querySelectorAll('.mood-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMood = m.level;
      document.getElementById('dash-mood-note-wrap').style.display = 'block';
      document.getElementById('dash-mood-save').style.display = 'block';
    });
    selContainer.appendChild(btn);
  });

  document.getElementById('dash-mood-save').addEventListener('click', async () => {
    if (!selectedMood) { showToast('Please select a mood', 'error'); return; }
    try {
      await API.post('/api/moods', { moodLevel: selectedMood, note: document.getElementById('dash-mood-note').value });
      showToast('Mood logged!', 'success');
      selectedMood = null;
      selContainer.querySelectorAll('.mood-option').forEach(b => b.classList.remove('selected'));
      document.getElementById('dash-mood-note').value = '';
      document.getElementById('dash-mood-note-wrap').style.display = 'none';
      document.getElementById('dash-mood-save').style.display = 'none';
      loadDashData();
    } catch (e) { showToast(e.message, 'error'); }
  });

  // Fix score ring positioning
  const ringContainer = document.getElementById('dash-score-ring');
  if (ringContainer) ringContainer.style.position = 'relative';

  loadDashData();
}

async function loadDashData() {
  try {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 6);
    const fmt = d => d.toISOString().split('T')[0];

    const [moodData, journals, habits, assessments] = await Promise.all([
      API.get(`/api/moods?startDate=${fmt(weekAgo)}&endDate=${fmt(now)}`),
      API.get('/api/journals'),
      API.get('/api/habits'),
      API.get('/api/assessments'),
    ]);

    // Check if mood already logged today
    const todayStr = fmt(now);
    const todayMood = moodData.find(m => m.entryDate === todayStr);
    if (todayMood) {
      const moodMeta = { HAPPY: '😁', CALM: '😌', ANXIOUS: '😟', SAD: '😢', STRESSED: '😤' };
      const moodContent = document.getElementById('dash-mood-content');
      moodContent.innerHTML = `
                <div style="text-align:center;padding:1rem 0">
                    <div style="font-size:3rem">${moodMeta[todayMood.moodLevel] || '😊'}</div>
                    <div style="font-weight:600;margin-top:0.5rem">${todayMood.moodLevel}</div>
                    ${todayMood.note ? `<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.25rem">${esc(todayMood.note)}</div>` : ''}
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem">${todayMood.entryDate}</div>
                    <button class="btn btn-secondary btn-sm" style="margin-top:0.75rem" onclick="Router.navigate('#/moods')">✏️ Edit</button>
                </div>`;
    }

    // Habit summary with check-in list
    const habitList = document.getElementById('dash-habit-list');
    const habitProgress = document.getElementById('dash-habit-progress');
    if (habits.length > 0) {
      let completedCount = 0;
      const logPromises = habits.slice(0, 5).map(h => API.get(`/api/habits/${h.id}/consistency?days=1`).catch(() => null));
      const logStatuses = await Promise.all(logPromises);
      logStatuses.forEach(l => { if (l && l.consistencyRate >= 1) completedCount++; });
      const total = Math.min(habits.length, 5);
      const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      habitProgress.innerHTML = `
                <div class="flex justify-between items-center" style="margin-bottom:0.35rem">
                    <span style="font-size:0.85rem;font-weight:600">${completedCount} of ${total} completed today</span>
                    <span style="font-size:0.85rem;font-weight:700;color:var(--primary)">${pct}%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>`;
      habitList.innerHTML = habits.slice(0, 5).map((h, i) => {
        const done = logStatuses[i] && logStatuses[i].consistencyRate >= 1;
        return `<div class="habit-check-row ${done ? 'completed' : ''}">
                    <div class="habit-checkbox ${done ? 'checked' : ''}" onclick="dashToggleHabit(${h.id}, ${!done})">${done ? '✓' : ''}</div>
                    <span class="habit-check-name">${esc(h.name)}</span>
                </div>`;
      }).join('');
    } else {
      habitList.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-text">No habits yet</div></div>';
    }

    // Wellness score
    if (assessments.length > 0) {
      const latest = assessments[0];
      const maxScore = 50; // 10 questions * 5
      const pct = Math.round((latest.score / maxScore) * 100);
      const circumference = 2 * Math.PI * 52;
      const dashLen = (pct / 100) * circumference;
      const arc = document.getElementById('dash-score-arc');
      const valEl = document.getElementById('dash-score-value');
      const dateEl = document.getElementById('dash-score-date');
      if (arc && valEl) {
        let color = 'var(--primary)';
        if (pct <= 40) color = 'var(--danger)';
        else if (pct <= 70) color = 'var(--warning)';
        arc.setAttribute('stroke', color);
        setTimeout(() => { arc.setAttribute('stroke-dasharray', `${dashLen} ${circumference}`); }, 100);
        valEl.textContent = pct;
      }
      if (dateEl) dateEl.textContent = `Last assessed ${new Date(latest.takenAt).toLocaleDateString()}`;
    }

    // Streak
    if (habits.length > 0) {
      const consistencies = await Promise.all(habits.slice(0, 3).map(h => API.get(`/api/habits/${h.id}/consistency?days=7`).catch(() => ({}))));
      const maxStreak = Math.max(0, ...consistencies.map(c => c.currentStreak || 0));
      document.getElementById('dash-streak-num').textContent = maxStreak;
      // Mini week dots
      const dotsContainer = document.getElementById('dash-week-dots');
      if (dotsContainer && consistencies.length > 0) {
        const days = [];
        for (let i = 6; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate() - i); days.push(d); }
        dotsContainer.innerHTML = days.map(() => `<div class="week-dot"></div>`).join('');
        // Fill dots based on best consistency
        const bestC = consistencies.reduce((a, b) => ((a.consistencyRate || 0) > (b.consistencyRate || 0) ? a : b), {});
        const filled = Math.round((bestC.consistencyRate || 0) * 7);
        dotsContainer.querySelectorAll('.week-dot').forEach((dot, i) => { if (i < filled) dot.classList.add('filled'); });
      }
    }

    // Recent journal
    const jDiv = document.getElementById('dash-journal-preview');
    if (jDiv && journals.length > 0) {
      const j = journals[0];
      jDiv.innerHTML = `
                <div style="cursor:pointer" onclick="Router.navigate('#/journals')">
                    <div style="font-weight:700;font-size:1rem">${esc(j.title)}</div>
                    <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.25rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(j.content)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.35rem">${j.entryDate}</div>
                </div>`;
    }

    // Reminders
    try {
      const settings = await API.get('/api/notifications/settings');
      const remDiv = document.getElementById('dash-reminders');
      const items = [];
      if (settings.moodReminderEnabled && settings.moodReminderTime) {
        items.push(`<div class="list-item"><span>😊</span><div style="flex:1"><div style="font-weight:500">Mood Log Reminder</div><div style="font-size:0.8rem;color:var(--text-muted)">${settings.moodReminderTime.substring(0, 5)}</div></div></div>`);
      }
      if (settings.habitReminderEnabled && settings.habitReminderTime) {
        items.push(`<div class="list-item"><span>✅</span><div style="flex:1"><div style="font-weight:500">Habit Check-in</div><div style="font-size:0.8rem;color:var(--text-muted)">${settings.habitReminderTime.substring(0, 5)}</div></div></div>`);
      }
      if (items.length > 0) remDiv.innerHTML = items.join('');
    } catch (_) { }
  } catch (e) { console.error('Dashboard load error:', e); }
}

async function dashToggleHabit(habitId, completed) {
  try {
    await API.post(`/api/habits/${habitId}/logs`, { completed, logDate: new Date().toISOString().split('T')[0] });
    showToast(completed ? 'Marked as done!' : 'Unmarked', completed ? 'success' : 'info');
    loadDashData();
  } catch (e) { showToast(e.message, 'error'); }
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

Router.register('#/dashboard', renderDashboard, 'Dashboard');
