/* ===== Settings Page ===== */
function renderSettings() {
  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="grid-2">
      <div>
        <!-- Profile Section -->
        <div class="card mb-1">
          <div class="card-header"><span class="card-title">Account Settings</span></div>
          <div class="flex items-center gap-md" style="padding:0.5rem 0;margin-bottom:1rem">
            <div class="user-avatar" style="width:56px;height:56px;font-size:1.25rem" id="settings-avatar">?</div>
            <div>
              <div style="font-weight:700;font-size:1.1rem" id="settings-name">–</div>
              <div style="color:var(--text-secondary);font-size:0.9rem" id="settings-email">–</div>
              <div style="margin-top:0.25rem"><span class="badge badge-active" id="settings-role">–</span></div>
            </div>
          </div>
          <div class="form-group">
            <label>Display Name</label>
            <input id="settings-display-name" placeholder="Your name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input id="settings-email-input" placeholder="you@example.com" disabled style="opacity:0.6;cursor:not-allowed" />
          </div>
          <button class="btn btn-primary" id="settings-save-profile">Save Changes</button>
        </div>
        <!-- Change Password -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Change Password</span>
            <button class="btn btn-ghost btn-sm" id="toggle-password">Expand</button>
          </div>
          <div id="password-section" style="display:none">
            <div class="form-group"><label>Current Password</label><input type="password" id="set-current-pw" placeholder="Enter current password" /></div>
            <div class="form-group"><label>New Password</label><input type="password" id="set-new-pw" placeholder="Min 8 characters" minlength="8" /></div>
            <div class="form-group"><label>Confirm New Password</label><input type="password" id="set-confirm-pw" placeholder="Re-enter new password" /></div>
            <button class="btn btn-primary" id="settings-update-pw">Update Password</button>
          </div>
        </div>
      </div>
      <div>
        <!-- Notification Settings -->
        <div class="card">
          <div class="card-header"><span class="card-title">Reminder Settings</span></div>
          <div id="settings-form">
            <div class="toggle-row">
              <div><div class="toggle-label">Enable Daily Mood Reminder</div><div class="toggle-desc">Get reminded to log your daily mood</div></div>
              <label class="toggle"><input type="checkbox" id="set-mood-on" /><span class="toggle-slider"></span></label>
            </div>
            <div class="form-group mt-1" id="mood-time-group">
              <label>Remind me at</label>
              <input type="time" id="set-mood-time" />
            </div>
            <div class="toggle-row">
              <div><div class="toggle-label">Enable Habit Check-in Reminder</div><div class="toggle-desc">Get reminded about your daily habits</div></div>
              <label class="toggle"><input type="checkbox" id="set-habit-on" /><span class="toggle-slider"></span></label>
            </div>
            <div class="form-group mt-1" id="habit-time-group">
              <label>Remind me at</label>
              <input type="time" id="set-habit-time" />
            </div>
            <button class="btn btn-primary mt-1" id="settings-save">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  `;
  loadSettings();
  document.getElementById('settings-save').addEventListener('click', saveSettings);
  document.getElementById('toggle-password').addEventListener('click', () => {
    const section = document.getElementById('password-section');
    const btn = document.getElementById('toggle-password');
    if (section.style.display === 'none') { section.style.display = 'block'; btn.textContent = 'Collapse'; }
    else { section.style.display = 'none'; btn.textContent = 'Expand'; }
  });
  document.getElementById('settings-update-pw').addEventListener('click', updatePassword);
  document.getElementById('settings-save-profile').addEventListener('click', () => {
    showToast('Profile update not available in demo', 'info');
  });

  // Show/hide time pickers based on toggle
  document.getElementById('set-mood-on').addEventListener('change', (e) => {
    document.getElementById('mood-time-group').style.display = e.target.checked ? 'block' : 'none';
  });
  document.getElementById('set-habit-on').addEventListener('change', (e) => {
    document.getElementById('habit-time-group').style.display = e.target.checked ? 'block' : 'none';
  });
}

async function loadSettings() {
  const user = API.getUser();
  document.getElementById('settings-name').textContent = user.name || '–';
  document.getElementById('settings-email').textContent = user.email || '–';
  document.getElementById('settings-role').textContent = user.role || '–';
  document.getElementById('settings-avatar').textContent = (user.name || '?').charAt(0).toUpperCase();
  document.getElementById('settings-display-name').value = user.name || '';
  document.getElementById('settings-email-input').value = user.email || '';
  try {
    const s = await API.get('/api/notifications/settings');
    document.getElementById('set-mood-on').checked = s.moodReminderEnabled;
    document.getElementById('set-habit-on').checked = s.habitReminderEnabled;
    if (s.moodReminderTime) document.getElementById('set-mood-time').value = s.moodReminderTime.substring(0, 5);
    if (s.habitReminderTime) document.getElementById('set-habit-time').value = s.habitReminderTime.substring(0, 5);
    document.getElementById('mood-time-group').style.display = s.moodReminderEnabled ? 'block' : 'none';
    document.getElementById('habit-time-group').style.display = s.habitReminderEnabled ? 'block' : 'none';
  } catch (e) { console.error(e); }
}

async function saveSettings() {
  try {
    const moodTime = document.getElementById('set-mood-time').value;
    const habitTime = document.getElementById('set-habit-time').value;
    await API.put('/api/notifications/settings', {
      moodReminderEnabled: document.getElementById('set-mood-on').checked,
      habitReminderEnabled: document.getElementById('set-habit-on').checked,
      moodReminderTime: moodTime ? moodTime + ':00' : null,
      habitReminderTime: habitTime ? habitTime + ':00' : null,
    });
    showToast('Settings saved!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

async function updatePassword() {
  const current = document.getElementById('set-current-pw').value;
  const newPw = document.getElementById('set-new-pw').value;
  const confirm = document.getElementById('set-confirm-pw').value;
  if (!current || !newPw || !confirm) { showToast('All password fields are required', 'error'); return; }
  if (newPw !== confirm) { showToast('Passwords do not match', 'error'); return; }
  if (newPw.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
  showToast('Password update not available in demo', 'info');
}

Router.register('#/settings', renderSettings, 'Settings');
