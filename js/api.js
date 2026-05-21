// Backend API configuration
const API_BASE_URL = localStorage.getItem('api_base_url') || 'http://localhost:8080/api/v1';
const CURRENT_MEMBER_ID = localStorage.getItem('current_member_id') || '19b0868f-fa2d-40f2-a798-b039f192ca07';

export function setCurrentMemberId(memberId) {
    localStorage.setItem('current_member_id', memberId);
}

export function getCurrentMemberId() {
    return localStorage.getItem('current_member_id') || CURRENT_MEMBER_ID;
}

export function setApiBaseUrl(baseUrl) {
    localStorage.setItem('api_base_url', baseUrl);
}

// API endpoints - mapped to real backend
export const endpoints = {
    member: (id = getCurrentMemberId()) => `${API_BASE_URL}/members/member/${id}`,
    savings: (id = getCurrentMemberId()) => `${API_BASE_URL}/savings?member_id=${id}`,
    loans: (id = getCurrentMemberId()) => `${API_BASE_URL}/loans?member_id=${id}`,
    ledger: (id = getCurrentMemberId()) => `${API_BASE_URL}/ledger?member_id=${id}`,
    summary: (id = getCurrentMemberId()) => `${API_BASE_URL}/members/${id}`,
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
            console.warn(`API request failed (${response.status}): ${errorText}, fallback to mock data.`);
            return getFallbackMockData(url);
        }

        return await response.json();
    } catch (error) {
        console.warn(`API fetch error: ${error.message}, fallback to mock data.`);
        return getFallbackMockData(url);
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

    return {
        totalBalance: totalSavings,
        changeText: '+UGX 0 this month',
        sharesValue: totalShares,
        activeLoan: activeLoans,
        dividend: memberData.last_dividend || 0,
        recentTransactions: memberData.recent_transactions || []
    };
}
ini
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

// Screen-Specific Executions
export async function fetchDashboardSummary() {
    const url = endpoints.summary();
    const memberData = await apiFetch(url);
    return transformMemberToDashboard(memberData);
}

export async function fetchSavings() {
    const url = endpoints.savings();
    return await apiFetch(url);
}

export async function fetchLoans() {
    const url = endpoints.loans();
    return await apiFetch(url);
}

export async function fetchTransactions() {
    const url = endpoints.ledger();
    const ledgerData = await apiFetch(url);
    return Array.isArray(ledgerData) ? ledgerData : ledgerData.transactions || [];
}

export async function fetchProfile() {
    const url = endpoints.member();
    const memberData = await apiFetch(url);
    return transformMemberToProfile(memberData);
}