const loginView = {
  render() {
    return `
      <section class="d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-sm border-0 overflow-hidden">
            <div class="row g-0">
              <div class="col-12 col-md-5 d-none d-md-block bg-primary-subtle p-4 d-flex align-items-center">
                <div>
                  <p class="eyebrow-text mb-2">Welcome back</p>
                  <h4 class="mb-2">Member access</h4>
                  <p class="small mb-0 text-muted">Manage savings, shares, and loans in one place.</p>
                </div>
              </div>
              <div class="col-12 col-md-7">
                <div class="card-body p-4 p-lg-5">
                  <h3 class="mb-1">Sign in</h3>
                  <p class="text-muted mb-4">Access your SACCO dashboard</p>
                  <form id="loginForm">
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" placeholder="you@example.com" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <div class="input-group">
                        <input type="password" class="form-control" id="password" placeholder="Enter your password" required>
                        <button class="btn btn-outline-secondary" type="button" id="togglePassword">Show</button>
                      </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="rememberMe">
                        <label class="form-check-label small" for="rememberMe">Remember me</label>
                      </div>
                      <a href="#register" class="small">Create account</a>
                    </div>
                    <button class="btn btn-primary w-100">Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  bindEvents() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword?.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.textContent = isHidden ? 'Hide' : 'Show';
    });

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const result = await loginUser({
          email: document.getElementById('email').value,
          password: passwordInput.value
        });

        saveToken(result.access_token);
        if (document.getElementById('rememberMe')?.checked) {
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('remember_me');
        }
        showToast('Login successful', 'success');
        appRouter.navigate('#dashboard');
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Login');
      }
    });
  }
};
