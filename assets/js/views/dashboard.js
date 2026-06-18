const dashboardView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const profile = await getMemberProfile();
      return `
        <section>
          <h2 class="mb-4">Dashboard</h2>
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h5>Welcome, ${profile.first_name || 'Member'}</h5>
              <p class="text-muted mb-0">Member number: ${profile.member_no || 'N/A'}</p>
            </div>
          </div>
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card stats-card shadow-sm">
                <div class="card-body">
                  <h6 class="text-muted">Savings</h6>
                  <h3>0.00</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card stats-card shadow-sm">
                <div class="card-body">
                  <h6 class="text-muted">Shares</h6>
                  <h3>0</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card stats-card shadow-sm">
                <div class="card-body">
                  <h6 class="text-muted">Loans</h6>
                  <h3>0</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Quick actions</h5>
              <div class="d-flex flex-wrap gap-2">
                <a href="#savings" class="btn btn-outline-primary btn-sm">Savings</a>
                <a href="#shares" class="btn btn-outline-success btn-sm">Shares</a>
                <a href="#loans" class="btn btn-outline-warning btn-sm">Loans</a>
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
