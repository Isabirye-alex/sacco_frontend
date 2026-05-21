import { loadDashboard } from './screens/dashboard.js';
import { loadSavings } from './screens/savings.js';
import { loadLoans } from './screens/loans.js';
import { loadTransactions, setTransactionsFilter } from './screens/transactions.js';
import { loadProfile } from './screens/profile.js';

const screenTitles = {
    dashboard: 'Dashboard',
    savings: 'Savings',
    loans: 'Loans',
    transactions: 'Transactions',
    profile: 'Profile',
};

const loaders = {
    dashboard: loadDashboard,
    savings: loadSavings,
    loans: loadLoans,
    transactions: loadTransactions,
    profile: loadProfile,
};

let currentFilterType = 'all';
let currentSearchQuery = '';
let currentScreen = 'dashboard';

function showError(message) {
    console.error(message);
}

async function loadScreenTemplate(screen) {
    const screenRoot = document.getElementById('screen-root');
    if (!screenRoot) {
        return;
    }

    try {
        const response = await fetch(`screens/${screen}.html`);
        if (!response.ok) {
            throw new Error(`Unable to load screen template: ${response.statusText}`);
        }
        screenRoot.innerHTML = await response.text();

        const screenInner = screenRoot.querySelector('.screen-inner');
        if (screenInner) {
            screenInner.classList.add('active');
        }
    } catch (error) {
        console.error(error);
        screenRoot.innerHTML = `<div class="screen-error"><h2>Unable to load ${screen}</h2><p>Please serve the app from a local web server or verify the path <strong>screens/${screen}.html</strong>.</p></div>`;
    }
}

async function loadScreenData(screen) {
    const loader = loaders[screen];
    if (!loader) {
        return;
    }

    try {
        await loader();
    } catch (error) {
        console.error(`Error loading ${screen}:`, error);
    }
}

async function setActiveScreen(screen) {
    currentScreen = screen;

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screen);
    });

    const title = screenTitles[screen] || 'Dashboard';
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = title;
    }

    const searchBar = document.querySelector('.topbar-search');
    if (searchBar) {
        searchBar.style.display = screen === 'transactions' ? 'flex' : 'none';
    }

    await loadScreenTemplate(screen);
    attachScreenHandlers();

    // AUTO-CLOSE SIDEBAR: When a user selects a menu item on mobile screens, 
    // collapse the drawer overlay so they can view the loaded content template.
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('expanded');
    }

    await loadScreenData(screen).catch(error => showError(`Unable to load ${screen}: ${error.message}`));
}

function attachScreenHandlers() {
    document.querySelectorAll('.screen [data-screen]').forEach(item => {
        item.addEventListener('click', event => {
            const targetScreen = event.currentTarget.dataset.screen;
            if (targetScreen) {
                setActiveScreen(targetScreen);
            }
        });
    });

    document.querySelectorAll('.filter-chip[data-type]').forEach(chip => {
        chip.addEventListener('click', () => {
            currentFilterType = chip.dataset.type || 'all';

            document.querySelectorAll('.filter-chip').forEach(item => {
                item.classList.toggle('active', item === chip);
            });

            setTransactionsFilter(currentSearchQuery, currentFilterType);
        });
    });

    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            console.log(`Action clicked: ${action}`);
        });
    });
}

function attachGlobalHandlers() {
    document.querySelectorAll('[data-screen]').forEach(item => {
        item.addEventListener('click', event => {
            const targetScreen = event.currentTarget.dataset.screen;
            if (targetScreen) {
                setActiveScreen(targetScreen);
            }
        });
    });

    // UNIFIED TOGGLE LOGIC: Controls responsive expansion smoothly
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('expanded');
        });
    }

    const searchInput = document.querySelector('.transaction-search');
    if (searchInput) {
        searchInput.addEventListener('input', event => {
            currentSearchQuery = event.target.value.trim();
            if (currentScreen === 'transactions') {
                setTransactionsFilter(currentSearchQuery, currentFilterType);
            }
        });
    }
}

function initApp() {
    attachGlobalHandlers();
    setActiveScreen('dashboard');
    loadProfile().catch(error => showError(`Unable to load profile: ${error.message}`));
}

window.addEventListener('DOMContentLoaded', initApp);