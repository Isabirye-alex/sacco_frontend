// Backend API configuration
const API_BASE_URL = 'http://localhost:8080/api/v1';

export function setAuthToken(auth_token) {
    localStorage.setItem('auth_token', auth_token);
}

export function getAuthToken() {
    return localStorage.getItem('auth_token');
}

export function isUserLoggedIn() {
    return localStorage.getItem('auth_token') !== null;
}

export function logout() {
    localStorage.removeItem('auth_token');
}

// Global member data cache
let cachedMemberData = null;

export function setCachedMemberData(memberData) {
    cachedMemberData = memberData;
    // Also store member_id for API calls that need it
    if (memberData?.id || memberData?.member_id) {
        localStorage.setItem('current_member_id', memberData.id || memberData.member_id);
    }
}

export function getCachedMemberData() {
    return cachedMemberData;
}

export function getCurrentMemberId() {
    return cachedMemberData?.id || cachedMemberData?.member_id || localStorage.getItem('current_member_id');
}

export function setCurrentMemberId(memberId) {
    localStorage.setItem('current_member_id', memberId);
}

export function getMemberField(fieldName) {
    return cachedMemberData?.[fieldName];
}

export function clearMemberId() {
    cachedMemberData = null;
    localStorage.removeItem('current_member_id');
}


// API endpoints - mapped to real backend
export const endpoints = {
    // Member endpoint - token is sent in Authorization header, member_id extracted by backend
    member: () => `${API_BASE_URL}/members/member/`,
    // Transactions endpoints for detailed transaction history
    savingsTransactions: () => `${API_BASE_URL}/savings/transactions`,
    loansTransactions: () => `${API_BASE_URL}/loans/repayments`,
};

// Shared Fetch Engine
export async function apiFetch(url, options = {}) {
    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    // Add Authorization header with Bearer token if available
    const token = getAuthToken();
    if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

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

    // 1. Safely aggregate savings balance out of the savings_accounts array
    const totalSavings = Array.isArray(memberData.savings_accounts) && memberData.savings_accounts.length > 0
        ? memberData.savings_accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
        : parseFloat(memberData.total_savings || 0);

    // 2. Safely aggregate shares balance 
    const totalShares = Array.isArray(memberData.share_accounts) && memberData.share_accounts.length > 0
        ? memberData.share_accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
        : parseFloat(memberData.shares_balance || 0);

    // 3. Safely aggregate outstanding loan balance
    const activeLoans = Array.isArray(memberData.loans) && memberData.loans.length > 0
        ? memberData.loans.reduce((sum, ln) => sum + parseFloat(ln.outstanding_balance || 0), 0)
        : parseFloat(memberData.active_loan_balance || 0);

    // 4. Flatten and extract recent transactions safely
    const recentTransactions = Array.isArray(memberData.savings_accounts)
        ? memberData.savings_accounts
            .flatMap(acc => acc.transactions || [])
            .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
            .slice(0, 4)
            .map(tx => ({
                ...tx,
                type: tx.transaction_type || 'deposit',
                amount: parseFloat(tx.amount || 0),
                date: tx.created_at || tx.date,
                description: `${tx.transaction_type || 'Deposit'} - ${tx.reference || 'N/A'}`
            }))
        : [];

    return {
        totalBalance: totalSavings,
        changeText: '+UGX 0 this month',
        sharesValue: totalShares,
        activeLoan: activeLoans,
        dividend: parseFloat(memberData.last_dividend || 0),
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
        guarantors: '0 active',

        branch_id: memberData.branch_id || memberData.branch?.id || null
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
    const token = getAuthToken();
    if (!token) {
        throw new Error('User not logged in');
    }
    const url = endpoints.member();
    const memberData = await apiFetch(url);
    // Cache the member data globally for access in other parts of the app
    setCachedMemberData(memberData);
    return memberData;
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

export async function submitDeposit(amount, accountId, reference = '', paymentMethod = 'CASH') {
    if (!accountId) throw new Error('Account ID is required');
    if (!amount || parseFloat(amount) <= 0) throw new Error('Amount must be greater than 0');

    // Make sure this points to your specific deposit processing route
    const url = `${API_BASE_URL}/savings/deposit`; 

    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            account_id: accountId,                        // Matches backend mapping
            amount: parseFloat(amount),
            reference: reference || `DEP-${Date.now()}`,  // Ensures unique reference tracking
            description: `Savings Deposit via ${paymentMethod}`,
            transaction_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            
            // Optional: Send payment method details if your backend dynamically
            // maps GL Accounts (e.g., Cash vs. Mobile Money GL)
            payment_method: paymentMethod 
        })
    });
}

export async function submitWithdraw(amount, accountId, description = '') {
    if (!accountId) throw new Error('Account ID is required');
    if (!amount || parseFloat(amount) <= 0) throw new Error('Amount must be greater than 0');

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
    if (!fromAccountId) throw new Error('From Account ID is required');
    if (!toMemberId) throw new Error('To Member ID is required');
    if (!amount || parseFloat(amount) <= 0) throw new Error('Amount must be greater than 0');

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

export async function submitLoanApplication(formData) {
    const url = `${API_BASE_URL}/loans/applications`;

    return await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            // 1. Core structural foreign keys
            member_id: getCurrentMemberId(),
            branch_id: formData.branch_id,
            product_id: formData.productId,

            // 2. Map financial metrics to match backend schema names exactly
            applied_amount: parseFloat(formData.amount || 0),
            purpose: formData.purpose || 'Business development',
            term_months: formData.termMonths,
            status: 'DRAFT', // Matches your default backend enum value

            // 3. Match backend naming convention for date logging
            applied_date: new Date().toISOString().split('T')[0], // Outputs format: YYYY-MM-DD

            // 4. Preserve guarantor collection array structures
            guarantors: formData.guarantors || []
        })
    });
}
export async function submitLoanPayment(loanId, amount, paymentMethod = 'cash') {
    if (!loanId) throw new Error('Loan ID is required');
    if (!amount || parseFloat(amount) <= 0) throw new Error('Amount must be greater than 0');

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
    const url = `${API_BASE_URL}/auth/signin`;
    const response = await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });

    // Extract the access token directly from the root response
    if (response?.access_token) {
        localStorage.setItem('auth_token', response.access_token);
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

export function clearAllMemberData() {
    localStorage.removeItem('temp_member_data');
    localStorage.removeItem('current_member_id');
    clearMemberId();
}