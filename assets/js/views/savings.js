const savingsView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const productsResult = await listSavingsProducts();
      const accountsResult = await listSavingsAccounts();
      const products = Array.isArray(productsResult) ? productsResult : [];
      const accounts = Array.isArray(accountsResult) ? accountsResult : [];
      const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
      const averageBalance = accounts.length ? totalBalance / accounts.length : 0;
      const accountOptions = accounts.map(account => `
        <option value="${account.id || account.account_id || account.account_no || ''}">${account.account_no || 'Account'} (${formatCurrency(account.balance || 0)})</option>
      `).join('');

      const productCards = products.slice(0, 4).map(product => `
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-0">${product.name || 'Savings Product'}</h6>
                <span class="badge bg-light text-dark">${product.code || 'N/A'}</span>
              </div>
              <p class="text-muted mb-2">Interest: ${product.interest_rate_pa || 0}%</p>
              <p class="small mb-0">Min. balance: ${formatCurrency(product.min_balance || 0)}</p>
            </div>
          </div>
        </div>
      `).join('');

      const tableRows = accounts.map(account => `
        <tr>
          <td>${account.account_no || 'N/A'}</td>
          <td>${formatCurrency(account.balance || 0)}</td>
          <td><span class="badge bg-success-subtle text-success">${account.status_name || account.status_id || 'Active'}</span></td>
        </tr>
      `).join('');

      return `
        <section>
          <div class="page-header">
            <div>
              <p class="eyebrow-text mb-1">Your money</p>
              <h2 class="mb-0">Savings</h2>
            </div>
            <a href="#dashboard" class="btn btn-outline-secondary btn-sm">Back</a>
          </div>
          ${renderStats([
            { label: 'Savings products', value: products.length, icon: '🏷️' },
            { label: 'Savings accounts', value: accounts.length, icon: '📁' },
            { label: 'Total balance', value: formatCurrency(totalBalance), icon: '💸' }
          ])}

          <div class="row g-3 mb-4">
            <div class="col-lg-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title mb-3">Savings summary</h5>
                  <div class="d-grid gap-2">
                    <div class="insight-pill"><span>Average account balance</span><strong>${formatCurrency(averageBalance)}</strong></div>
                    <div class="insight-pill"><span>Ready to withdraw</span><strong>${accounts.length ? 'Available' : 'No account'}</strong></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title">Deposit funds</h5>
                  <form id="depositForm">
                    <div class="row g-2">
                      <div class="col-md-6">
                        <label class="form-label">Account</label>
                        <select class="form-select" id="depositAccountId" required>
                          <option value="">Select account</option>
                          ${accountOptions}
                        </select>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Amount</label>
                        <input type="number" class="form-control" id="depositAmount" min="1" step="0.01" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Channel</label>
                        <input class="form-control" id="depositChannel" placeholder="MPESA, CASH, BANK" required>
                      </div>
                      <div class="col-md-6 d-flex align-items-end">
                        <button class="btn btn-primary w-100">Submit deposit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-lg-12">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title">Withdraw funds</h5>
                  <form id="withdrawForm">
                    <div class="row g-2">
                      <div class="col-md-6">
                        <label class="form-label">Account</label>
                        <select class="form-select" id="withdrawAccountId" required>
                          <option value="">Select account</option>
                          ${accountOptions}
                        </select>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Amount</label>
                        <input type="number" class="form-control" id="withdrawAmount" min="1" step="0.01" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Channel</label>
                        <input class="form-control" id="withdrawChannel" placeholder="MPESA, CASH" required>
                      </div>
                      <div class="col-md-6 d-flex align-items-end">
                        <button class="btn btn-outline-danger w-100">Submit withdrawal</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h5 class="card-title">Savings products</h5>
              <div class="row g-3">${productCards || '<div class="col-12"><p class="text-muted mb-0">No products available yet.</p></div>'}</div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Savings accounts</h5>
              ${renderTable(['Account No', 'Balance', 'Status'], tableRows || '<tr><td colspan="3">No accounts found</td></tr>')}
            </div>
          </div>
        </section>
      `;
    } catch (error) {
      return renderError(error.message);
    }
  },

  bindEvents() {
    document.getElementById('depositForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const payload = {
          account_id: document.getElementById('depositAccountId').value,
          amount: Number(document.getElementById('depositAmount').value),
          payment_channel_code: document.getElementById('depositChannel').value,
          reference: `dep-${Date.now()}`
        };
        await depositSavings(payload);
        showToast('Deposit submitted successfully', 'success');
        setTimeout(() => window.location.hash = '#savings', 500);
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Submit deposit');
      }
    });

    document.getElementById('withdrawForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const payload = {
          account_id: document.getElementById('withdrawAccountId').value,
          amount: Number(document.getElementById('withdrawAmount').value),
          payment_channel_code: document.getElementById('withdrawChannel').value,
          reference: `wd-${Date.now()}`
        };
        await withdrawSavings(payload);
        showToast('Withdrawal submitted successfully', 'success');
        setTimeout(() => window.location.hash = '#savings', 500);
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Submit withdrawal');
      }
    });
  }
};
