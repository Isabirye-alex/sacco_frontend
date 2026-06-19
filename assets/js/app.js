const appRouter = {
  routes: {
    '#welcome': welcomeView,
    '#login': loginView,
    '#dashboard': dashboardView,
    '#register': registerView,
    '#members': membersView,
    '#savings': savingsView,
    '#shares': sharesView,
    '#loans': loansView
  },

  async navigate(hash) {
    const view = this.routes[hash] || welcomeView;
    const app = document.getElementById('app');

    console.info('[Router] navigating to:', hash);

    if (view.beforeEnter) {
      const canEnter = await view.beforeEnter();
      if (!canEnter) {
        console.info('[Router] redirecting to login');
        window.location.hash = '#login';
        return;
      }
    }

    app.innerHTML = view.render ? await view.render() : '';
    app.insertAdjacentHTML('beforeend', renderFooter());
    console.info('[Router] view rendered:', hash);

    if (view.bindEvents) {
      view.bindEvents();
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });

    updateNavState();
  }
};

function updateNavState() {
  const nav = document.querySelector('#navMenu .navbar-nav');
  if (!nav) return;

  let logoutItem = document.getElementById('logoutBtn');
  if (logoutItem) logoutItem.parentElement.remove();

  if (getStoredToken()) {
    const item = document.createElement('li');
    item.className = 'nav-item';
    item.innerHTML = '<a class="nav-link" href="#" id="logoutBtn">Logout</a>';
    item.querySelector('#logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
    nav.appendChild(item);
  }
}

function logout() {
  clearToken();
  localStorage.removeItem('user');
  window.location.hash = '#welcome';
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash || '#welcome';
  appRouter.navigate(hash);
});

window.addEventListener('hashchange', () => {
  appRouter.navigate(window.location.hash || '#welcome');
});
