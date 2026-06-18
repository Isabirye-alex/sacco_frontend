const registerView = {
  render() {
    return `
      <section class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h3 class="mb-1">Register Member</h3>
              <p class="text-muted">Create your account to access savings, shares, and loans.</p>
              <form id="registerForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">First name</label>
                    <input class="form-control" id="first_name" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Last name</label>
                    <input class="form-control" id="last_name" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="email">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input class="form-control" id="phone">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Branch ID</label>
                    <input class="form-control" id="branch_id" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Gender ID</label>
                    <input class="form-control" id="gender_id" required>
                  </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-success">Create Member</button>
                  <a href="#login" class="btn btn-outline-secondary">Back to login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  bindEvents() {
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const member = await createMember({
          first_name: document.getElementById('first_name').value,
          last_name: document.getElementById('last_name').value,
          email: document.getElementById('email').value,
          phone_primary: document.getElementById('phone').value,
          branch_id: document.getElementById('branch_id').value,
          gender_id: document.getElementById('gender_id').value,
          user: {
            email: document.getElementById('email').value,
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value
          }
        });
        showToast('Member created successfully', 'success');
        if (member && member.id) {
          setTimeout(() => {
            window.location.hash = '#login';
          }, 800);
        }
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Create Member');
      }
    });
  }
};
