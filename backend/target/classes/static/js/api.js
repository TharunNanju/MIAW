/* ===== MIAW API Client ===== */
const API = (() => {
    const BASE = '';

    function getAccessToken() { return localStorage.getItem('miaw_access'); }
    function getRefreshToken() { return localStorage.getItem('miaw_refresh'); }
    function setTokens(data) {
        if (data.accessToken) localStorage.setItem('miaw_access', data.accessToken);
        if (data.refreshToken) localStorage.setItem('miaw_refresh', data.refreshToken);
        if (data.id) localStorage.setItem('miaw_uid', data.id);
        if (data.name) localStorage.setItem('miaw_name', data.name);
        if (data.email) localStorage.setItem('miaw_email', data.email);
        if (data.role) localStorage.setItem('miaw_role', data.role);
    }
    function clearTokens() {
        ['miaw_access', 'miaw_refresh', 'miaw_uid', 'miaw_name', 'miaw_email', 'miaw_role'].forEach(k => localStorage.removeItem(k));
    }
    function isLoggedIn() { return !!getAccessToken(); }
    function getUser() {
        return {
            id: localStorage.getItem('miaw_uid'),
            name: localStorage.getItem('miaw_name'),
            email: localStorage.getItem('miaw_email'),
            role: localStorage.getItem('miaw_role'),
        };
    }

    async function request(path, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const token = getAccessToken();
        if (token) headers.Authorization = `Bearer ${token}`;
        const resp = await fetch(`${BASE}${path}`, { ...options, headers });

        if (resp.status === 401 && getRefreshToken() && !options._retried) {
            const refreshed = await tryRefresh();
            if (refreshed) return request(path, { ...options, _retried: true });
            clearTokens();
            window.dispatchEvent(new Event('miaw:logout'));
            throw new Error('Session expired');
        }

        if (!resp.ok) {
            let msg = resp.statusText;
            try { const j = await resp.json(); msg = j.error || j.message || msg; } catch (_) { }
            throw new Error(msg);
        }
        if (resp.status === 204) return null;
        return resp.json();
    }

    async function tryRefresh() {
        try {
            const resp = await fetch(`${BASE}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: getRefreshToken() }),
            });
            if (!resp.ok) return false;
            const data = await resp.json();
            setTokens(data);
            return true;
        } catch (_) { return false; }
    }

    async function register(name, email, password) {
        const data = await request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        setTokens(data);
        return data;
    }

    async function login(email, password) {
        const data = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setTokens(data);
        return data;
    }

    async function logout() {
        try { await request('/api/auth/logout', { method: 'POST' }); } catch (_) { }
        clearTokens();
    }

    const get = (path) => request(path);
    const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
    const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
    const del = (path) => request(path, { method: 'DELETE' });

    return { register, login, logout, get, post, put, del, isLoggedIn, getUser, clearTokens, setTokens };
})();

/* ===== Toast Utility ===== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

/* ===== Modal Utility ===== */
function openModal(title, bodyHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});
