/* ===== Journals Page ===== */
let journalDraftTimer = null;

function renderJournals() {
  const pc = document.getElementById('page-content');
  document.getElementById('top-bar-actions').innerHTML = '<button class="btn btn-primary btn-sm" id="btn-new-journal">New Entry</button>';
  pc.innerHTML = '<div id="journal-list"></div>';
  document.getElementById('btn-new-journal').addEventListener('click', () => openJournalModal());
  loadJournals();
}

async function loadJournals() {
  try {
    const entries = await API.get('/api/journals');
    const list = document.getElementById('journal-list');
    if (!entries.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">📓</div><div class="empty-text">No entries yet. Write your first one!</div><div class="empty-sub">Start journaling about your day</div><button class="btn btn-primary" onclick="openJournalModal()">New Entry</button></div>';
      return;
    }
    list.innerHTML = '<div class="grid-auto">' + entries.map(j => `
      <div class="card" style="cursor:pointer;transition:transform 0.2s ease, box-shadow 0.2s ease" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='';this.style.boxShadow=''" onclick="openJournalView(${j.id})">
        <div class="flex justify-between items-center" style="margin-bottom:0.5rem">
          <div style="font-weight:700;font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1">${esc(j.title)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);flex-shrink:0;margin-left:0.5rem">${j.entryDate}</div>
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;line-height:1.6">${esc(j.content)}</div>
        <div class="flex gap-sm mt-1">
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openJournalModal(${j.id})" aria-label="Edit entry">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteJournal(${j.id})" aria-label="Delete entry">🗑️</button>
        </div>
      </div>
    `).join('') + '</div>';
  } catch (e) { showToast(e.message, 'error'); }
}

async function openJournalView(id) {
  try {
    const entries = await API.get('/api/journals');
    const j = entries.find(e => e.id === id);
    if (!j) return;
    openModal(j.title, `
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">${j.entryDate}</div>
        <div style="font-size:0.95rem;line-height:1.8;white-space:pre-wrap;color:var(--text-primary)">${esc(j.content)}</div>
        <div class="flex gap-sm mt-1">
          <button class="btn btn-secondary btn-sm" onclick="closeModal();openJournalModal(${j.id})">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="closeModal();deleteJournal(${j.id})">🗑️ Delete</button>
        </div>
      `);
  } catch (e) { showToast(e.message, 'error'); }
}

async function openJournalModal(id) {
  let title = '', content = '', date = new Date().toISOString().split('T')[0];
  if (id) {
    try {
      const entries = await API.get('/api/journals');
      const j = entries.find(e => e.id === id);
      if (j) { title = j.title; content = j.content; date = j.entryDate; }
    } catch (_) { }
  } else {
    // Check for draft
    const draft = localStorage.getItem('miaw_journal_draft');
    if (draft) {
      try { const d = JSON.parse(draft); title = d.title || ''; content = d.content || ''; } catch (_) { }
    }
  }
  const isEdit = !!id;
  openModal(isEdit ? 'Edit Entry' : 'New Entry', `
    <div class="form-group"><label>Title</label><input id="modal-j-title" value="${esc(title)}" placeholder="Entry title" style="font-size:1.1rem;font-weight:600" /></div>
    <div class="form-group">
      <label>Write your thoughts...</label>
      <textarea id="modal-j-content" rows="8" placeholder="What's on your mind?" style="line-height:1.8">${esc(content)}</textarea>
      <div class="flex justify-between" style="margin-top:0.25rem">
        <span style="font-size:0.7rem;color:var(--text-muted)" id="modal-j-draft"></span>
        <span style="font-size:0.7rem;color:var(--text-muted)" id="modal-j-chars">${content.length} chars</span>
      </div>
    </div>
    <button class="btn btn-primary btn-full" id="modal-j-submit">${isEdit ? 'Update' : 'Save Entry'}</button>
  `);

  // Autosave draft every 10 seconds
  const titleEl = document.getElementById('modal-j-title');
  const contentEl = document.getElementById('modal-j-content');
  const charsEl = document.getElementById('modal-j-chars');
  const draftEl = document.getElementById('modal-j-draft');
  contentEl.addEventListener('input', () => { charsEl.textContent = `${contentEl.value.length} chars`; });

  if (!isEdit) {
    if (journalDraftTimer) clearInterval(journalDraftTimer);
    journalDraftTimer = setInterval(() => {
      const draftData = { title: titleEl.value, content: contentEl.value };
      localStorage.setItem('miaw_journal_draft', JSON.stringify(draftData));
      draftEl.textContent = 'Draft saved';
      setTimeout(() => { if (draftEl) draftEl.textContent = ''; }, 2000);
    }, 10000);
  }

  document.getElementById('modal-j-submit').addEventListener('click', async () => {
    const payload = { title: titleEl.value, content: contentEl.value };
    if (!payload.title || !payload.content) { showToast('Title and content are required', 'error'); return; }
    try {
      if (isEdit) await API.put(`/api/journals/${id}`, payload);
      else await API.post('/api/journals', payload);
      if (journalDraftTimer) { clearInterval(journalDraftTimer); journalDraftTimer = null; }
      localStorage.removeItem('miaw_journal_draft');
      closeModal(); showToast(isEdit ? 'Updated!' : 'Entry saved!', 'success'); loadJournals();
    } catch (e) { showToast(e.message, 'error'); }
  });
}

async function deleteJournal(id) {
  openModal('Delete Journal Entry', `
        <p style="margin-bottom:1rem;color:var(--text-secondary)">Are you sure you want to delete this journal entry? This cannot be undone.</p>
        <div class="flex gap-sm" style="justify-content:flex-end">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-danger" id="confirm-delete-journal">Delete</button>
        </div>
    `);
  document.getElementById('confirm-delete-journal').addEventListener('click', async () => {
    try { await API.del(`/api/journals/${id}`); closeModal(); showToast('Entry deleted', 'success'); loadJournals(); }
    catch (e) { showToast(e.message, 'error'); }
  });
}

Router.register('#/journals', renderJournals, 'Journal');
