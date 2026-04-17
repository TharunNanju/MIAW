/* ===== Admin Page ===== */
let adminUsers = [];
let adminPage = 0;
const ADMIN_PAGE_SIZE = 20;
let adminSearchQuery = '';

function renderAdmin() {
  const pc = document.getElementById('page-content');
  pc.innerHTML = `
    <div class="grid-4" id="admin-stats" style="margin-bottom:1.5rem">
      <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value" id="as-users">–</div><div class="stat-label">Total Users</div></div>
      <div class="stat-card"><div class="stat-icon">😊</div><div class="stat-value" id="as-moods">–</div><div class="stat-label">Mood Entries</div></div>
      <div class="stat-card"><div class="stat-icon">📓</div><div class="stat-value" id="as-journals">–</div><div class="stat-label">Journal Entries</div></div>
      <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-value" id="as-habits">–</div><div class="stat-label">Habits</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Registered Users</span></div>
      <div class="search-bar">
        <input id="admin-search" placeholder="Search by name or email" />
      </div>
      <div class="table-container" id="admin-user-table"></div>
      <div class="pagination" id="admin-pagination"></div>
    </div>
  `;
  document.getElementById('admin-search').addEventListener('input', (e) => {
    adminSearchQuery = e.target.value.toLowerCase();
    adminPage = 0;
    renderAdminTable();
  });
  loadAdminData();
}

async function loadAdminData() {
  try {
    const [usage, users] = await Promise.all([
      API.get('/api/admin/usage'),
      API.get('/api/admin/users'),
    ]);
    document.getElementById('as-users').textContent = usage.totalUsers;
    document.getElementById('as-moods').textContent = usage.totalMoodEntries;
    document.getElementById('as-journals').textContent = usage.totalJournalEntries;
    document.getElementById('as-habits').textContent = usage.totalHabits;

    adminUsers = users;
    adminPage = 0;
    renderAdminTable();
  } catch (e) { showToast(e.message, 'error'); }
}

function renderAdminTable() {
  const filtered = adminUsers.filter(u => {
    if (!adminSearchQuery) return true;
    return u.name.toLowerCase().includes(adminSearchQuery) || u.email.toLowerCase().includes(adminSearchQuery);
  });

  const totalPages = Math.ceil(filtered.length / ADMIN_PAGE_SIZE);
  const pageUsers = filtered.slice(adminPage * ADMIN_PAGE_SIZE, (adminPage + 1) * ADMIN_PAGE_SIZE);

  const table = document.getElementById('admin-user-table');
  table.innerHTML = `<table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead><tbody>` +
    pageUsers.map(u => `<tr style="cursor:pointer" onclick="toggleAdminDetail(this, ${u.id})">
            <td style="font-weight:600">${esc(u.name)}</td>
            <td>${esc(u.email)}</td>
            <td><span class="badge ${u.role === 'ADMIN' ? 'badge-anxious' : 'badge-calm'}">${u.role}</span></td>
            <td><span class="badge ${u.active !== false ? 'badge-active' : 'badge-inactive'}">${u.active !== false ? 'Active' : 'Inactive'}</span></td>
            <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            <td onclick="event.stopPropagation()">
                ${u.role !== 'ADMIN' ? (u.active !== false
        ? `<button class="btn btn-danger btn-sm" onclick="adminDeactivateUser(${u.id})">Deactivate</button>`
        : `<button class="btn btn-primary btn-sm" onclick="adminActivateUser(${u.id})">Activate</button>`)
        : ''}
            </td>
        </tr>`).join('') + '</tbody></table>';

  // Pagination
  const pagination = document.getElementById('admin-pagination');
  if (totalPages > 1) {
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) =>
      `<button class="page-btn ${i === adminPage ? 'active' : ''}" onclick="adminGoToPage(${i})">${i + 1}</button>`
    ).join('');
  } else {
    pagination.innerHTML = '';
  }
}

function adminGoToPage(page) {
  adminPage = page;
  renderAdminTable();
}

function toggleAdminDetail(row, userId) {
  const existingDetail = row.nextElementSibling;
  if (existingDetail && existingDetail.classList.contains('admin-detail-row')) {
    existingDetail.remove();
    return;
  }
  // Remove any other open detail rows
  document.querySelectorAll('.admin-detail-row').forEach(r => r.remove());

  const u = adminUsers.find(u => u.id === userId);
  if (!u) return;
  const detailRow = document.createElement('tr');
  detailRow.className = 'admin-detail-row';
  detailRow.innerHTML = `<td colspan="6" style="background:var(--bg-primary);padding:1rem">
        <div class="grid-3" style="max-width:500px">
            <div><div style="font-size:0.75rem;color:var(--text-muted)">User ID</div><div style="font-weight:600">${u.id}</div></div>
            <div><div style="font-size:0.75rem;color:var(--text-muted)">Role</div><div style="font-weight:600">${u.role}</div></div>
            <div><div style="font-size:0.75rem;color:var(--text-muted)">Joined</div><div style="font-weight:600">${new Date(u.createdAt).toLocaleDateString()}</div></div>
        </div>
    </td>`;
  row.after(detailRow);
}

async function adminDeactivateUser(userId) {
  openModal('Deactivate User', `
        <p style="margin-bottom:1rem;color:var(--text-secondary)">Are you sure you want to deactivate this user? They will not be able to log in.</p>
        <div class="flex gap-sm" style="justify-content:flex-end">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-danger" id="confirm-deactivate">Deactivate</button>
        </div>
    `);
  document.getElementById('confirm-deactivate').addEventListener('click', async () => {
    try { await API.del(`/api/admin/users/${userId}`); closeModal(); showToast('User deactivated', 'success'); loadAdminData(); }
    catch (e) { showToast(e.message, 'error'); }
  });
}

async function adminActivateUser(userId) {
  try { showToast('Activate not available in current API', 'info'); }
  catch (e) { showToast(e.message, 'error'); }
}

Router.register('#/admin', renderAdmin, 'Admin');
