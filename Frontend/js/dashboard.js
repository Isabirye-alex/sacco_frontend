document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('sacco_token');

    // Security check: Redirect to login if user lacks an active token
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Fetch dashboard statistics from the accounts route
        const response = await fetch('http://127.0.0', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Pass the JWT security token
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('sacco_token');
            window.location.href = 'index.html';
            return;
        }

        const data = await response.json();

        // Update elements dynamically with localized currency formatting
        document.getElementById('member-name').innerText = data.full_name;
        document.getElementById('savings-balance').innerText = `UGX ${data.savings_balance.toLocaleString()}`;
        document.getElementById('shares-balance').innerText = `UGX ${data.shares_balance.toLocaleString()}`;
        document.getElementById('loan-balance').innerText = `UGX ${data.loan_balance.toLocaleString()}`;

    } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
    }
});
