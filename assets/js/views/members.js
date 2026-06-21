const membersView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const profile = await getMemberProfile();
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const status = profile.status?.status || profile.status_name || profile.status || 'Active';
      const branchName = profile.branch?.branch_name || profile.branch_name || profile.branch_id || 'N/A';
      const gender = profile.gender?.gender || profile.gender || 'N/A';
      const maritalStatus = profile.marital_status?.status || profile.marital_status || 'N/A';
      const initials = `${(profile.first_name || 'M').charAt(0)}${(profile.last_name || 'M').charAt(0)}`.toUpperCase();

      return `
        <section>
          <div class="page-header">
            <div>
              <p class="eyebrow-text mb-1">Your account</p>
              <h2 class="mb-0">Member profile</h2>
            </div>
            <a href="#dashboard" class="btn btn-outline-primary btn-sm">Back to dashboard</a>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-lg-4">
              <div class="card shadow-sm h-100">
                <div class="card-body text-center">
                  <div class="avatar-circle mx-auto mb-3" style="width: 76px; height: 76px; font-size: 1.25rem;">${initials}</div>
                  <h4 class="mb-1">${fullName || 'Member'}</h4>
                  <p class="text-muted mb-2">${profile.member_no || 'Member number unavailable'}</p>
                  <span class="badge bg-success-subtle text-success">${status}</span>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="row g-3">
                <div class="col-sm-6">
                  <div class="card stats-card shadow-sm h-100">
                    <div class="card-body">
                      <p class="text-muted mb-1">Branch</p>
                      <h3 class="mb-0">${branchName}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="card stats-card shadow-sm h-100">
                    <div class="card-body">
                      <p class="text-muted mb-1">Joined</p>
                      <h3 class="mb-0">${formatDate(profile.joined_date)}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="card stats-card shadow-sm h-100">
                    <div class="card-body">
                      <p class="text-muted mb-1">Phone</p>
                      <h3 class="mb-0">${profile.phone_primary || 'N/A'}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="card stats-card shadow-sm h-100">
                    <div class="card-body">
                      <p class="text-muted mb-1">Email</p>
                      <h3 class="mb-0">${profile.email || 'N/A'}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 class="card-title mb-1">Personal details</h5>
                  <p class="text-muted mb-0">Keep your records updated and easy to review.</p>
                </div>
                <span class="badge bg-light text-dark">${status}</span>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Full name</label>
                  <p class="form-control-plaintext">${fullName || 'N/A'}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <p class="form-control-plaintext">${profile.email || 'N/A'}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone</label>
                  <p class="form-control-plaintext">${profile.phone_primary || 'N/A'}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">National ID</label>
                  <p class="form-control-plaintext">${profile.national_id || 'N/A'}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Gender</label>
                  <p class="form-control-plaintext">${gender}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Marital status</label>
                  <p class="form-control-plaintext">${maritalStatus}</p>
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
