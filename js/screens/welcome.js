import { fetchLoanProducts, fetchSavingsProducts } from '../api.js';
import { formatCurrency } from '../helpers.js';

export async function loadWelcome() {
    try {
        // Fetch products
        const [loanProducts, savingsProducts] = await Promise.all([
            fetchLoanProducts().catch(() => []),
            fetchSavingsProducts().catch(() => [])
        ]);

        // Display products
        renderSavingsProducts(savingsProducts);
        renderLoanProducts(loanProducts);
    } catch (error) {
        console.error('Error loading welcome screen:', error);
    }
}

function renderSavingsProducts(products) {
    const container = document.getElementById('savings-products');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #999;">
                <p>No savings products available at the moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products
        .map(product => `
            <div class="product-card">
                <div class="product-header">
                    <h3 class="product-name">${product.name || 'Savings Product'}</h3>
                    <span class="product-code">${product.code || ''}</span>
                </div>
                <p class="product-description">${product.description || 'Secure savings plan'}</p>
                <div class="product-details">
                    <div class="product-detail-row">
                        <span class="product-detail-label">Interest Rate:</span>
                        <span class="product-detail-value">${product.interest_rate_pa || 0}% p.a.</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Min Opening:</span>
                        <span class="product-detail-value">${formatCurrency(product.min_opening_balance || 0)}</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Min Balance:</span>
                        <span class="product-detail-value">${formatCurrency(product.min_balance || 0)}</span>
                    </div>
                    ${product.max_balance ? `
                    <div class="product-detail-row">
                        <span class="product-detail-label">Max Balance:</span>
                        <span class="product-detail-value">${formatCurrency(product.max_balance)}</span>
                    </div>
                    ` : ''}
                    <div class="product-detail-row">
                        <span class="product-detail-label">Withdrawals:</span>
                        <span class="product-detail-value">${product.withdrawal_allowed ? '✓ Allowed' : '✗ Not Allowed'}</span>
                    </div>
                    ${product.lock_period_days > 0 ? `
                    <div class="product-detail-row">
                        <span class="product-detail-label">Lock Period:</span>
                        <span class="product-detail-value">${product.lock_period_days} days</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `)
        .join('');
}

function renderLoanProducts(products) {
    const container = document.getElementById('loan-products');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #999;">
                <p>No loan products available at the moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products
        .map(product => `
            <div class="product-card">
                <div class="product-header">
                    <h3 class="product-name">${product.name || 'Loan Product'}</h3>
                    <span class="product-code">${product.code || ''}</span>
                </div>
                <p class="product-description">${product.description || 'Flexible loan option'}</p>
                <div class="product-details">
                    <div class="product-detail-row">
                        <span class="product-detail-label">Interest Rate:</span>
                        <span class="product-detail-value">${product.interest_rate_pa || 0}% p.a.</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Loan Amount:</span>
                        <span class="product-detail-value">${formatCurrency(product.min_amount || 0)} - ${formatCurrency(product.max_amount || 0)}</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Term:</span>
                        <span class="product-detail-value">${product.min_term_months || 0} - ${product.max_term_months || 0} months</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Repayment:</span>
                        <span class="product-detail-value">${product.repayment_frequency || 'N/A'}</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Processing Fee:</span>
                        <span class="product-detail-value">${product.processing_fee_pct || 0}%</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Guarantors Required:</span>
                        <span class="product-detail-value">${product.min_guarantors || 0}</span>
                    </div>
                    <div class="product-detail-row">
                        <span class="product-detail-label">Collateral:</span>
                        <span class="product-detail-value">${product.requires_collateral ? '✓ Required' : '✗ Not Required'}</span>
                    </div>
                </div>
            </div>
        `)
        .join('');
}
