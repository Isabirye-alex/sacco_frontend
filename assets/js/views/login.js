const loginView = {
  render() {
    return `
      <section class="d-flex align-items-center justify-content-center min-vh-100 py-5">

        <div class="col-12 col-md-8 col-lg-5">

          <div class="card shadow border-0 overflow-hidden">

            <div class="row g-0">

              <div class="col-md-5 d-none d-md-flex bg-primary text-white align-items-center">
                <div class="p-4">
                  <h3>Welcome Back</h3>
                  <p class="mb-0">
                    Login to manage your savings, shares and loans.
                  </p>
                </div>
              </div>

              <div class="col-md-7">

                <div class="card-body p-4 p-lg-5">

                  <h3 class="mb-1">Sign In</h3>

                  <p class="text-muted mb-4">
                    Access your SACCO account
                  </p>

                  <form id="loginForm">

                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        required>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Password</label>

                      <div class="input-group">
                        <input
                          type="password"
                          class="form-control"
                          id="password"
                          required>

                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          id="togglePassword">
                          Show
                        </button>
                      </div>
                    </div>

                    <div class="form-check mb-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="rememberMe">

                      <label
                        class="form-check-label"
                        for="rememberMe">
                        Remember me
                      </label>
                    </div>

                    <div class="d-grid gap-2">

                      <button class="btn btn-primary">
                        Login
                      </button>

                      <button
                        type="button"
                        id="createMemberBtn"
                        class="btn btn-outline-primary">
                        Create Member
                      </button>

                    </div>

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

    document.getElementById('createMemberBtn')
      ?.addEventListener('click', () => {
        window.location.hash = '#register';
      });

    document.getElementById('loginForm')
      ?.addEventListener('submit', async (e) => {

        e.preventDefault();

        const button = e.target.querySelector('.btn-primary');

        showLoading(button);

        try {

          const result = await loginUser({
            email: document.getElementById('email').value,
            password: passwordInput.value
          });

          saveToken(result.access_token);

          if (document.getElementById('rememberMe').checked) {
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