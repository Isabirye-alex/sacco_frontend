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
          <div class="welcome-hero card shadow-sm mb-5">
            <div class="card-body p-5">
              <div class="row align-items-center g-4">
                <div class="col-lg-7">
                  <p class="eyebrow-text mb-2">Member-first banking</p>
                  <h1 class="display-6 fw-bold mb-3">Grow your savings with confidence</h1>
                  <p class="lead text-muted mb-4">Track your savings, shares, and loan activity in one secure member portal.</p>
                  <div class="d-flex flex-wrap gap-2">
                    <a href="#login" class="btn btn-primary">Log in</a>
                    <a href="#register" class="btn btn-outline-success">Register now</a>
                  </div>
                </div>
                <div class="col-lg-5">
                  <div class="hero-panel">
                    <div>
                      <p class="text-muted mb-1">Today</p>
                      <h3 class="mb-0">Secure, simple, transparent</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h6 class="mb-1">Fast access</h6>
                  <p class="text-muted mb-0">Reach your dashboard and account details in seconds.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h6 class="mb-1">Secure records</h6>
                  <p class="text-muted mb-0">Keep your savings and loan information protected.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h6 class="mb-1">Helpful support</h6>
                  <p class="text-muted mb-0">Stay updated with clear milestones and easier next steps.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3>Popular savings schemes</h3>
            <div class="row g-3">${savingsCards || '<div class="col-12"><p class="text-muted mb-0">No savings products available.</p></div>'}</div>
          </div>

          <div>
            <h3>Available loan schemes</h3>
            <div class="row g-3">${loanCards || '<div class="col-12"><p class="text-muted mb-0">No loan products available.</p></div>'}</div>
          </div>
        </section>
      `;
    } catch (error) {
      console.error('Welcome view error:', error);
      return `
        <section>
          <div class="welcome-hero card shadow-sm mb-5">
            <div class="card-body p-5">
              <div class="row align-items-center g-4">
                <div class="col-lg-7">
                  <p class="eyebrow-text mb-2">Member-first banking</p>
                  <h1 class="display-6 fw-bold mb-3">Grow your savings with confidence</h1>
                  <p class="lead text-muted mb-4">Track your savings, shares, and loan activity in one secure member portal.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row g-3 mb-4">
            <div class="col-md-4"><div class="card shadow-sm h-100"><div class="card-body"><h6 class="mb-1">Fast access</h6><p class="text-muted mb-0">Reach your dashboard and account details in seconds.</p></div></div></div>
            <div class="col-md-4"><div class="card shadow-sm h-100"><div class="card-body"><h6 class="mb-1">Secure records</h6><p class="text-muted mb-0">Keep your savings and loan information protected.</p></div></div></div>
            <div class="col-md-4"><div class="card shadow-sm h-100"><div class="card-body"><h6 class="mb-1">Helpful support</h6><p class="text-muted mb-0">Stay updated with clear milestones and easier next steps.</p></div></div></div>
          </div>
          <div class="mb-4">
            <h3>Popular savings schemes</h3>
            <div class="row g-3"><div class="col-12"><p class="text-muted mb-0">No savings products available.</p></div></div>
          </div>
          <div>
            <h3>Available loan schemes</h3>
            <div class="row g-3"><div class="col-12"><p class="text-muted mb-0">No loan products available.</p></div></div>
          </div>
        </section>
      `;
    }
  },

  bindEvents() {
    if (!document.querySelector('.page-video')) {
      const video = document.createElement('video');
      video.className = 'page-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      const source = document.createElement('source');
      source.src = 'https://cdn.coverr.co/videos/coverr-working-on-a-laptop-5176/1080p.mp4';
      source.type = 'video/mp4';
      video.appendChild(source);
      document.body.insertBefore(video, document.body.firstChild);
    }
  }
};

