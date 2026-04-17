/* ===== MindTrack – App Entry Point ===== */
(() => {
    const authScreen = document.getElementById('auth-screen');
    const appShell = document.getElementById('app-shell');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authError = document.getElementById('auth-error');

    /* ---- Auth Tabs ---- */
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isLogin = tab.dataset.tab === 'login';
            loginForm.classList.toggle('hidden', !isLogin);
            registerForm.classList.toggle('hidden', isLogin);
            authError.classList.add('hidden');
            updateAuthLink(isLogin);
        });
    });

    /* ---- Auth Link toggle ---- */
    function updateAuthLink(isLogin) {
        const linkText = document.getElementById('auth-link-text');
        const linkAction = document.getElementById('auth-link-action');
        if (isLogin) {
            linkText.textContent = "Don't have an account?";
            linkAction.textContent = 'Register';
        } else {
            linkText.textContent = 'Already have an account?';
            linkAction.textContent = 'Log in';
        }
    }
    document.getElementById('auth-link-action').addEventListener('click', (e) => {
        e.preventDefault();
        const isLoginVisible = !loginForm.classList.contains('hidden');
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        if (isLoginVisible) {
            document.getElementById('tab-register').classList.add('active');
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            updateAuthLink(false);
        } else {
            document.getElementById('tab-login').classList.add('active');
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            updateAuthLink(true);
        }
        authError.classList.add('hidden');
    });

    function showAuthError(msg) {
        authError.textContent = msg;
        authError.classList.remove('hidden');
    }

    /* ---- Login ---- */
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await API.login(email, password);
            showToast('Welcome back!', 'success');
            enterApp();
        } catch (err) {
            showAuthError('Invalid email or password');
        }
    });

    /* ---- Register ---- */
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm-password').value;

        if (!name || !email || !password) { showAuthError('All fields are required'); return; }
        if (password !== confirm) { showAuthError('Passwords do not match'); return; }
        if (password.length < 8) { showAuthError('Password must be at least 8 characters'); return; }

        try {
            await API.register(name, email, password);
            showToast('Account created! Welcome to MindTrack 🎉', 'success');
            enterApp();
        } catch (err) {
            showAuthError(err.message);
        }
    });

    /* ---- Logout ---- */
    document.getElementById('btn-logout').addEventListener('click', async () => {
        await API.logout();
        exitApp();
    });

    window.addEventListener('miaw:logout', () => exitApp());

    /* ---- Mobile menu toggle ---- */
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    /* ---- Close sidebar on nav click (mobile) ---- */
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });
    });

    /* ---- Enter / Exit app ---- */
    function enterApp() {
        authScreen.classList.add('hidden');
        appShell.classList.remove('hidden');
        updateUserUI();
        Router.start();
    }

    function exitApp() {
        appShell.classList.add('hidden');
        authScreen.classList.remove('hidden');
        loginForm.reset();
        registerForm.reset();
        authError.classList.add('hidden');
        // Reset to login tab
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-login').classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        updateAuthLink(true);
    }

    function updateUserUI() {
        const user = API.getUser();
        document.getElementById('user-name').textContent = user.name || 'User';
        document.getElementById('user-email').textContent = user.email || '';
        document.getElementById('user-avatar').textContent = (user.name || '?').charAt(0).toUpperCase();
        // Show admin nav if admin
        const adminNav = document.getElementById('nav-admin');
        if (user.role === 'ADMIN') {
            adminNav.classList.remove('hidden');
        } else {
            adminNav.classList.add('hidden');
        }
    }

    /* ---- Boot ---- */
    if (API.isLoggedIn()) {
        enterApp();
    }
})();
