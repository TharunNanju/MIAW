/* ===== Reports Page ===== */
function renderReports() {
  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="tab-nav" id="report-tabs">
      <button class="tab-btn active" data-tab="mood">Mood Report</button>
      <button class="tab-btn" data-tab="wellness">Wellness Trend</button>
      <button class="tab-btn" data-tab="habit">Habit Report</button>
    </div>
    <div id="report-content"></div>
  `;
  document.querySelectorAll('#report-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#report-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderReportTab(btn.dataset.tab);
    });
  });
  renderReportTab('mood');
}

function renderReportTab(tab) {
  const content = document.getElementById('report-content');
  if (tab === 'mood') renderMoodReport(content);
  else if (tab === 'wellness') renderWellnessReport(content);
  else if (tab === 'habit') renderHabitReport(content);
}

function renderMoodReport(el) {
  el.innerHTML = `
    <div class="flex justify-between items-center mb-1">
      <div class="segmented-control" id="mood-range">
        <button class="segmented-btn active" data-range="7">Last 7 Days</button>
        <button class="segmented-btn" data-range="30">Last 30 Days</button>
        <button class="segmented-btn" data-range="90">Last 3 Months</button>
      </div>
    </div>
    <div class="card mb-1">
      <div class="card-header"><span class="card-title">Mood Over Time</span></div>
      <div class="bar-chart" id="report-mood-chart" style="height:180px"></div>
    </div>
    <div class="grid-3 mb-1" id="report-mood-stats"></div>
    <div class="card">
      <div class="card-header"><span class="card-title">Mood Distribution</span></div>
      <div id="report-mood-dist"></div>
    </div>
  `;
  document.querySelectorAll('#mood-range .segmented-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#mood-range .segmented-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadMoodReport(parseInt(btn.dataset.range));
    });
  });
  loadMoodReport(7);
}

async function loadMoodReport(days) {
  const period = days <= 7 ? 'weekly' : 'monthly';
  try {
    const data = await API.get(`/api/reports/moods?period=${period}`);
    const moodColors = {
      HAPPY: '#4CAF91', CALM: '#5B9BD5', STRESSED: '#F5A623',
      SAD: '#E05B5B', ANXIOUS: '#9B59B6', TIRED: '#718096'
    };
    const moodEmojis = { HAPPY: '😁', CALM: '😌', STRESSED: '😤', SAD: '😢', ANXIOUS: '😟', TIRED: '😴' };
    const counts = data.moodCounts || {};
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
    const maxVal = Math.max(...Object.values(counts), 1);

    // Bar chart
    const chart = document.getElementById('report-mood-chart');
    chart.innerHTML = `<div class="bar-chart" style="height:100%">${Object.entries(counts).map(([level, count]) =>
      `<div class="bar-col">
                <div class="bar-value">${count}</div>
                <div class="bar" style="height:${(count / maxVal) * 100}%;background:${moodColors[level] || 'var(--accent)'}"></div>
                <div class="bar-label">${moodEmojis[level] || level}</div>
            </div>`
    ).join('')}</div>`;

    // Summary stats
    const stats = document.getElementById('report-mood-stats');
    const mostFrequent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const moodValues = { HAPPY: 5, CALM: 4, STRESSED: 3, ANXIOUS: 2, SAD: 1, TIRED: 1 };
    let avgScore = 0, scoreCount = 0;
    Object.entries(counts).forEach(([level, count]) => { avgScore += (moodValues[level] || 3) * count; scoreCount += count; });
    avgScore = scoreCount > 0 ? (avgScore / scoreCount).toFixed(1) : '–';
    stats.innerHTML = `
            <div class="stat-card"><div class="stat-icon">${mostFrequent ? moodEmojis[mostFrequent[0]] : '😐'}</div><div class="stat-value">${mostFrequent ? mostFrequent[0] : '–'}</div><div class="stat-label">Most Frequent Mood</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">${avgScore}</div><div class="stat-label">Avg. Mood Score</div></div>
            <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-value">${total}</div><div class="stat-label">Total Entries</div></div>`;

    // Distribution
    const dist = document.getElementById('report-mood-dist');
    dist.innerHTML = Object.entries(counts).map(([level, count]) => {
      const pct = Math.round((count / total) * 100);
      return `<div class="flex items-center gap-sm" style="margin-bottom:0.5rem">
                <span style="width:24px;text-align:center;font-size:1.1rem">${moodEmojis[level]}</span>
                <span style="width:80px;font-size:0.85rem;font-weight:600">${level}</span>
                <div class="consistency-bar" style="flex:1"><div class="consistency-fill" style="width:${pct}%;background:${moodColors[level]}"></div></div>
                <span style="width:45px;text-align:right;font-size:0.85rem;font-weight:600">${pct}%</span>
            </div>`;
    }).join('');
  } catch (e) { showToast(e.message, 'error'); }
}

function renderWellnessReport(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header"><span class="card-title">Wellness Score Over Time</span></div>
      <div id="wellness-chart" style="margin-bottom:1rem"></div>
      <div class="table-container" id="wellness-table"></div>
    </div>`;
  loadWellnessReport();
}

async function loadWellnessReport() {
  try {
    const assessments = await API.get('/api/assessments');
    const table = document.getElementById('wellness-table');
    const chartDiv = document.getElementById('wellness-chart');

    if (assessments.length < 2) {
      chartDiv.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">Not enough data yet</div><div class="empty-sub">Take at least 2 assessments to see trends</div></div>';
      table.innerHTML = '';
      return;
    }

    const maxScore = 50;
    // Simple bar chart for wellness scores
    const reversed = [...assessments].reverse();
    chartDiv.innerHTML = `<div class="bar-chart" style="height:160px">${reversed.map(a => {
      const pct = Math.round((a.score / maxScore) * 100);
      let color = 'var(--primary)';
      if (pct <= 40) color = 'var(--danger)';
      else if (pct <= 70) color = 'var(--warning)';
      return `<div class="bar-col">
                <div class="bar-value">${pct}%</div>
                <div class="bar" style="height:${pct}%;background:${color}"></div>
                <div class="bar-label">${new Date(a.takenAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
            </div>`;
    }).join('')}</div>`;

    table.innerHTML = `<table><thead><tr><th>Date</th><th>Score</th><th>Category</th></tr></thead><tbody>` +
      assessments.map(a => {
        const pct = Math.round((a.score / maxScore) * 100);
        let cat = 'Needs Attention', color = 'var(--danger)';
        if (pct >= 80) { cat = 'Excellent'; color = 'var(--success)'; }
        else if (pct >= 60) { cat = 'Good'; color = 'var(--info)'; }
        else if (pct >= 40) { cat = 'Fair'; color = 'var(--warning)'; }
        return `<tr><td>${new Date(a.takenAt).toLocaleDateString()}</td><td>${a.score}/${maxScore} (${pct}%)</td><td style="color:${color};font-weight:600">${cat}</td></tr>`;
      }).join('') + '</tbody></table>';
  } catch (e) { showToast(e.message, 'error'); }
}

function renderHabitReport(el) {
  el.innerHTML = `
    <div class="flex justify-between items-center mb-1">
      <div class="segmented-control" id="habit-range">
        <button class="segmented-btn" data-range="7">Last 7 Days</button>
        <button class="segmented-btn active" data-range="30">Last 30 Days</button>
        <button class="segmented-btn" data-range="90">Last 90 Days</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Habit Completion</span></div>
      <div id="report-habit-table"></div>
    </div>`;
  document.querySelectorAll('#habit-range .segmented-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#habit-range .segmented-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadHabitReport(parseInt(btn.dataset.range));
    });
  });
  loadHabitReport(30);
}

async function loadHabitReport(days) {
  try {
    const data = await API.get(`/api/reports/habits?days=${days}`);
    const el = document.getElementById('report-habit-table');
    if (!data.length) {
      el.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-text">No habits to report</div></div>';
      return;
    }
    // Sort by completion rate
    data.sort((a, b) => (b.consistencyRate || 0) - (a.consistencyRate || 0));
    el.innerHTML = `<table><thead><tr><th>Habit</th><th>Completion</th><th>Best Streak</th><th>Current</th></tr></thead><tbody>` +
      data.map(h => {
        const pct = Math.round((h.consistencyRate || 0) * 100);
        return `<tr>
                    <td style="font-weight:600">${esc(h.habitName)}</td>
                    <td>
                        <div class="flex items-center gap-sm">
                            <div class="consistency-bar" style="flex:1;max-width:120px"><div class="consistency-fill" style="width:${pct}%"></div></div>
                            <span style="font-weight:600;font-size:0.85rem">${pct}%</span>
                        </div>
                    </td>
                    <td>🏆 ${h.longestStreak || 0}</td>
                    <td>🔥 ${h.currentStreak || 0}</td>
                </tr>`;
      }).join('') + '</tbody></table>';
  } catch (e) { showToast(e.message, 'error'); }
}

Router.register('#/reports', renderReports, 'Reports');
