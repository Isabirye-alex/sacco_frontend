import { fetchDashboardSummary } from '../api.js';
import { formatCurrency, formatDate, transactionTypeMeta } from '../helpers.js';

function renderRecentTransactions(transactions = []) {
    const list = document.getElementById('recent-transactions');
    if (!list) return;

    if (transactions.length === 0) {
        list.innerHTML = '<div style="color:var(--color-text-secondary);font-size:13px;">No recent transactions yet.</div>';
        return;
    }

    list.innerHTML = transactions
        .slice(0, 4)
        .map(transaction => {
            const { iconClass } = transactionTypeMeta(transaction.type);
            const amount = formatCurrency(transaction.amount ?? transaction.value ?? 0);
            const positive = Number(transaction.amount ?? transaction.value) >= 0;

            return `
        <div class="tx-row">
          <div class="tx-icon ${iconClass}"><i class="ti ${transaction.type === 'withdrawal' ? 'ti-arrow-bar-up' : 'ti-arrow-bar-down'}" aria-hidden="true"></i></div>
          <div class="tx-desc">
            <div class="tx-name">${transaction.description || transaction.name || 'Transaction'}</div>
            <div class="tx-date">${formatDate(transaction.date)}</div>
          </div>
          <div class="tx-amt ${positive ? 'pos' : 'neg'}">${amount}</div>
        </div>`;
        })
        .join('');
}

function renderDashboard(data = {}) {
    document.getElementById('dashboard-total-balance').textContent = formatCurrency(data.totalBalance ?? 0);
    document.getElementById('dashboard-change-text').textContent = data.changeText || '+0 this month';
    document.getElementById('dashboard-shares-value').textContent = formatCurrency(data.sharesValue ?? 0);
    document.getElementById('dashboard-active-loan').textContent = formatCurrency(data.activeLoan ?? 0);
    document.getElementById('dashboard-dividend').textContent = formatCurrency(data.dividend ?? 0);

    renderRecentTransactions(data.recentTransactions || []);
}

export async function loadDashboard() {
    const response = await fetchDashboardSummary();
    renderDashboard(response);
}
