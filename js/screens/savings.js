import { fetchSavings } from '../api.js';
import { formatCurrency } from '../helpers.js';

function renderAccounts(accounts = []) {
    const list = document.getElementById('accounts-list');
    if (!list) return;

    if (!accounts.length) {
        list.innerHTML = '<div style="color:var(--color-text-secondary);font-size:13px;">No savings accounts found.</div>';
        return;
    }

    list.innerHTML = accounts
        .map(account => {
            const fillWidth = Math.min(100, Math.max(0, account.progress ?? 0));
            return `
        <div class="acc-card">
          <div class="acc-icon" style="background:#eaf3de;color:#3b6d11;"><i class="ti ti-building-bank" aria-hidden="true"></i></div>
          <div class="acc-info">
            <div class="acc-name">${account.name || 'Savings account'}</div>
            <div class="acc-num">${account.accountNumber || account.number || 'ACC-00000-000'}</div>
            <div class="account-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width:${fillWidth}%;"></div>
              </div>
              <div class="progress-label">${fillWidth}% of annual target</div>
            </div>
          </div>
          <div class="acc-bal">
            <div class="acc-bal-num">${formatCurrency(account.balance ?? account.amount ?? 0)}</div>
            <div class="acc-bal-label">UGX</div>
          </div>
        </div>`;
        })
        .join('');
}

function renderSavings(data = {}) {
    document.getElementById('savings-total-balance').textContent = formatCurrency(data.balance ?? data.totalBalance ?? 0);
    document.getElementById('savings-interest-rate').textContent = 'Earning 8.5% p.a. interest';

    renderAccounts(data.accounts || data.accountsList || []);
}

export async function loadSavings() {
    const response = await fetchSavings();
    renderSavings(response);
}
