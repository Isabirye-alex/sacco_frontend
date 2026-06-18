const loansView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const products = await listLoanProducts();
      const tableRows = products.map(p => `
        <tr>
          <td>${p.name || 'N/A'}</td>
          <td>${p.code || 'N/A'}</td>
          <td>${p.interest_rate_pa || 0}%</td>
          <td>${p.min_amount || 0}</td>
        </tr>
      `).join('');

      return `
        <section>
          <h2 class="mb-4">Loans</h2>
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title">Apply for Loan</h5>
              <form id="loanForm">
                <div class="row g-2">
                  <div class="col-md-3"><input class="form-control" id="product_id" placeholder="Product ID"></div>
                  <div class="col-md-3"><input class="form-control" id="requested_amount" placeholder="Amount"></div>
                  <div class="col-md-3"><input class="form-control" id="proposed_term_months" placeholder="Term Months"></div>
                  <div class="col-md-3"><button class="btn btn-success w-100">Submit</button></div>
                </div>
              </form>
            </div>
          </div>
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Available Loan Products</h5>
              ${renderTable(['Name', 'Code', 'Rate', 'Min Amount'], tableRows)}
            </div>
          </div>
        </section>
      `;
    } catch (error) {
      return renderError(error.message);
    }
  },

  bindEvents() {
    document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const payload = {
          product_id: document.getElementById('product_id').value,
          requested_amount: Number(document.getElementById('requested_amount').value),
          proposed_term_months: Number(document.getElementById('proposed_term_months').value),
          purpose: 'Client application'
        };
        await createLoanApplication(payload);
        showToast('Loan application submitted', 'success');
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Submit');
      }
    });
  }
};
