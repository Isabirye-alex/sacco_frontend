const membersView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const profile = await getMemberProfile();
      return `
        <section>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="mb-1">Member Profile</h2>
              <p class="text-muted mb-0">Your personal membership details</p>
            </div>
            <a href="#dashboard" class="btn btn-outline-primary btn-sm">Back to dashboard</a>
          </div>
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <div class="card stats-card shadow-sm">
                <div class="card-body">
                  <h6 class="text-muted">Member No</h6>
                  <h3>${profile.member_no || 'N/A'}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card stats-card shadow-sm">
                <div class="card-body">
                  <h6 class="text-muted">Status</h6>
                  <h3>Active</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Member Profile</h5>
              <p><strong>Name:</strong> ${profile.first_name || ''} ${profile.last_name || ''}</p>
              <p><strong>Email:</strong> ${profile.email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${profile.phone_primary || 'N/A'}</p>
              <p><strong>Branch:</strong> ${profile.branch_name || profile.branch_id || 'N/A'}</p>
            </div>
          </div>
        </section>
      `;
    } catch (error) {
      return renderError(error.message);
    }
  }
};
