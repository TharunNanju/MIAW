/* ===== Moods Page ===== */
const MOOD_META = [
  { level: 'HAPPY', emoji: '😁', label: 'Happy', color: '#4CAF91' },
  { level: 'CALM', emoji: '😌', label: 'Calm', color: '#5B9BD5' },
  { level: 'STRESSED', emoji: '😤', label: 'Stressed', color: '#F5A623' },
  { level: 'SAD', emoji: '😢', label: 'Sad', color: '#9B59B6' },
  { level: 'ANXIOUS', emoji: '😟', label: 'Anxious', color: '#F5A623' },
  { level: 'TIRED', emoji: '😴', label: 'Tired', color: '#718096' },
];

function moodEmoji(level) { return (MOOD_META.find(m => m.level === level) || {}).emoji || '😐'; }
function moodColor(level) { return (MOOD_META.find(m => m.level === level) || {}).color || '#718096'; }

function renderMoods() {
  const pc = document.getElementById('page-content');
  document.getElementById('top-bar-actions').innerHTML = '<button class="btn btn-primary btn-sm" id="btn-new-mood">Log Today\'s Mood</button>';
  pc.innerHTML = `
    <div class="card mb-1">
      <div class="card-header">
        <span class="card-title">Mood Over Time</span>
        <span style="font-size:0.8rem;color:var(--text-muted)">Past 30 Days</span>
      </div>
      <div class="bar-chart" id="mood-chart" style="height:180px"></div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Mood History</span>
        <div class="flex gap-sm items-center">
          <input type="date" id="mood-start" style="max-width:150px" />
          <span style="color:var(--text-muted)">to</span>
          <input type="date" id="mood-end" style="max-width:150px" />
          <button class="btn btn-secondary btn-sm" id="mood-filter">Filter</button>
        </div>
      </div>
      <div id="mood-list"></div>
      <div id="mood-load-more" style="text-align:center;padding:1rem"></div>
    </div>
  `;

  const now = new Date();
  const monthAgo = new Date(now); monthAgo.setDate(now.getDate() - 30);
  document.getElementById('mood-start').value = monthAgo.toISOString().split('T')[0];
  document.getElementById('mood-end').value = now.toISOString().split('T')[0];

  document.getElementById('mood-filter').addEventListener('click', loadMoods);
  document.getElementById('btn-new-mood').addEventListener('click', () => openMoodModal());
  loadMoods();
}

let allMoodEntries = [];
let moodPageSize = 10;
let moodPageShown = 0;

async function loadMoods() {
  const start = document.getElementById('mood-start').value;
  const end = document.getElementById('mood-end').value;
  let url = '/api/moods';
  if (start && end) url += `?startDate=${start}&endDate=${end}`;
  try {
    allMoodEntries = await API.get(url);
    moodPageShown = 0;
    document.getElementById('mood-list').innerHTML = '';
    showMoreMoods();
    renderMoodChart(allMoodEntries);
  } catch (e) { showToast(e.message, 'error'); }
}

function showMoreMoods() {
  const list = document.getElementById('mood-list');
  const loadMoreDiv = document.getElementById('mood-load-more');
  const nextBatch = allMoodEntries.slice(moodPageShown, moodPageShown + moodPageSize);
  moodPageShown += nextBatch.length;

  if (allMoodEntries.length === 0 && moodPageShown === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">😶</div><div class="empty-text">No moods logged</div><div class="empty-sub">Start by logging how you feel today</div></div>';
    loadMoreDiv.innerHTML = '';
    return;
  }

  list.innerHTML += nextBatch.map(m => `
      <div class="list-item">
        <div class="mood-circle mood-circle-${m.moodLevel.toLowerCase()}">${moodEmoji(m.moodLevel)}</div>
        <div style="flex:1">
          <div class="flex items-center gap-sm">
            <span style="font-weight:600">${m.moodLevel.charAt(0) + m.moodLevel.slice(1).toLowerCase()}</span>
            <span style="font-size:0.8rem;color:var(--text-muted)">${m.entryDate}</span>
          </div>
          ${m.note ? `<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.25rem">${esc(m.note)}</div>` : ''}
        </div>
        <div class="flex gap-sm">
          <button class="btn btn-secondary btn-sm" onclick="openMoodModal(${m.id}, '${m.moodLevel}', '${esc(m.note || '').replace(/'/g, "\\'")}', '${m.entryDate}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMood(${m.id})" aria-label="Delete mood">🗑️</button>
        </div>
      </div>
    `).join('');

  if (moodPageShown < allMoodEntries.length) {
    loadMoreDiv.innerHTML = '<button class="btn btn-secondary" onclick="showMoreMoods()">Load More</button>';
  } else {
    loadMoreDiv.innerHTML = '';
  }
}

function renderMoodChart(moods) {
  const chart = document.getElementById('mood-chart');
  if (!chart) return;
  const now = new Date();
  const moodMap = { HAPPY: 5, CALM: 4, STRESSED: 3, ANXIOUS: 2, SAD: 1, TIRED: 1 };
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  chart.innerHTML = days.map(day => {
    const entry = moods.find(m => m.entryDate === day);
    const val = entry ? (moodMap[entry.moodLevel] || 1) : 0;
    const d = new Date(day + 'T00:00:00');
    const label = dayLabels[d.getDay()];
    const pct = val > 0 ? (val / 5) * 100 : 0;
    const color = entry ? moodColor(entry.moodLevel) : 'var(--border)';
    return `<div class="bar-col">
          <div class="bar-value">${entry ? moodEmoji(entry.moodLevel) : '–'}</div>
          <div class="bar" style="height:${pct || 5}%;background:${color}"></div>
          <div class="bar-label">${d.getDate()}/${d.getMonth() + 1}</div>
        </div>`;
  }).join('');
}

function openMoodModal(id, level, note, date) {
  const isEdit = !!id;
  const moodOptions = MOOD_META.map(m =>
    `<button type="button" class="mood-option ${level === m.level ? 'selected' : ''}" data-level="${m.level}"><span class="mood-emoji">${m.emoji}</span>${m.label}</button>`
  ).join('');
  openModal(isEdit ? 'Update Today\'s Mood' : 'Log Mood', `
    <div class="mood-selector" id="modal-mood-sel">${moodOptions}</div>
    <div class="form-group mt-1">
      <label>How are you feeling?</label>
      <textarea id="modal-mood-note" rows="3" placeholder="Optional notes (max 200 chars)" maxlength="200">${note || ''}</textarea>
      <div style="text-align:right;font-size:0.75rem;color:var(--text-muted)" id="modal-mood-chars">0/200</div>
    </div>
    <button class="btn btn-primary btn-full" id="modal-mood-submit">${isEdit ? 'Update' : 'Save Mood'}</button>
  `);
  const noteEl = document.getElementById('modal-mood-note');
  const charCounter = document.getElementById('modal-mood-chars');
  charCounter.textContent = `${(note || '').length}/200`;
  noteEl.addEventListener('input', () => { charCounter.textContent = `${noteEl.value.length}/200`; });

  let sel = level || null;
  document.querySelectorAll('#modal-mood-sel .mood-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#modal-mood-sel .mood-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      sel = btn.dataset.level;
    });
  });
  document.getElementById('modal-mood-submit').addEventListener('click', async () => {
    if (!sel) { showToast('Select a mood', 'error'); return; }
    const payload = { moodLevel: sel, note: noteEl.value, entryDate: date || new Date().toISOString().split('T')[0] };
    try {
      if (isEdit) await API.put(`/api/moods/${id}`, payload);
      else await API.post('/api/moods', payload);
      closeModal(); showToast(isEdit ? 'Mood updated!' : 'Mood logged!', 'success'); loadMoods();
    } catch (e) { showToast(e.message, 'error'); }
  });
}

async function deleteMood(id) {
  openModal('Delete Mood Entry', `
        <p style="margin-bottom:1rem;color:var(--text-secondary)">Are you sure you want to delete this mood entry? This cannot be undone.</p>
        <div class="flex gap-sm" style="justify-content:flex-end">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-danger" id="confirm-delete-mood">Delete</button>
        </div>
    `);
  document.getElementById('confirm-delete-mood').addEventListener('click', async () => {
    try { await API.del(`/api/moods/${id}`); closeModal(); showToast('Mood deleted', 'success'); loadMoods(); }
    catch (e) { showToast(e.message, 'error'); }
  });
}

Router.register('#/moods', renderMoods, 'Mood');
