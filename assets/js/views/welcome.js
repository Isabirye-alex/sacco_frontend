const welcomeView = {
  async render() {
    try {
      const products = await listSavingsProducts();
      const loanProducts = await listLoanProducts();

      const savingsData = Array.isArray(products) ? products : [];
      const loanData = Array.isArray(loanProducts) ? loanProducts : [];

      const savingsCards = savingsData.slice(0, 3).map(p => `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm welcome-feature-card">
            <div class="card-body">
              <h5>${p.name || 'Savings Product'}</h5>
              <p class="text-muted mb-1">Code: ${p.code || 'N/A'}</p>
              <p class="mb-0">Interest: ${p.interest_rate_pa || 0}%</p>
            </div>
          </div>
        </div>
      `).join('');

      const loanCards = loanData.slice(0, 3).map(p => `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm welcome-feature-card">
            <div class="card-body">
              <h5>${p.name || 'Loan Product'}</h5>
              <p class="text-muted mb-1">Code: ${p.code || 'N/A'}</p>
              <p class="mb-0">Rate: ${p.interest_rate_pa || 0}%</p>
            </div>
          </div>
        </div>
      `).join('');

      return `
        <section>

          <div class="welcome-hero card shadow-sm border-0 mb-5">
            <div class="card-body p-5 text-center">

              <h1 class="display-4 fw-bold mb-3">
                Welcome to SACCO Member Portal
              </h1>

              <p class="lead text-muted mb-4">
                Manage your Savings, Shares and Loans in one secure platform.
              </p>

              <a href="#login" class="btn btn-primary btn-lg px-4">
                Login
              </a>

            </div>
          </div>

          <div class="row g-4 mb-5">

            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <div class="card-body text-center">
                  <h5>Fast Access</h5>
                  <p class="text-muted mb-0">
                    Access your member account quickly.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <div class="card-body text-center">
                  <h5>Secure Records</h5>
                  <p class="text-muted mb-0">
                    Your financial information stays protected.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <div class="card-body text-center">
                  <h5>Member Support</h5>
                  <p class="text-muted mb-0">
                    Receive support whenever you need it.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div class="mb-5">
            <h3 class="mb-3">Popular Savings Schemes</h3>
            <div class="row g-3">
              ${savingsCards || '<div class="col-12"><p>No savings products available.</p></div>'}
            </div>
          </div>

          <div>
            <h3 class="mb-3">Available Loan Schemes</h3>
            <div class="row g-3">
              ${loanCards || '<div class="col-12"><p>No loan products available.</p></div>'}
            </div>
          </div>

        </section>
      `;
    } catch (error) {
      console.error(error);
      return '<div class="alert alert-danger">Failed to load data.</div>';
    }
  },

  bindEvents() {}
};