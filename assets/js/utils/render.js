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
    <div class="col-md-6">
      <div class="card stats-card shadow-sm">
        <div class="card-body">
          <h6 class="text-muted">${item.label}</h6>
          <h3>${item.value}</h3>
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
      <table class="table table-sm">
        <thead>
          <tr>${head}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}
