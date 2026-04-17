const API_BASE = 'http://localhost:8080';

const tokenOutput = document.getElementById('tokenOutput');
const meOutput = document.getElementById('meOutput');
const moodOutput = document.getElementById('moodOutput');

const setTokens = (data) => {
  if (!data?.accessToken || !data?.refreshToken) {
    return;
  }
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  renderTokens();
};

const renderTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  tokenOutput.textContent = JSON.stringify({ accessToken, refreshToken }, null, 2);
};

const apiRequest = async (path, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const registerUser = async () => {
  try {
    const payload = {
      name: document.getElementById('registerName').value,
      email: document.getElementById('registerEmail').value,
      password: document.getElementById('registerPassword').value,
    };
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setTokens(data);
  } catch (err) {
    alert(`Register failed: ${err.message}`);
  }
};

const loginUser = async () => {
  try {
    const payload = {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value,
    };
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setTokens(data);
  } catch (err) {
    alert(`Login failed: ${err.message}`);
  }
};

const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    const data = await apiRequest('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });
    setTokens(data);
  } catch (err) {
    alert(`Refresh failed: ${err.message}`);
  }
};

const logoutUser = async () => {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    alert(`Logout failed: ${err.message}`);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    renderTokens();
  }
};

const loadMe = async () => {
  try {
    const data = await apiRequest('/api/auth/me');
    meOutput.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    meOutput.textContent = err.message;
  }
};

const logMood = async () => {
  try {
    const payload = {
      moodLevel: document.getElementById('moodLevel').value,
      note: document.getElementById('moodNote').value,
      entryDate: document.getElementById('moodDate').value || null,
    };
    const data = await apiRequest('/api/moods', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    moodOutput.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    moodOutput.textContent = err.message;
  }
};

const listMoods = async () => {
  try {
    const data = await apiRequest('/api/moods');
    moodOutput.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    moodOutput.textContent = err.message;
  }
};

renderTokens();

window.registerUser = registerUser;
window.loginUser = loginUser;
window.refreshToken = refreshToken;
window.logoutUser = logoutUser;
window.loadMe = loadMe;
window.logMood = logMood;
window.listMoods = listMoods;
