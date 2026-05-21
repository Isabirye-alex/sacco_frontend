import { fetchLoans } from '../api.js';
import { formatCurrency } from '../helpers.js';

function renderSchedule(schedule = []) {
    const body = document.getElementById('loan-schedule-body');
    if (!body) return;

    if (!schedule.length) {
        body.innerHTML = '<div style="padding:12px 18px;color:var(--color-text-secondary);font-size:13px;">No repayment schedule available.</div>';
        return;
    }

    body.innerHTML = schedule
        .map((item, index) => {
            const paid = String(item.status || '').toLowerCase() === 'paid';
            return `
        <div class="sch-row">
          <div class="sch-num ${paid ? 'paid' : ''}">${paid ? '<i class="ti ti-check" style="font-size:10px" aria-hidden="true"></i>' : index + 1}</div>
          <div class="sch-date">${item.date || item.dueDate || ''}</div>
          <span>${formatCurrency(item.principal ?? item.amount ?? 0)}</span>
          <span>${formatCurrency(item.interest ?? 0)}</span>
          <span class="sch-status ${paid ? 'status-paid' : 'status-upcoming'}">${item.status || 'Upcoming'}</span>
        </div>`;
        })
        .join('');
}

function renderLoans(data = {}) {
    const loan = data.active_loans?.[0] || data.currentLoan || {};
    const schedule = loan.schedule || data.schedule || [];

    document.getElementById('loan-outstanding').textContent = formatCurrency(loan.outstanding_balance ?? loan.outstandingBalance ?? loan.balance ?? 0);
    document.getElementById('loan-type').textContent = loan.type || loan.name || 'Business development loan';
    document.getElementById('loan-principal-label').textContent = formatCurrency(loan.monthly_installment ?? loan.monthlyInstallment ?? 0);
    document.getElementById('loan-interest-rate').textContent = (loan.interest_rate ? `${loan.interest_rate}% p.a.` : '0% p.a.');
    document.querySelector('.repay-bar-fill').style.width = `${Math.min(100, Math.max(0, loan.repayment_progress ?? loan.progress ?? 0))}%`;
    document.querySelector('.repay-label').textContent = `${loan.repayment_progress ?? 0}% repaid · ${loan.payments_left ?? loan.paymentsLeft ?? 0} payments left`;

    renderSchedule(schedule);
}

export async function loadLoans() {
    const response = await fetchLoans();
    renderLoans(response);
}
