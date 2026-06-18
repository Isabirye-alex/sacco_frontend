const sharesView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const products = await listShareProducts();
      const accounts = await listShareAccounts();
      const tableRows = accounts.map(a => `
        <tr>
          <td>${a.account_no || 'N/A'}</td>
          <td>${a.shares_held || 0}</td>
          <td>${a.total_value || 0}</td>
        </tr>
      `).join('');

      return `
        <section>
          <h2 class="mb-4">Shares</h2>
          ${renderStats([
            { label: 'Products', value: products.length || 0 },
            { label: 'Accounts', value: accounts.length || 0 }
          ])}
          <div class="card shadow-sm mt-3">
            <div class="card-body">
              <h5 class="card-title">Share Accounts</h5>
              ${renderTable(
                ['Account No', 'Shares Held', 'Value'],
                tableRows
              )}
            </div>
          </div>
        </section>
      `;
    } catch (error) {
      return renderError(error.message);
    }
  }
};
