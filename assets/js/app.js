function getStoredToken() {
return localStorage.getItem('token');
}

function isLoggedIn() {
return !!getStoredToken();
}

const appRouter = {
routes: {
'welcome': welcomeView,
'login': loginView,
'dashboard': dashboardView,
'register': registerView,

'about': aboutView,
'contact': contactView,
'locate': locateView,

'profile': membersView,
'savings': savingsView,
'shares': sharesView,
'loans': loansView

},

async navigate(hash) {
const cleanHash = hash.replace('#', '');

const protectedRoutes = [
  'dashboard',
  'profile',
  'savings',
  'shares',
  'loans'
];

if (protectedRoutes.includes(cleanHash) && !isLoggedIn()) {
  window.location.hash = '#login';
  return;
}

const view = this.routes[cleanHash] || welcomeView;

const app = document.getElementById('app');

console.info('[Router] navigating to:', cleanHash);

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

console.info('[Router] view rendered:', cleanHash);

if (view.bindEvents) {
  view.bindEvents();
}

document.querySelectorAll('.nav-link').forEach(link => {
  const linkHash = link.getAttribute('href')?.replace('#', '');
  link.classList.toggle('active', linkHash === cleanHash);
});

// Move to top whenever page changes
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});

requestAnimationFrame(updateNavState);

}
};

function updateNavState() {
const nav = document.querySelector('#navMenu .navbar-nav');

if (!nav) return;

const loggedIn = isLoggedIn();

const navItems = nav.querySelectorAll('[data-nav-item]');

navItems.forEach(item => {
const target = item.dataset.navTarget || '';

if (target === 'guest-only' || target === 'member-only') {
  item.style.display = loggedIn
    ? (target === 'member-only' ? '' : 'none')
    : (target === 'guest-only' ? '' : 'none');
}

});

const logoutItem = document.getElementById('logoutBtn');

if (logoutItem) {
logoutItem.parentElement.remove();
}

const userBadge = document.getElementById('userBadge');

if (userBadge) {
userBadge.remove();
}

if (loggedIn) {
const user = getStoredUser() || {};

const userName =
  user.first_name ||
  user.name ||
  user.email ||
  'Member';

const badge = document.createElement('li');

badge.className = 'nav-item d-none d-lg-block';
badge.id = 'userBadge';

badge.innerHTML =
  `<span class="nav-link text-light opacity-75 mb-0">
    Hi, ${userName}
  </span>`;

nav.prepend(badge);

const item = document.createElement('li');

item.className = 'nav-item';

item.innerHTML =
  '<a class="nav-link" href="#" id="logoutBtn">Logout</a>';

item.querySelector('#logoutBtn')
  .addEventListener('click', e => {
    e.preventDefault();
    logout();
  });

nav.appendChild(item);

}
}

function logout() {
clearToken();
clearUserData();
window.location.hash = '#welcome';
}

window.addEventListener('DOMContentLoaded', () => {
const hash = window.location.hash || '#welcome';
appRouter.navigate(hash);
});

window.addEventListener('hashchange', () => {
appRouter.navigate(
window.location.hash || '#welcome'
);
});

document.addEventListener('click', e => {
const link = e.target.closest('a[href^="#"]');

if (!link) return;

e.preventDefault();

const hash = link.getAttribute('href');

appRouter.navigate(hash);
});