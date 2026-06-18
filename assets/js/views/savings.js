const savingsView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const products = await listSavingsProducts();
      const accounts = await listSavingsAccounts();
      const tableRows = accounts.map(a => `
        <tr>
          <td>${a.account_no || 'N/A'}</td>
          <td>${a.balance || 0}</td>
          <td>${a.status_id || 'Active'}</td>
        </tr>
      `).join('');

      return `
        <section>
          <h2 class="mb-4">Savings</h2>
          ${renderStats([
            { label: 'Products', value: products.length || 0 },
            { label: 'Accounts', value: accounts.length || 0 }
          ])}
          <div class="card shadow-sm mt-3 mb-3">
            <div class="card-body">
              <h5 class="card-title">Deposit</h5>
              <form id="depositForm">
                <div class="row g-2">
                  <div class="col-md-4"><input class="form-control" id="account_id" placeholder="Account ID"></div>
                  <div class="col-md-3"><input class="form-control" id="amount" placeholder="Amount"></div>
                  <div class="col-md-3"><input class="form-control" id="payment_channel_code" placeholder="Channel Code"></div>
                  <div class="col-md-2"><button class="btn btn-primary w-100">Save</button></div>
                </div>
              </form>
            </div>
          </div>
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Savings Accounts</h5>
              ${renderTable(['Account No', 'Balance', 'Status'], tableRows)}
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
          account_id: document.getElementById('account_id').value,
          amount: Number(document.getElementById('amount').value),
          payment_channel_code: document.getElementById('payment_channel_code').value,
          reference: `dep-${Date.now()}`
        };
        await depositSavings(payload);
        showToast('Deposit submitted successfully', 'success');
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Save');
      }
    });
  }
};
