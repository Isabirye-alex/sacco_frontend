import { fetchTransactions } from '../api.js';
import { formatCurrency, formatDate, transactionTypeMeta } from '../helpers.js';

let transactionsCache = [];
let activeFilter = 'all';
let activeQuery = '';

function createTransactionRow(transaction) {
    const { badge, badgeClass, icon, iconClass } = transactionTypeMeta(transaction.type);
    const amount = Number(transaction.amount ?? transaction.value ?? 0);
    const isPositive = amount >= 0;

    return `
    <div class="tx-tr">
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="tx-icon ${iconClass}" style="width:28px;height:28px;border-radius:6px;font-size:12px;"><i class="ti ${icon}" aria-hidden="true"></i></div>
        <span>${transaction.description || transaction.name || 'Transaction'}</span>
      </div>
      <span style="color:var(--color-text-secondary);">${formatDate(transaction.date)}</span>
      <span><span class="type-badge" style="background:${isPositive ? '#eaf3de' : '#fcebeb'};color:${isPositive ? '#3b6d11' : '#a32d2d'};">${badge}</span></span>
      <span style="color:var(--color-text-tertiary);font-size:11px;">${transaction.reference || transaction.ref || ''}</span>
      <span style="text-align:right;font-weight:500;color:${isPositive ? '#3b6d11' : '#a32d2d'};">${formatCurrency(amount)}</span>
    </div>`;
}

function renderTransactions(transactions = []) {
    const body = document.getElementById('transactions-table-body');
    if (!body) return;

    if (!transactions.length) {
        body.innerHTML = '<div style="padding:18px;color:var(--color-text-secondary);font-size:13px;">No transactions available.</div>';
        return;
    }

    body.innerHTML = transactions.map(createTransactionRow).join('');
}

function matchesFilter(transaction) {
    const type = String(transaction.type || transaction.category || 'deposit').toLowerCase();
    const query = activeQuery.toLowerCase();
    const text = `${transaction.description || transaction.name || ''} ${transaction.reference || transaction.ref || ''}`.toLowerCase();

    const typeMatches = activeFilter === 'all' || type === activeFilter;
    const queryMatches = !query || text.includes(query);

    return typeMatches && queryMatches;
}

function updateTransactionDisplay() {
    const filtered = transactionsCache.filter(matchesFilter);
    renderTransactions(filtered);
}

export function setTransactionsFilter(query = '', filter = 'all') {
    activeQuery = String(query || '').trim();
    activeFilter = filter || 'all';
    updateTransactionDisplay();
}

export async function loadTransactions() {
    const response = await fetchTransactions();
    transactionsCache = Array.isArray(response) ? response : response.transactions || [];
    updateTransactionDisplay();
}
