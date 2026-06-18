const welcomeView = {
  async render() {
    const fallbackSavings = [
      { name: 'Daily Savings', code: 'DS-01', interest_rate_pa: 6 },
      { name: 'School Fees Plan', code: 'SF-02', interest_rate_pa: 5 },
      { name: 'Emergency Fund', code: 'EF-03', interest_rate_pa: 7 }
    ];

    const fallbackLoans = [
      { name: 'Education Loan', code: 'ED-01', interest_rate_pa: 12 },
      { name: 'Business Boost', code: 'BB-02', interest_rate_pa: 14 },
      { name: 'Home Improvement', code: 'HI-03', interest_rate_pa: 10 }
    ];

    try {
      const products = await listSavingsProducts();
      const loanProducts = await listLoanProducts();
      const savingsData = Array.isArray(products) && products.length ? products : fallbackSavings;
      const loanData = Array.isArray(loanProducts) && loanProducts.length ? loanProducts : fallbackLoans;

      const savingsCards = savingsData.slice(0, 3).map(p => `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
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
          <div class="card h-100 shadow-sm">
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
          <div class="row align-items-center mb-5">
            <div class="col-lg-7">
              <h1 class="display-6 fw-bold">Welcome to SACCO</h1>
              <p class="lead text-muted">Manage savings, shares, and loans from one secure dashboard.</p>
              <div class="d-flex gap-2">
                <a href="#login" class="btn btn-primary">Log in</a>
                <a href="#register" class="btn btn-outline-success">Register as new member</a>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5>Why members choose us</h5>
                  <ul class="mb-0">
                    <li>Fast account access</li>
                    <li>Transparent loan products</li>
                    <li>Secure savings plans</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3>Popular savings schemes</h3>
            <div class="row g-3">${savingsCards}</div>
          </div>

          <div>
            <h3>Available loan schemes</h3>
            <div class="row g-3">${loanCards}</div>
          </div>
        </section>
      `;
    } catch (error) {
      return `
        <section>
          <div class="row align-items-center mb-5">
            <div class="col-lg-7">
              <h1 class="display-6 fw-bold">Welcome to SACCO</h1>
              <p class="lead text-muted">Manage savings, shares, and loans from one secure dashboard.</p>
            </div>
          </div>
          <div class="mb-4">
            <h3>Popular savings schemes</h3>
            <div class="row g-3">${fallbackSavings.slice(0, 3).map(p => `
              <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                  <div class="card-body">
                    <h5>${p.name}</h5>
                    <p class="text-muted mb-1">Code: ${p.code}</p>
                    <p class="mb-0">Interest: ${p.interest_rate_pa}%</p>
                  </div>
                </div>
              </div>
            `).join('')}</div>
          </div>
          <div>
            <h3>Available loan schemes</h3>
            <div class="row g-3">${fallbackLoans.slice(0, 3).map(p => `
              <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                  <div class="card-body">
                    <h5>${p.name}</h5>
                    <p class="text-muted mb-1">Code: ${p.code}</p>
                    <p class="mb-0">Rate: ${p.interest_rate_pa}%</p>
                  </div>
                </div>
              </div>
            `).join('')}</div>
          </div>
        </section>
      `;
    }
  }
};
