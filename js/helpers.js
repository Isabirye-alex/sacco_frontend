export function formatCurrency(value) {
    const amount = Number(value);
    if (Number.isNaN(amount)) {
        return String(value || '0');
    }

    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.valueOf())) {
        return String(value || '');
    }

    return date.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function transactionTypeMeta(type) {
    const normalized = String(type || '').toLowerCase();

    switch (normalized) {
        case 'withdrawal':
        case 'withdraw':
            return { badge: 'Withdrawal', badgeClass: 'status-due', icon: 'ti-arrow-bar-up', iconClass: 'wit' };
        case 'loan':
        case 'loan payment':
        case 'loan payment':
            return { badge: 'Loan payment', badgeClass: 'status-upcoming', icon: 'ti-cash', iconClass: 'loa' };
        case 'dividend':
            return { badge: 'Dividend', badgeClass: 'status-paid', icon: 'ti-check', iconClass: 'dep' };
        default:
            return { badge: 'Deposit', badgeClass: 'status-paid', icon: 'ti-arrow-bar-down', iconClass: 'dep' };
    }
}

export function initialsFromName(name) {
    if (!name) return '';
    const parts = String(name).trim().split(/\s+/);
    return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}
