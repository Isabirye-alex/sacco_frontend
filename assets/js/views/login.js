const loginView = {
  render() {
    return `
      <section class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h3 class="mb-3">Sign in</h3>
              <form id="loginForm">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" required>
                </div>
                <button class="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  bindEvents() {
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const result = await loginUser({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        });
        saveToken(result.access_token);
        localStorage.setItem('user', JSON.stringify(result));
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
