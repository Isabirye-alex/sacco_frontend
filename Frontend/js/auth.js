document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page refresh

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const alertBox = document.getElementById('alert-box');

    try {
        // Prepare data for FastAPI's standard OAuth2 password flow
        const formData = new URLSearchParams();
        formData.append('username', email); // FastAPI OAuth2 expects 'username'
        formData.append('password', password);

        // This path maps directly to your future backend structure
        const response = await fetch('http://127.0.0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            // Save token to localStorage for authenticated requests
            localStorage.setItem('sacco_token', data.access_token);
            
            // Redirect straight to member dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Display exact error message from backend schema
            showAlert(data.detail || 'Login failed. Verify your details.', 'alert-danger');
        }
    } catch (error) {
        showAlert('Cannot connect to backend server right now.', 'alert-danger');
    }
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    alertBox.className = `alert ${type}`;
    alertBox.innerText = message;
    alertBox.classList.remove('d-none');
}
