const registerView = {
  render() {
    return `
      <section class="row justify-content-center py-4">
        <div class="col-lg-9">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4 p-lg-5">
              <h3 class="mb-1">Member Registration</h3>
                  <p class="text-muted">Complete the form below to create a new member account.</p>
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
                    <input type="email" class="form-control" id="email" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input class="form-control" id="phone" placeholder="07XXXXXXXX">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                      <input type="password" class="form-control" id="password" required>
                      <button class="btn btn-outline-secondary" type="button" id="toggleRegisterPassword">Show</button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">National ID</label>
                    <input class="form-control" id="national_id" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Branch</label>
                      <select class="form-select" id="branch_id" required>
                        <option value="" disabled selected>Loading branches...</option>
                      </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Gender</label>
                      <select class="form-select" id="gender_id" required>
                        <option value="" disabled selected>Loading genders...</option>
                      </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Marital Status</label>
                    <select class="form-select" id="marital_status_id" required>
                      <option value="" disabled selected>Loading options...</option>
                    </select>
                  </div>
                </div>

                <div class="form-check mt-3">
                  <input class="form-check-input" type="checkbox" id="agreeTerms" required>
                  <label class="form-check-label small" for="agreeTerms">I agree to the terms and privacy policy</label>
                </div>

                <div class="d-flex gap-2 mt-4">
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

  async bindEvents() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggleRegisterPassword');

    togglePassword?.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.textContent = isHidden ? 'Hide' : 'Show';
    });

    await this.loadDropdownOptions();

    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);

      const getValueOrNull = (id) => {
        const val = document.getElementById(id)?.value?.trim();
        return val === "" ? null : val;
      };

      try {
        const emailValue = getValueOrNull('email');
        const phoneValue = getValueOrNull('phone');
        const firstNameValue = document.getElementById('first_name').value;
        const lastNameValue = document.getElementById('last_name').value;

        const payload = {
          member: {
            first_name: firstNameValue,
            middle_name: null,
            last_name: lastNameValue,
            email: emailValue,
            branch_id: document.getElementById('branch_id').value,
            gender_id: document.getElementById('gender_id').value,
            status_id: null,
            user_id: null,
            member_no: null,
            date_of_birth: null,
            marital_status_id: getValueOrNull('marital_status_id'),
            photo_url: null,
            national_id: document.getElementById('national_id').value,
            phone_primary: phoneValue,
            phone_secondary: null,
            country: null,
            village: null,
            district: null,
            joined_date: null,
            exit_date: null,
            exit_reason: null
          },
          user: {
            role_name: null,
            email: emailValue,
            first_name: firstNameValue,
            last_name: lastNameValue,
            user_type: "MEMBER",
            password: document.getElementById('password').value,
            phone: phoneValue,
            member_id: null
          }
        };

        const member = await createMemberWithUser(payload);
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
  },

  async loadDropdownOptions() {
    try {
      const [branches, genders, maritalStatuses] = await Promise.all([
        this.fetchData('/organisation/branches'),
        this.fetchData('/members/genders'),
        this.fetchData('/members/marital-statuses')
      ]);

      this.populateSelect('branch_id', branches, 'Select a branch...');
      this.populateSelect('gender_id', genders, 'Select gender...');
      this.populateSelect('marital_status_id', maritalStatuses, 'Select marital status...');

    } catch (error) {
      showToast('Failed to load form options from server.', 'danger');
      console.error('Dropdown population error:', error);
    }
  },

  async fetchData(url) {
    const fullUrl = apiUrl(url);
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  populateSelect(elementId, items, placeholderText) {
    const selectEl = document.getElementById(elementId);
    if (!selectEl) return;

    let optionsHtml = `<option value="" disabled selected>${placeholderText}</option>`;

    items.forEach(item => {
      const name = item.branch_name || item.gender || item.status || item.name || item.title;
      optionsHtml += `<option value="${item.id}">${name}</option>`;
    });

    selectEl.innerHTML = optionsHtml;
  }
};