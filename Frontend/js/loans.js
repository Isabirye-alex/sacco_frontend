document.getElementById('loan-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('sacco_token');
    const amount = document.getElementById('amount').value;
    const duration = document.getElementById('duration').value;
    const alertBox = document.getElementById('loan-alert');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('http://127.0.0', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                duration_months: parseInt(duration)
            })
        });

        const data = await response.json();

        if (response.ok) {
            alertBox.className = 'alert alert-success';
            alertBox.innerText = 'Application successfully submitted for processing!';
            alertBox.classList.remove('d-none');
            document.getElementById('loan-form').reset();
        } else {
            alertBox.className = 'alert alert-danger';
            alertBox.innerText = data.detail || 'Loan application was rejected.';
            alertBox.classList.remove('d-none');
        }
    } catch (error) {
        alertBox.className = 'alert alert-danger';
        alertBox.innerText = 'Could not communicate with the loan processor.';
        alertBox.classList.remove('d-none');
    }
});
