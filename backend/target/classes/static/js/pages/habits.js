/* ===== Habits Page ===== */
const HABIT_CATEGORIES = {
  'Meditation': '🧘', 'Exercise': '🏃', 'Sleep': '😴',
  'Hydration': '💧', 'Breathing': '🌬️', 'Other': '📌'
};

function renderHabits() {
  const pc = document.getElementById('page-content');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('top-bar-actions').innerHTML = '<button class="btn btn-primary btn-sm" id="btn-new-habit">Add New Habit</button>';
  pc.innerHTML = `
    <div class="card mb-1">
      <div class="card-header"><span class="card-title">Today's Check-in — ${today}</span></div>
      <div id="habit-checkin-list"></div>
    </div>
    <div class="section">
      <div class="section-header">
        <span class="section-title">Your Habits</span>
      </div>
      <div id="habit-card-grid"></div>
    </div>
  `;
  document.getElementById('btn-new-habit').addEventListener('click', () => openHabitModal());
  loadHabits();
}

async function loadHabits() {
  try {
    const habits = await API.get('/api/habits');
    const checkinList = document.getElementById('habit-checkin-list');
    const cardGrid = document.getElementById('habit-card-grid');

    if (!habits.length) {
      checkinList.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-text">No habits yet</div><div class="empty-sub">Build positive daily habits</div><button class="btn btn-primary" onclick="openHabitModal()">Create First Habit</button></div>';
      cardGrid.innerHTML = '';
      return;
    }

    const consistencies = await Promise.all(habits.map(h => API.get(`/api/habits/${h.id}/consistency?days=30`).catch(() => ({}))));

    // Today's check-in
    const todayConsistencies = await Promise.all(habits.map(h => API.get(`/api/habits/${h.id}/consistency?days=1`).catch(() => ({}))));
    checkinList.innerHTML = habits.map((h, i) => {
      const done = todayConsistencies[i] && todayConsistencies[i].consistencyRate >= 1;
      const catIcon = HABIT_CATEGORIES[h.category] || HABIT_CATEGORIES[h.description] || '📌';
      const streak = consistencies[i] && consistencies[i].currentStreak || 0;
      return `<div class="habit-check-row ${done ? 'completed' : ''}">
                <div class="habit-checkbox ${done ? 'checked' : ''}" onclick="toggleHabitCheck(${h.id}, ${!done})">${done ? '✓' : ''}</div>
                <span class="habit-check-name">${esc(h.name)}</span>
                <span style="font-size:1rem">${catIcon}</span>
                <div class="streak" style="font-size:0.8rem">🔥 ${streak}</div>
            </div>`;
    }).join('');

    // Habit cards grid
    cardGrid.innerHTML = '<div class="grid-auto">' + habits.map((h, i) => {
      const c = consistencies[i] || {};
      const pct = Math.round((c.consistencyRate || 0) * 100);
      const catIcon = HABIT_CATEGORIES[h.category] || HABIT_CATEGORIES[h.description] || '📌';
      const catName = h.category || h.description || 'Other';
      // Mini weekly squares
      const filled = Math.min(7, Math.round((c.consistencyRate || 0) * 7));
      const weekSquares = Array.from({ length: 7 }, (_, j) =>
        `<div class="week-dot ${j < filled ? 'filled' : ''}"></div>`
      ).join('');

      return `<div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${esc(h.name)}</div>
                        <div style="margin-top:0.25rem"><span class="badge badge-category">${catIcon} ${catName}</span></div>
                    </div>
                    <div class="flex gap-sm">
                        <button class="btn btn-secondary btn-sm btn-icon" onclick="openHabitModal(${h.id}, '${esc(h.name).replace(/'/g, "\\'")}', '${esc(h.description || '').replace(/'/g, "\\'")}')" title="Edit" aria-label="Edit habit">✏️</button>
                        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteHabit(${h.id})" title="Delete" aria-label="Delete habit">🗑️</button>
                    </div>
                </div>
                <div style="margin-bottom:0.5rem">
                    <div class="streak" style="margin-bottom:0.15rem">🔥 Current Streak: ${c.currentStreak || 0} days</div>
                    <div style="font-size:0.8rem;color:var(--text-muted)">Best Streak: ${c.longestStreak || 0} days</div>
                </div>
                <div style="margin-bottom:0.5rem">
                    <div class="flex justify-between items-center" style="margin-bottom:0.35rem">
                        <span style="font-size:0.8rem;color:var(--text-secondary)">30-day consistency</span>
                        <span style="font-size:0.85rem;font-weight:700">${pct}%</span>
                    </div>
                    <div class="consistency-bar"><div class="consistency-fill" style="width:${pct}%"></div></div>
                </div>
                <div style="margin-top:0.5rem">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.25rem">This week</div>
                    <div class="week-dots">${weekSquares}</div>
                </div>
            </div>`;
    }).join('') + '</div>';
  } catch (e) { showToast(e.message, 'error'); }
}

async function toggleHabitCheck(habitId, completed) {
  try {
    await API.post(`/api/habits/${habitId}/logs`, { completed, logDate: new Date().toISOString().split('T')[0] });
    showToast(completed ? 'Marked as done!' : 'Unmarked', completed ? 'success' : 'info');
    loadHabits();
  } catch (e) { showToast(e.message, 'error'); }
}

function openHabitModal(id, name, description) {
  const isEdit = !!id;
  const categoryOptions = Object.keys(HABIT_CATEGORIES).map(cat =>
    `<option value="${cat}" ${description === cat ? 'selected' : ''}>${HABIT_CATEGORIES[cat]} ${cat}</option>`
  ).join('');
  openModal(isEdit ? 'Edit Habit' : 'New Habit', `
    <div class="form-group"><label>Habit Name</label><input id="modal-h-name" value="${name || ''}" placeholder="e.g. Morning meditation" /></div>
    <div class="form-group"><label>Category</label><select id="modal-h-category">${categoryOptions}</select></div>
    <button class="btn btn-primary btn-full" id="modal-h-submit">${isEdit ? 'Update' : 'Save Habit'}</button>
  `);
  document.getElementById('modal-h-submit').addEventListener('click', async () => {
    const payload = { name: document.getElementById('modal-h-name').value, description: document.getElementById('modal-h-category').value };
    if (!payload.name) { showToast('Name is required', 'error'); return; }
    try {
      if (isEdit) await API.put(`/api/habits/${id}`, payload);
      else await API.post('/api/habits', payload);
      closeModal(); showToast(isEdit ? 'Habit updated!' : 'Habit created!', 'success'); loadHabits();
    } catch (e) { showToast(e.message, 'error'); }
  });
}

async function deleteHabit(id) {
  openModal('Delete Habit', `
        <p style="margin-bottom:1rem;color:var(--text-secondary)">Are you sure you want to delete this habit and all its logs? This cannot be undone.</p>
        <div class="flex gap-sm" style="justify-content:flex-end">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-danger" id="confirm-delete-habit">Delete</button>
        </div>
    `);
  document.getElementById('confirm-delete-habit').addEventListener('click', async () => {
    try { await API.del(`/api/habits/${id}`); closeModal(); showToast('Habit deleted', 'success'); loadHabits(); }
    catch (e) { showToast(e.message, 'error'); }
  });
}

Router.register('#/habits', renderHabits, 'Habits');
