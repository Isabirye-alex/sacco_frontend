function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(value, minimumFractionDigits = 0) {
  return new Intl.NumberFormat('en-KE', {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits > 0 ? 2 : 0
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function renderError(message) {
  return `
    <section>
      <div class="card shadow-sm border-warning">
        <div class="card-body">
          <h5 class="card-title text-warning">Notice</h5>
          <p class="mb-0">${message}</p>
        </div>
      </div>
    </section>
  `;
}

function renderStats(items) {
  const cards = items.map(item => `
    <div class="col-md-6 col-xl-3">
      <div class="card stats-card shadow-sm h-100">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div>
            <p class="text-muted mb-1">${item.label}</p>
            <h3 class="mb-0">${item.value}</h3>
          </div>
          ${item.icon ? `<span class="stat-icon">${item.icon}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  return `<div class="row g-3 mb-4">${cards}</div>`;
}

function renderTable(headers, rows) {
  const head = headers.map(h => `<th>${h}</th>`).join('');
  return `
    <div class="table-responsive">
      <table class="table table-sm align-middle mb-0">
        <thead>
          <tr>${head}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}
