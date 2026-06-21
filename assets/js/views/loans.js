const loansView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const profile = await getMemberProfile();
      const productsResult = await listLoanProducts();
      const products = Array.isArray(productsResult) ? productsResult : [];
      const memberLoanId = profile.id || profile.member_id || profile.member_no;
      const memberLoans = memberLoanId ? await getMemberLoans(memberLoanId) : [];
      const loanApplications = Array.isArray(memberLoans) ? memberLoans : [];
      const totalRequested = loanApplications.reduce(
        (sum, loan) => sum + Number(loan.requested_amount || loan.principal_amount || loan.approved_amount || 0),
        0
      );

      const productOptions = products.map(product => `
        <option value="${product.id || product.product_id || ''}">${product.name || 'Loan Product'} (${product.code || 'N/A'})</option>
      `).join('');

      const productCards = products.slice(0, 4).map(product => `
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="mb-1">${product.name || 'Loan Product'}</h6>
              <p class="text-muted mb-2">${product.code || 'N/A'}</p>
              <p class="small mb-0">Rate: ${product.interest_rate_pa || 0}%</p>
            </div>
          </div>
        </div>
      `).join('');

      const loansRows = loanApplications.map(loan => `
        <tr>
          <td>${loan.reference || loan.id || 'N/A'}</td>
          <td>${loan.product_name || loan.product_id || 'N/A'}</td>
          <td>${formatCurrency(loan.requested_amount || loan.principal_amount || loan.outstanding_balance || 0)}</td>
          <td><span class="badge bg-warning-subtle text-warning">${loan.status || loan.status_name || 'Pending'}</span></td>
        </tr>
      `).join('');

      return `
        <section>
          <div class="page-header">
            <div>
              <p class="eyebrow-text mb-1">Borrow with confidence</p>
              <h2 class="mb-0">Loans</h2>
            </div>
            <a href="#dashboard" class="btn btn-outline-secondary btn-sm">Back</a>
          </div>

          ${renderStats([
            { label: 'Available products', value: products.length, icon: '📋' },
            { label: 'Applications', value: loanApplications.length, icon: '🧾' },
            { label: 'Requested amount', value: formatCurrency(totalRequested), icon: '💵' }
          ])}

          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title">Apply for a loan</h5>
              <form id="loanForm">
                <div class="row g-2">
                  <div class="col-md-4">
                    <label class="form-label">Loan product</label>
                    <select class="form-select" id="product_id" required>
                      <option value="">Select a product</option>
                      ${productOptions}
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Amount</label>
                    <input type="number" class="form-control" id="requested_amount" min="1" required>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Term (months)</label>
                    <input type="number" class="form-control" id="proposed_term_months" min="1" required>
                  </div>
                  <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-success w-100">Submit</button>
                  </div>
                </div>
                <div class="mt-3">
                  <label class="form-label">Purpose</label>
                  <textarea class="form-control" id="purpose" rows="2" placeholder="Tell us how you plan to use the loan"></textarea>
                </div>
              </form>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h5 class="card-title">Loan products</h5>
              <div class="row g-3">${productCards || '<div class="col-12"><p class="text-muted mb-0">No loan products available.</p></div>'}</div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Your loan applications</h5>
              ${renderTable(['Reference', 'Product', 'Amount', 'Status'], loansRows || '<tr><td colspan="4">No loan applications found</td></tr>')}
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
          purpose: document.getElementById('purpose').value || 'Client application'
        };
        await createLoanApplication(payload);
        showToast('Loan application submitted successfully', 'success');
        setTimeout(() => window.location.hash = '#loans', 500);
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Submit');
      }
    });
  }
};
