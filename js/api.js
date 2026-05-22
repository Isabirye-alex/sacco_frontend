// Backend API configuration
const API_BASE_URL = localStorage.getItem('api_base_url') || 'http://localhost:8080/api/v1';

export function setCurrentMemberId(memberId) {
    localStorage.setItem('current_member_id', memberId);
}

export function getCurrentMemberId() {
    return localStorage.getItem('current_member_id');
}

export function isUserLoggedIn() {
    return localStorage.getItem('current_member_id') !== null;
}

export function logout() {
    localStorage.removeItem('current_member_id');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('member_data');
}

export function setApiBaseUrl(baseUrl) {
    localStorage.setItem('api_base_url', baseUrl);
}

// API endpoints - mapped to real backend
export const endpoints = {
    // Primary endpoint - returns member with all nested data
    member: (id) => `${API_BASE_URL}/members/member/${id}`,
    // Transactions endpoints for detailed transaction history
    savingsTransactions: (id) => `${API_BASE_URL}/savings/transactions?member_id=${id}`,
    loansTransactions: (id) => `${API_BASE_URL}/loans/repayments?member_id=${id}`,
};

// Shared Fetch Engine
export async function apiFetch(url, options = {}) {
    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API fetch error: ${error.message}`);
        throw error;
    }
}


// Data Transformation Functions

export function transformMemberToDashboard(memberData) {
    if (!memberData) return {};

    // Safely aggregate data fields out of nested backend collections
    const totalSavings = Array.isArray(memberData.savings_accounts)
        ? memberData.savings_accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
        : (memberData.total_savings || 0);

    const totalShares = Array.isArray(memberData.share_accounts)
        ? memberData.share_accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
        : (memberData.shares_balance || 0);

    const activeLoans = Array.isArray(memberData.loans)
        ? memberData.loans.reduce((sum, ln) => sum + parseFloat(ln.outstanding_balance || 0), 0)
        : (memberData.active_loan_balance || 0);

    // Extract recent transactions from savings accounts
    const recentTransactions = Array.isArray(memberData.savings_accounts)
        ? memberData.savings_accounts
            .flatMap(acc => acc.transactions || [])
            .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
            .slice(0, 4)
            .map(tx => ({
                ...tx,
                type: tx.transaction_type || 'deposit',
                amount: tx.amount,
                date: tx.created_at || tx.date,
                description: `${tx.transaction_type || 'Deposit'} - ${tx.reference || 'N/A'}`
            }))
        : [];

    return {
        totalBalance: totalSavings,
        changeText: '+UGX 0 this month',
        sharesValue: totalShares,
        activeLoan: activeLoans,
        dividend: memberData.last_dividend || 0,
        recentTransactions: recentTransactions
    };
}

export function transformMemberToProfile(memberData) {
    if (!memberData) return {};

    const calculatedSavings = Array.isArray(memberData.savings_accounts)
        ? memberData.savings_accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0)
        : 0;

    const calculatedShares = Array.isArray(memberData.share_accounts)
        ? memberData.share_accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0)
        : 0;

    let displayDate = 'Date unavailable';
    if (memberData.joined_date) {
        displayDate = new Date(memberData.joined_date).toLocaleDateString();
    }

    const full_name = `${memberData.first_name || ''} ${memberData.middle_name || ''} ${memberData.last_name || ''}`
        .replace(/\s+/g, ' ')
        .trim();

    return {
        name: full_name || 'Member Name',
        memberId: memberData.member_no ? `Member #${memberData.member_no}` : 'N/A',
        joinedOn: displayDate,
        email: memberData.email || 'N/A',
        phone: memberData.phone_primary || 'N/A',
        nationalId: memberData.national_id || 'N/A',
        membershipClass: (memberData.status && memberData.status.status) || 'Member',
        gender: (memberData.gender && memberData.gender.gender) || 'N/A',
        sharesValue: calculatedShares,
        totalSavings: calculatedSavings,
        guarantors: '0 active'
    };
}

export function transformMemberToSavings(memberData) {
    if (!memberData) return {};

    const savingsAccounts = Array.isArray(memberData.savings_accounts)
        ? memberData.savings_accounts.map(account => ({
            ...account,
            name: account.product?.product_name || 'Savings Account',
            accountNumber: account.account_no,
            number: account.account_no,
            balance: account.balance || 0,
            progress: 65, // Default progress - can be enhanced with product targets
            amount: account.balance || 0
        }))
        : [];

    const totalBalance = savingsAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);

    return {
        balance: totalBalance,
        totalBalance: totalBalance,
        accounts: savingsAccounts,
        accountsList: savingsAccounts
    };
}

export function transformMemberToLoans(memberData) {
    if (!memberData) return {};

    const loans = Array.isArray(memberData.loans) ? memberData.loans : [];
    const activeLoan = loans.length > 0 ? loans[0] : {};

    // Transform the loan data to match frontend expectations
    const transformedLoan = {
        ...activeLoan,
        outstanding_balance: activeLoan.outstanding_balance || 0,
        outstandingBalance: activeLoan.outstanding_balance || 0,
        type: activeLoan.product?.product_name || activeLoan.type || 'Loan',
        name: activeLoan.product?.product_name || 'Business development loan',
        monthly_installment: activeLoan.monthly_installment || 0,
        monthlyInstallment: activeLoan.monthly_installment || 0,
        interest_rate: activeLoan.interest_rate || 0,
        repayment_progress: 45, // Calculate from schedule if available
        progress: 45,
        payments_left: activeLoan.payments_left || 0,
        paymentsLeft: activeLoan.payments_left || 0,
        schedule: Array.isArray(activeLoan.repayment_schedule)
            ? activeLoan.repayment_schedule.map(item => ({
                ...item,
                date: item.due_date || item.date,
                dueDate: item.due_date || item.date,
                principal: item.principal_amount || item.principal || 0,
                amount: item.principal_amount || item.principal || 0,
                interest: item.interest_amount || item.interest || 0,
                status: item.status || 'Upcoming'
            }))
            : []
    };

    return {
        ...transformedLoan,
        active_loans: [transformedLoan],
        currentLoan: transformedLoan
    };
}

export function transformMemberToTransactions(memberData) {
    if (!memberData) return [];

    // Collect all transactions from savings and loans
    const savingsTransactions = Array.isArray(memberData.savings_accounts)
        ? memberData.savings_accounts.flatMap(acc =>
            Array.isArray(acc.transactions)
                ? acc.transactions.map(tx => ({
                    ...tx,
                    type: tx.transaction_type || 'deposit',
                    amount: tx.amount,
                    date: tx.created_at || tx.date,
                    description: `Savings - ${tx.reference || tx.transaction_type}`,
                    reference: tx.reference || tx.id,
                    category: 'savings'
                }))
                : []
        )
        : [];

    const loanTransactions = Array.isArray(memberData.loans)
        ? memberData.loans.flatMap(loan =>
            Array.isArray(loan.repayments)
                ? loan.repayments.map(rp => ({
                    ...rp,
                    type: 'loan payment',
                    amount: rp.amount,
                    date: rp.payment_date || rp.date,
                    description: `Loan Payment - ${loan.product?.product_name || 'Loan'}`,
                    reference: rp.reference || rp.id,
                    category: 'loan'
                }))
                : []
        )
        : [];

    // Combine and sort by date (newest first)
    const allTransactions = [...savingsTransactions, ...loanTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return allTransactions;
}

// Screen-Specific Fetch Functions

export async function fetchMemberData() {
    const memberId = getCurrentMemberId();
    if (!memberId) {
        throw new Error('User not logged in');
    }
    const url = endpoints.member(memberId);
    return await apiFetch(url);
}

export async function fetchDashboardSummary() {
    const memberData = await fetchMemberData();
    return transformMemberToDashboard(memberData);
}

export async function fetchSavings() {
    const memberData = await fetchMemberData();
    return transformMemberToSavings(memberData);
}

export async function fetchLoans() {
    const memberData = await fetchMemberData();
    return transformMemberToLoans(memberData);
}

export async function fetchTransactions() {
    const memberData = await fetchMemberData();
    return transformMemberToTransactions(memberData);
}

export async function fetchProfile() {
    const memberData = await fetchMemberData();
    return transformMemberToProfile(memberData);
}

// Form Submission Functions

export async function submitDeposit(amount, accountId, description = '') {
    const url = `${API_BASE_URL}/savings/transactions`;
    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            savings_account_id: accountId,
            amount: parseFloat(amount),
            transaction_type: 'deposit',
            reference: description,
            created_at: new Date().toISOString()
        })
    });
}

export async function submitWithdraw(amount, accountId, description = '') {
    const url = `${API_BASE_URL}/savings/transactions`;
    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            savings_account_id: accountId,
            amount: parseFloat(amount),
            transaction_type: 'withdrawal',
            reference: description,
            created_at: new Date().toISOString()
        })
    });
}

export async function submitTransfer(fromAccountId, toMemberId, amount, description = '') {
    const url = `${API_BASE_URL}/savings/transactions`;
    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            from_account_id: fromAccountId,
            to_member_id: toMemberId,
            amount: parseFloat(amount),
            transaction_type: 'transfer',
            reference: description,
            created_at: new Date().toISOString()
        })
    });
}

export async function submitLoanApplication(productId, amount, guarantors = []) {
    const url = `${API_BASE_URL}/loans/applications`;
    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            member_id: getCurrentMemberId(),
            loan_product_id: productId,
            amount_requested: parseFloat(amount),
            guarantors: guarantors,
            created_at: new Date().toISOString()
        })
    });
}

export async function submitLoanPayment(loanId, amount, paymentMethod = 'cash') {
    const url = `${API_BASE_URL}/loans/repayments`;
    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            loan_id: loanId,
            amount: parseFloat(amount),
            payment_method: paymentMethod,
            payment_date: new Date().toISOString()
        })
    });
}

export async function submitProfileUpdate(profileData) {
    const url = `${API_BASE_URL}/members/member/${getCurrentMemberId()}`;
    return await apiFetch(url, {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });
}

export async function fetchLoanProducts() {
    const url = `${API_BASE_URL}/loans/products`;
    return await apiFetch(url);
}

export async function fetchSavingsProducts() {
    const url = `${API_BASE_URL}/savings/products`;
    return await apiFetch(url);
}

// Authentication Functions

export async function loginUser(email, password) {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });

    // Store user ID and auth token
    if (response.user_id || response.id) {
        setCurrentMemberId(response.user_id || response.id);
        if (response.auth_token) {
            localStorage.setItem('auth_token', response.auth_token);
        }
    }

    return response;
}

export async function registerMember(memberData) {
    const url = `${API_BASE_URL}/members/`;
    const response = await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify(memberData)
    });

    // Store member data temporarily for password setup
    if (response.id) {
        localStorage.setItem('temp_member_data', JSON.stringify(response));
    }

    return response;
}

export async function setMemberPassword(passwordData) {
    const url = `${API_BASE_URL}/users/`;
    const response = await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify(passwordData)
    });

    if (response.member_id) {
        setCurrentMemberId(response.member_id);
    }

    return response;
}

export function getTempMemberData() {
    const data = localStorage.getItem('temp_member_data');
    return data ? JSON.parse(data) : null;
}

export function clearTempMemberData() {
    localStorage.removeItem('temp_member_data');
}