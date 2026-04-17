/* ===== Hash-based SPA Router ===== */
const Router = (() => {
    const routes = {};

    function register(hash, renderFn, title) {
        routes[hash] = { render: renderFn, title: title || hash };
    }

    function navigate(hash) {
        if (window.location.hash !== hash) window.location.hash = hash;
    }

    function handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const route = routes[hash];
        if (!route) { navigate('#/dashboard'); return; }

        document.getElementById('page-title').textContent = route.title;
        document.getElementById('page-content').innerHTML = '';
        document.getElementById('top-bar-actions').innerHTML = '';

        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });

        // Re-animate
        const pc = document.getElementById('page-content');
        pc.style.animation = 'none';
        pc.offsetHeight; // reflow
        pc.style.animation = '';

        route.render();
    }

    function start() {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    return { register, navigate, start };
})();
