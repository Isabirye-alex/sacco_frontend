const sharesView = {
  async beforeEnter() {
    return !!getStoredToken();
  },

  async render() {
    try {
      const productsResult = await listShareProducts();
      const accountsResult = await listShareAccounts();
      const products = Array.isArray(productsResult) ? productsResult : [];
      const accounts = Array.isArray(accountsResult) ? accountsResult : [];
      const totalShares = accounts.reduce((sum, account) => sum + Number(account.shares_held || 0), 0);
      const totalValue = accounts.reduce((sum, account) => sum + Number(account.total_value || 0), 0);
      const averageShares = accounts.length ? totalShares / accounts.length : 0;

      const productCards = products.slice(0, 4).map(product => `
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h6 class="mb-1">${product.name || 'Share Product'}</h6>
              <p class="text-muted mb-2">${product.code || 'N/A'}</p>
              <p class="small mb-0">Nominal value: ${formatCurrency(product.nominal_value || 0)}</p>
            </div>
          </div>
        </div>
      `).join('');

      const tableRows = accounts.map(account => `
        <tr>
          <td>${account.account_no || 'N/A'}</td>
          <td>${formatNumber(account.shares_held || 0)}</td>
          <td>${formatCurrency(account.total_value || 0)}</td>
        </tr>
      `).join('');

      return `
        <section>
          <div class="page-header">
            <div>
              <p class="eyebrow-text mb-1">Your ownership</p>
              <h2 class="mb-0">Shares</h2>
            </div>
            <a href="#dashboard" class="btn btn-outline-secondary btn-sm">Back</a>
          </div>
          ${renderStats([
            { label: 'Share products', value: products.length, icon: '🧩' },
            { label: 'Share accounts', value: accounts.length, icon: '📊' },
            { label: 'Total shares', value: formatNumber(totalShares), icon: '📈' },
            { label: 'Total value', value: formatCurrency(totalValue), icon: '💎' }
          ])}

          <div class="row g-3 mb-4">
            <div class="col-lg-4">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title mb-3">Share snapshot</h5>
                  <div class="d-grid gap-2">
                    <div class="insight-pill"><span>Average shares per account</span><strong>${formatNumber(averageShares)}</strong></div>
                    <div class="insight-pill"><span>Portfolio value</span><strong>${formatCurrency(totalValue)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="card shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title">Buy shares</h5>
                  <form id="purchaseForm">
                    <div class="row g-2">
                      <div class="col-md-3">
                        <label class="form-label">Product</label>
                        <select class="form-select" id="shareProductId" required>
                          <option value="">Select product</option>
                          ${products.map(product => `<option value="${product.id || ''}">${product.name || 'Product'} (${product.code || 'N/A'})</option>`).join('')}
                        </select>
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Units</label>
                        <input type="number" class="form-control" id="shareUnits" min="1" required>
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Price per share</label>
                        <input type="number" class="form-control" id="sharePrice" min="0" step="0.01" required>
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Payment channel</label>
                        <input class="form-control" id="shareChannel" placeholder="MPESA, CASH" required>
                      </div>
                      <div class="col-12 d-flex align-items-end">
                        <button class="btn btn-success w-100">Purchase shares</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h5 class="card-title">Share products</h5>
              <div class="row g-3">${productCards || '<div class="col-12"><p class="text-muted mb-0">No share products available yet.</p></div>'}</div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Share accounts</h5>
              ${renderTable(['Account No', 'Shares Held', 'Value'], tableRows || '<tr><td colspan="3">No share accounts found</td></tr>')}
            </div>
          </div>
        </section>
      `;
    } catch (error) {
      return renderError(error.message);
    }
  },

  bindEvents() {
    document.getElementById('purchaseForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      showLoading(button);
      try {
        const payload = {
          product_id: document.getElementById('shareProductId').value,
          num_shares: Number(document.getElementById('shareUnits').value),
          price_per_share: Number(document.getElementById('sharePrice').value),
          reference: `share-${Date.now()}`,
          payment_channel_code: document.getElementById('shareChannel').value
        };
        await purchaseShares(payload);
        showToast('Share purchase submitted successfully', 'success');
        setTimeout(() => window.location.hash = '#shares', 500);
      } catch (error) {
        showToast(error.message, 'danger');
      } finally {
        hideLoading(button, 'Purchase shares');
      }
    });
  }
};
