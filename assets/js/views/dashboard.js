const dashboardView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const profile = await getMemberProfile();
      const savingsAccountsResult = await listSavingsAccounts();
      const shareAccountsResult = await listShareAccounts();
      const savingsAccounts = Array.isArray(savingsAccountsResult) ? savingsAccountsResult : [];
      const shareAccounts = Array.isArray(shareAccountsResult) ? shareAccountsResult : [];
      const memberLoanId = profile.id || profile.member_id || profile.member_no;
      const memberLoans = memberLoanId ? await getMemberLoans(memberLoanId) : [];

      const savingsTotal = savingsAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
      const sharesTotal = shareAccounts.reduce((sum, account) => sum + Number(account.total_value || account.shares_held || 0), 0);
      const portfolioValue = savingsTotal + sharesTotal;
      const loanCount = Array.isArray(memberLoans) ? memberLoans.length : 0;
      const loanTotal = Array.isArray(memberLoans)
        ? memberLoans.reduce((sum, loan) => sum + Number(loan.outstanding_balance || loan.principal_amount || loan.requested_amount || 0), 0)
        : 0;
      const branchName = profile.branch?.branch_name || profile.branch_name || profile.branch_id || 'N/A';
      const memberStatus = profile.status?.status || profile.status_name || profile.status || 'Active';
      const savingsGoal = Math.min(100, Math.round((savingsTotal / 150000) * 100));
      const shareGoal = Math.min(100, Math.round((sharesTotal / 50000) * 100));
      const nextStep = loanCount > 0
        ? 'Review your latest loan request updates.'
        : 'Apply for a loan when you need extra support.';

      return `
        <section>
          <div class="page-header">
            <div>
              <p class="eyebrow-text mb-1">Member portal</p>
              <h2 class="mb-0">Dashboard</h2>
            </div>
            <span class="badge bg-light text-dark">${profile.member_no || 'Member'}</span>
          </div>

          <div class="card welcome-card shadow-sm mb-4">
            <div class="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <p class="text-muted mb-1">Welcome back</p>
                <h3 class="mb-1">${profile.first_name || 'Member'} ${profile.last_name || ''}</h3>
                <p class="mb-0 text-muted">${profile.email || 'No email provided'}</p>
              </div>
              <div class="d-flex align-items-center gap-3">
                <div class="avatar-circle">${(profile.first_name || 'M').charAt(0)}${(profile.last_name || 'M').charAt(0)}</div>
                <div>
                  <p class="text-muted mb-1">Primary branch</p>
                  <h6 class="mb-0">${branchName}</h6>
                </div>
              </div>
            </div>
          </div>

          ${renderStats([
            { label: 'Savings balance', value: formatCurrency(savingsTotal), icon: '💰' },
            { label: 'Shares value', value: formatCurrency(sharesTotal), icon: '📈' },
            { label: 'Loan applications', value: loanCount, icon: '🏦' },
            { label: 'Outstanding loans', value: formatCurrency(loanTotal), icon: '🧾' }
          ])}

          <div class="row g-3 mb-4">
            <div class="col-lg-8">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Quick actions</h5>
                    <span class="text-muted small">Everything you need</span>
                  </div>
                  <div class="row g-2">
                    <div class="col-md-6 col-xl-3">
                      <a href="#savings" class="quick-action">
                        <span>Savings</span>
                        <span>→</span>
                      </a>
                    </div>
                    <div class="col-md-6 col-xl-3">
                      <a href="#shares" class="quick-action">
                        <span>Shares</span>
                        <span>→</span>
                      </a>
                    </div>
                    <div class="col-md-6 col-xl-3">
                      <a href="#loans" class="quick-action">
                        <span>Loans</span>
                        <span>→</span>
                      </a>
                    </div>
                    <div class="col-md-6 col-xl-3">
                      <a href="#profile" class="quick-action">
                        <span>Profile</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title mb-3">Account snapshot</h5>
                  <div class="d-grid gap-2">
                    <div class="summary-pill">
                      <span>Savings accounts</span>
                      <strong>${savingsAccounts.length}</strong>
                    </div>
                    <div class="summary-pill">
                      <span>Share accounts</span>
                      <strong>${shareAccounts.length}</strong>
                    </div>
                    <div class="summary-pill">
                      <span>Member status</span>
                      <strong>${memberStatus}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-lg-7">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Your progress</h5>
                    <span class="text-muted small">${formatCurrency(portfolioValue)} total</span>
                  </div>
                  <div class="mb-3">
                    <div class="d-flex justify-content-between small mb-1">
                      <span>Savings goal</span>
                      <strong>${savingsGoal}%</strong>
                    </div>
                    <div class="progress-track"><div class="progress-fill" style="width: ${savingsGoal}%"></div></div>
                  </div>
                  <div>
                    <div class="d-flex justify-content-between small mb-1">
                      <span>Share growth</span>
                      <strong>${shareGoal}%</strong>
                    </div>
                    <div class="progress-track"><div class="progress-fill" style="width: ${shareGoal}%"></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title mb-3">Today’s tips</h5>
                  <div class="activity-list">
                    <div class="activity-item">
                      <span>Portfolio value</span>
                      <strong>${formatCurrency(portfolioValue)}</strong>
                    </div>
                    <div class="activity-item">
                      <span>Open applications</span>
                      <strong>${loanCount}</strong>
                    </div>
                    <div class="activity-item">
                      <span>Next step</span>
                      <strong class="small text-muted">${nextStep}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    } catch (error) {
      return renderError(error.message);
    }
  }
};
