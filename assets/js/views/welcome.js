const welcomeView = {
  async render() {
    try {
      const products = await listSavingsProducts();
      const loanProducts = await listLoanProducts();
      const savingsData = Array.isArray(products) ? products : [];
      const loanData = Array.isArray(loanProducts) ? loanProducts : [];

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
          </div>

          <div class="mb-4">
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
          <div class="row align-items-center mb-5">
            <div class="col-lg-7">
              <h1 class="display-6 fw-bold">Welcome to SACCO</h1>
              <p class="lead text-muted">Manage savings, shares, and loans from one secure dashboard.</p>
            </div>
          </div>
          <div class="mb-4">
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
          <div class="mb-4">
            <h3>Popular savings schemes</h3>
            <div class="row g-3">
              <div class="col-12">
                <p class="text-muted mb-0">No savings products available.</p>
              </div>
            </div>
          </div>
          <div>
            <h3>Available loan schemes</h3>
            <div class="row g-3">
              <div class="col-12">
                <p class="text-muted mb-0">No loan products available.</p>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  },

  bindEvents() {
    // Add fixed background video once
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

