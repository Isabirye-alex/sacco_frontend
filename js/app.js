import { loadDashboard } from './screens/dashboard.js';
import { loadSavings } from './screens/savings.js';
import { loadLoans } from './screens/loans.js';
import { loadTransactions, setTransactionsFilter } from './screens/transactions.js';
import { loadProfile } from './screens/profile.js';
import { loadWelcome } from './screens/welcome.js';
import {
    submitDeposit, submitWithdraw, submitTransfer,
    submitLoanApplication, submitLoanPayment, submitProfileUpdate,
    fetchMemberData, isUserLoggedIn, loginUser, registerMember, setMemberPassword,
    getTempMemberData, clearTempMemberData, setCurrentMemberId, fetchLoanProducts,
    fetchProfile, getCurrentUserId
} from './api.js';
import { showModal, showSuccessMessage, showErrorMessage } from './modals.js';
import {
    createDepositForm, createWithdrawForm, createTransferForm,
    createLoanApplicationForm, createLoanPaymentForm, createEditProfileForm,
    createLoginForm, createRegisterForm, createPasswordSetupForm, fetchPaymentChannels
} from './forms.js';

const screenTitles = {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    savings: 'Savings',
    loans: 'Loans',
    transactions: 'Transactions',
    profile: 'Profile',
};

const loaders = {
    welcome: loadWelcome,
    dashboard: loadDashboard,
    savings: loadSavings,
    loans: loadLoans,
    transactions: loadTransactions,
    profile: loadProfile,
};

let currentFilterType = 'all';
let currentSearchQuery = '';
let currentScreen = 'dashboard';
let memberData = null;
let isLoggedIn = false;

function showError(message) {
    console.error(message);
}

async function loadScreenTemplate(screen) {
    const screenRoot = document.getElementById('screen-root');
    if (!screenRoot) {
        return;
    }

    try {
        const response = await fetch(`screens/${screen}.html`);
        if (!response.ok) {
            throw new Error(`Unable to load screen template: ${response.statusText}`);
        }
        screenRoot.innerHTML = await response.text();

        const screenInner = screenRoot.querySelector('.screen-inner');
        if (screenInner) {
            screenInner.classList.add('active');
        }
    } catch (error) {
        console.error(error);
        screenRoot.innerHTML = `<div class="screen-error"><h2>Unable to load ${screen}</h2><p>Please serve the app from a local web server or verify the path <strong>screens/${screen}.html</strong>.</p></div>`;
    }
}

async function loadScreenData(screen) {
    const loader = loaders[screen];
    if (!loader) {
        return;
    }

    try {
        await loader();
    } catch (error) {
        console.error(`Error loading ${screen}:`, error);
    }
}

async function setActiveScreen(screen) {
    currentScreen = screen;

    // Hide sidebar on welcome screen
    const sidebar = document.getElementById('sidebar');
    if (screen === 'welcome') {
        sidebar.style.display = 'none';
        document.querySelector('.topbar').style.display = 'none';
    } else {
        sidebar.style.display = 'block';
        document.querySelector('.topbar').style.display = 'flex';
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screen);
    });

    const title = screenTitles[screen] || 'Dashboard';
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = title;
    }

    const searchBar = document.querySelector('.topbar-search');
    if (searchBar) {
        searchBar.style.display = screen === 'transactions' ? 'flex' : 'none';
    }

    await loadScreenTemplate(screen);
    attachScreenHandlers();

    // AUTO-CLOSE SIDEBAR
    if (sidebar) {
        sidebar.classList.remove('expanded');
    }

    // Setup welcome screen authentication handlers
    if (screen === 'welcome') {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');

        if (loginBtn) {
            loginBtn.removeEventListener('click', showLoginForm);
            loginBtn.addEventListener('click', showLoginForm);
        }

        if (registerBtn) {
            registerBtn.removeEventListener('click', showRegisterForm);
            registerBtn.addEventListener('click', showRegisterForm);
        }
    }

    await loadScreenData(screen).catch(error => showError(`Unable to load ${screen}: ${error.message}`));
}

function attachScreenHandlers() {
    document.querySelectorAll('.screen [data-screen]').forEach(item => {
        item.addEventListener('click', event => {
            const targetScreen = event.currentTarget.dataset.screen;
            if (targetScreen) {
                setActiveScreen(targetScreen);
            }
        });
    });

    document.querySelectorAll('.filter-chip[data-type]').forEach(chip => {
        chip.addEventListener('click', () => {
            currentFilterType = chip.dataset.type || 'all';

            document.querySelectorAll('.filter-chip').forEach(item => {
                item.classList.toggle('active', item === chip);
            });

            setTransactionsFilter(currentSearchQuery, currentFilterType);
        });
    });

    // Handle action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', async () => {
            const action = button.dataset.action;
            await handleAction(action);
        });
    });
}

async function handleAction(action) {
    try {
        if (!memberData) {
            memberData = await fetchMemberData();
        }

        const savingsAccounts = memberData.savings_accounts || [];
        const loans = memberData.loans || [];

        switch (action) {
            case 'deposit':
                showDepositForm(savingsAccounts);
                break;
            case 'withdraw':
                showWithdrawForm(savingsAccounts);
                break;
            case 'transfer':
                showTransferForm(savingsAccounts);
                break;
            case 'apply-loan':
                showLoanApplicationForm();
                break;
            case 'pay-bill':
                showPayBillForm(loans);
                break;
            case 'statement':
                showStatementOptions();
                break;
            case 'edit-profile':
                showEditProfileForm();
                break;
            default:
                console.log('Action not implemented:', action);
        }
    } catch (error) {
        showErrorMessage(`Error: ${error.message}`);
    }
}

function showDepositForm(accounts) {
    if (accounts.length === 0) {
        showErrorMessage('No savings accounts found');
        return;
    }

    // Fetch payment channels
    fetchPaymentChannels()
        .then(paymentChannelsResponse => {
            const paymentChannels = Array.isArray(paymentChannelsResponse) ? paymentChannelsResponse : (paymentChannelsResponse.data || []);
            const { element, getFormData } = createDepositForm(accounts, paymentChannels);

            showModal('Make a Deposit', element, [
                {
                    label: 'Cancel',
                    onClick: () => document.querySelector('.modal-overlay')?.remove()
                },
                {
                    label: 'Submit',
                    primary: true,
                    onClick: async () => {
                        const data = getFormData();
                        if (!data.accountId || !data.amount || parseFloat(data.amount) <= 0) {
                            showErrorMessage('Please fill in all required fields');
                            return;
                        }

                        try {
                            const userId = getCurrentUserId();
                            if (!userId) {
                                showErrorMessage('User not logged in');
                                return;
                            }
                            await submitDeposit(data.amount, data.accountId, userId, data.reference, data.paymentChannelCode);
                            document.querySelector('.modal-overlay')?.remove();
                            showSuccessMessage('Deposit successful!');
                            memberData = null; // Refresh data
                            loadScreenData(currentScreen);
                        } catch (error) {
                            showErrorMessage(`Deposit failed: ${error.message}`);
                        }
                    }
                }
            ]);
        })
        .catch(error => {
            showErrorMessage(`Failed to load payment channels: ${error.message}`);
        });
}

function showWithdrawForm(accounts) {
    if (accounts.length === 0) {
        showErrorMessage('No savings accounts found');
        return;
    }

    const { element, getFormData } = createWithdrawForm(accounts);

    showModal('Withdraw Funds', element, [
        {
            label: 'Cancel',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        },
        {
            label: 'Submit',
            primary: true,
            onClick: async () => {
                const data = getFormData();
                if (!data.accountId || !data.amount || parseFloat(data.amount) <= 0) {
                    showErrorMessage('Please fill in all required fields');
                    return;
                }

                try {
                    await submitWithdraw(data.amount, data.accountId, data.description);
                    document.querySelector('.modal-overlay')?.remove();
                    showSuccessMessage('Withdrawal successful!');
                    memberData = null; // Refresh data
                    loadScreenData(currentScreen);
                } catch (error) {
                    showErrorMessage(`Withdrawal failed: ${error.message}`);
                }
            }
        }
    ]);
}

function showTransferForm(accounts) {
    if (accounts.length === 0) {
        showErrorMessage('No savings accounts found');
        return;
    }

    const { element, getFormData } = createTransferForm(accounts);

    showModal('Transfer Funds', element, [
        {
            label: 'Cancel',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        },
        {
            label: 'Submit',
            primary: true,
            onClick: async () => {
                const data = getFormData();
                if (!data.fromAccountId || !data.toMemberId || !data.amount || parseFloat(data.amount) <= 0) {
                    showErrorMessage('Please fill in all required fields');
                    return;
                }

                try {
                    await submitTransfer(data.fromAccountId, data.toMemberId, data.amount, data.description);
                    document.querySelector('.modal-overlay')?.remove();
                    showSuccessMessage('Transfer successful!');
                    memberData = null; // Refresh data
                    loadScreenData(currentScreen);
                } catch (error) {
                    showErrorMessage(`Transfer failed: ${error.message}`);
                }
            }
        }
    ]);
}

async function showLoanApplicationForm() {
    try {
        const products = await fetchLoanProducts();
        const user = await fetchProfile();
        console.log("Fetched User Profile Data:", user);

        const { element, getFormData } = createLoanApplicationForm(products, user);

        showModal('Apply for a Loan', element, [
            {
                label: 'Cancel',
                onClick: () => document.querySelector('.modal-overlay')?.remove()
            },
            {
                label: 'Submit',
                primary: true,
                onClick: async () => {
                    const data = getFormData();

                    // Simple validation check before shipping payload to the api
                    if (!data.productId || !data.amount || parseFloat(data.amount) <= 0) {
                        showErrorMessage('Please fill in all required fields');
                        return;
                    }

                    try {
                        // Pass the unified 'data' object matching the new API function layout
                        await submitLoanApplication(data);

                        document.querySelector('.modal-overlay')?.remove();
                        showSuccessMessage('Loan application submitted! We will review and contact you soon.');
                        memberData = null; // Flush data cache to sync new values
                        loadScreenData(currentScreen);
                    } catch (error) {
                        showErrorMessage(`Application failed: ${error.message}`);
                    }
                }
            }
        ]);
    } catch (error) {
        showErrorMessage(`Error loading loan products: ${error.message}`);
    }
}
function showPayBillForm(loans) {
    if (loans.length === 0) {
        showErrorMessage('No active loans found');
        return;
    }

    const { element, getFormData } = createLoanPaymentForm(loans);

    showModal('Make Loan Payment', element, [
        {
            label: 'Cancel',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        },
        {
            label: 'Submit',
            primary: true,
            onClick: async () => {
                const data = getFormData();
                if (!data.loanId || !data.amount || parseFloat(data.amount) <= 0) {
                    showErrorMessage('Please fill in all required fields');
                    return;
                }

                try {
                    await submitLoanPayment(data.loanId, data.amount, data.paymentMethod);
                    document.querySelector('.modal-overlay')?.remove();
                    showSuccessMessage('Payment recorded successfully!');
                    memberData = null; // Refresh data
                    loadScreenData(currentScreen);
                } catch (error) {
                    showErrorMessage(`Payment failed: ${error.message}`);
                }
            }
        }
    ]);
}

function showStatementOptions() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <button style="
                padding: 12px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
            " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                📄 Download Monthly Statement
            </button>
            <button style="
                padding: 12px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
            " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                📋 Download Passbook
            </button>
            <button style="
                padding: 12px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
            " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                🎖️ Download Membership Certificate
            </button>
        </div>
    `;

    showModal('Download Statements', content, [
        {
            label: 'Close',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        }
    ]);
}

function showEditProfileForm() {
    if (!memberData) return;

    const { element, getFormData } = createEditProfileForm(memberData);

    showModal('Edit Profile', element, [
        {
            label: 'Cancel',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        },
        {
            label: 'Save Changes',
            primary: true,
            onClick: async () => {
                const data = getFormData();

                try {
                    await submitProfileUpdate(data);
                    document.querySelector('.modal-overlay')?.remove();
                    showSuccessMessage('Profile updated successfully!');
                    memberData = null; // Refresh data
                    loadScreenData(currentScreen);
                } catch (error) {
                    showErrorMessage(`Update failed: ${error.message}`);
                }
            }
        }
    ]);
}

function attachGlobalHandlers() {
    document.querySelectorAll('[data-screen]').forEach(item => {
        item.addEventListener('click', event => {
            const targetScreen = event.currentTarget.dataset.screen;
            if (targetScreen) {
                setActiveScreen(targetScreen);
            }
        });
    });

    // UNIFIED TOGGLE LOGIC
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('expanded');
        });
    }

    const searchInput = document.querySelector('.transaction-search');
    if (searchInput) {
        searchInput.addEventListener('input', event => {
            currentSearchQuery = event.target.value.trim();
            if (currentScreen === 'transactions') {
                setTransactionsFilter(currentSearchQuery, currentFilterType);
            }
        });
    }
}

function showLoginForm() {
    const { element, getFormData } = createLoginForm();

    showModal('Login to Platform', element, [
        {
            label: 'Cancel',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        },
        {
            label: 'Login',
            primary: true,
            onClick: async () => {
                const data = getFormData();
                if (!data.email || !data.password) {
                    showErrorMessage('Please fill in all required fields');
                    return;
                }

                try {
                    const response = await loginUser(data.email, data.password);
                    // Fetch and cache member data after successful login
                    try {
                        await fetchMemberData();
                    } catch (memberError) {
                        console.warn('Could not fetch member data after login:', memberError);
                    }
                    document.querySelector('.modal-overlay')?.remove();
                    showSuccessMessage('Login successful!');
                    memberData = null; // Refresh data
                    setActiveScreen('dashboard');
                } catch (error) {
                    showErrorMessage(`Login failed: ${error.message}`);
                }
            }
        }
    ]);
}

async function showRegisterForm() {

    try {
        // 2. Fetch all dynamic lookup data concurrently from your endpoints
        const [branchesRes, gendersRes, maritalStatusesRes] = await Promise.all([
            fetch('http://localhost:8080/api/v1/organisation/branches'),
            fetch('http://localhost:8080/api/v1/members/genders'),
            fetch('http://localhost:8080/api/v1/members/marital-statuses')
        ]);

        // Check if responses are OK
        if (!branchesRes.ok) throw new Error(`Failed to load branches: ${branchesRes.statusText}`);
        if (!gendersRes.ok) throw new Error(`Failed to load genders: ${gendersRes.statusText}`);
        if (!maritalStatusesRes.ok) throw new Error(`Failed to load marital statuses: ${maritalStatusesRes.statusText}`);

        // Parse JSON
        const branchesData = await branchesRes.json();
        const gendersData = await gendersRes.json();
        const maritalStatusesData = await maritalStatusesRes.json();

        // Extract the array from the response (handle different response structures)
        const branches = Array.isArray(branchesData) ? branchesData : branchesData.data || [];
        const genders = Array.isArray(gendersData) ? gendersData : gendersData.data || [];
        const maritalStatuses = Array.isArray(maritalStatusesData) ? maritalStatusesData : maritalStatusesData.data || [];

        // Validate that required data is available
        if (!branches || branches.length === 0) {
            showErrorMessage('Error: No branches available. Please contact system administrator.');
            return;
        }
        if (!genders || genders.length === 0) {
            showErrorMessage('Error: No genders available. Please contact system administrator.');
            return;
        }

        // 3. Initialize your form component injecting the fetched data records
        const { element, getFormData } = createRegisterForm({
            branches,
            genders,
            maritalStatuses
        });

        // 4. Render the modal frame with the fresh element
        // Capture the controller instance so we can close it smoothly using its native methods
        const registrationModal = showModal(
            'Register with KBSACCO',
            element,
            [
                {
                    label: 'Cancel',
                    onClick: () => registrationModal.close() // Plays close animations automatically
                },
                {
                    label: 'Register',
                    primary: true,
                    onClick: async () => {
                        try {
                            const data = getFormData();

                            // 5. Updated validation checks matching your required API fields
                            if (
                                !data.member.first_name ||
                                !data.member.last_name

                            ) {
                                showErrorMessage('Please fill in all mandatory system sections.');
                                return;
                            }

                            try {
                                const response = await registerMember(data);
                                registrationModal.close();
                                showSuccessMessage('Member registration successful! Please set your password.');

                                // Show password setup form frame
                                setTimeout(() => {
                                    showPasswordSetupForm(response);
                                }, 500);
                            } catch (error) {
                                showErrorMessage(`Registration failed: ${error.message}`);
                            }
                        } catch (validationError) {
                            // Catch validation errors from getFormData()
                            showErrorMessage(validationError.message);
                        }
                    }
                }
            ],
            { fullScreen: true }
        );

    } catch (fetchError) {
        // Fallback error handling if API calls fail to load options
        showErrorMessage(`Failed to load system setup records: ${fetchError.message}`);
    }
}

function showPasswordSetupForm(memberData) {
    const { element, getFormData } = createPasswordSetupForm();

    showModal('Set Your Password', element, [
        {
            label: 'Cancel',
            onClick: () => document.querySelector('.modal-overlay')?.remove()
        },
        {
            label: 'Set Password',
            primary: true,
            onClick: async () => {
                try {
                    const data = getFormData();
                    if (!data.password || !data.confirmPassword) {
                        showErrorMessage('Please fill in all required fields');
                        return;
                    }

                    if (data.password !== data.confirmPassword) {
                        showErrorMessage('Passwords do not match');
                        return;
                    }

                    if (data.password.length < 8) {
                        showErrorMessage('Password must be at least 8 characters long');
                        return;
                    }

                    try {
                        const passwordData = {
                            organisation_id: memberData.organisation_id,
                            role_id: memberData.branch_id, // Using branch_id as role_id if not provided
                            email: memberData.email,
                            first_name: memberData.first_name,
                            last_name: memberData.last_name,
                            user_type: memberData.user_type || 'MEMBER',
                            password: data.password,
                            phone: memberData.phone_primary,
                            member_id: memberData.id
                        };

                        const response = await setMemberPassword(passwordData);
                        document.querySelector('.modal-overlay')?.remove();
                        showSuccessMessage('Password set successfully! You can now login.');
                        clearTempMemberData();
                        setActiveScreen('welcome');
                    } catch (error) {
                        showErrorMessage(`Password setup failed: ${error.message}`);
                    }
                } catch (validationError) {
                    // Catch validation errors from getFormData()
                    showErrorMessage(validationError.message);
                }
            }
        }
    ]);
}

// Export functions for use in other modules
export function showAuthLogin() {
    showLoginForm();
}

export function showAuthRegister() {
    showRegisterForm();
}

async function checkLoginStatus() {
    if (!isUserLoggedIn()) {
        isLoggedIn = false;
        return false;
    }

    try {
        memberData = await fetchMemberData();
        isLoggedIn = true;
        return true;
    } catch (error) {
        isLoggedIn = false;
        return false;
    }
}

async function initApp() {
    attachGlobalHandlers();
    setupPageUnloadHandlers();

    // Check if user is logged in
    const loggedIn = await checkLoginStatus();

    if (loggedIn) {
        setActiveScreen('dashboard');
    } else {
        setActiveScreen('welcome');
    }
}

function setupPageUnloadHandlers() {
    // Clear member data on page unload (close/refresh)
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('current_member_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('member_data');
    });

    // Also clear on unload (fallback)
    window.addEventListener('unload', () => {
        localStorage.removeItem('current_member_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('member_data');
    });
}

window.addEventListener('DOMContentLoaded', initApp);