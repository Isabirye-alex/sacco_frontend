// 1. STATIC SIDEBAR COMPONENT
class AppSidebar extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active-page') || '';

        this.innerHTML = `
            <div class="sidebar">
                <div class="p-4">
                    <div class="sidebar-brand">MazaoSACCO</div>
                    <div class="sidebar-sub">Member Portal</div>
                </div>
                
                <nav class="nav flex-column mt-3">
                    <a class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" href="dashboard.html"><i class="bi bi-grid-1x2"></i> Dashboard</a>
                    <a class="nav-link ${activePage === 'savings' ? 'active' : ''}" href="savings.html"><i class="bi bi-wallet2"></i> Savings</a>
                    <a class="nav-link ${activePage === 'loans' ? 'active' : ''}" href="loans.html"><i class="bi bi-cash-stack"></i> Loans</a>
                    <a class="nav-link ${activePage === 'transactions' ? 'active' : ''}" href="transactions.html"><i class="bi bi-clock-history"></i> Transactions</a>
                    <a class="nav-link ${activePage === 'profile' ? 'active' : ''}" href="profile.html"><i class="bi bi-person"></i> Profile</a>
                </nav>

                <div class="user-profile-footer pt-3 mt-auto d-flex align-items-center gap-3" style="border-top: 1px solid #E2E8F0;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" class="rounded-circle object-fit-cover" width="40" height="40" alt="User Avatar">
                    <div>
                        <div class="fw-bold small text-dark" style="line-height: 1.2;">Amara Kiprotich</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Member #00142</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// 2. FIXED TOP BAR COMPONENT
class AppNavbar extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Portal';
        
        // Inside components.js -> AppNavbar class template
this.innerHTML = `
                <div class="top-navbar d-flex justify-content-between align-items-center bg-white border-bottom px-4" style="height: 70px;">
                    <h4 class="fw-bold mb-0 text-dark" style="flex-shrink: 0;">${title}</h4>
                    
                    <div class="position-relative d-none d-md-block" style="flex-grow: 1; max-width: 420px; margin: 0 2rem;">
                        <span class="search-icon-wrapper" style="position: absolute; top: 50%; left: 16px; transform: translateY(-50%); color: #718096; pointer-events: none; z-index: 5;">
                            <i class="bi bi-search"></i>
                        </span>
                        <input type="text" class="form-control search-input w-100 rounded-pill" placeholder="Search portal..." style="padding-left: 2.75rem; height: 40px; background-color: #F4F7FA; border: 1px solid #E2E8F0;">
                    </div>

                    <div class="d-flex align-items-center gap-4" style="flex-shrink: 0;">
                        <div class="position-relative cursor-pointer">
                            <i class="bi bi-bell fs-5 text-secondary"></i>
                            <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" class="rounded-circle object-fit-cover" width="36" height="36" alt="Avatar">
                    </div>
                </div>
            `;
    }
}

// 3. MASTER PORTAL FOOTER COMPONENT
class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer py-3 mt-5 border-top bg-white text-center">
                <div class="container-fluid">
                    <span class="text-muted small">
                        &copy; 2026 MazaoSACCO Ltd. Regulated by SASRA.
                    </span>
                </div>
            </footer>
        `;
    }
}

// Register the new component safely
if (!customElements.get('app-footer')) {
    customElements.define('app-footer', AppFooter);
}
// Register components
customElements.define('app-sidebar', AppSidebar);
customElements.define('app-navbar', AppNavbar);