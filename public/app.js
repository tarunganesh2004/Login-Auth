// @ts-nocheck
// Handle registration
// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    document.getElementById('registerMsg').textContent = data.message;
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // Check if login was successful
    if (response.ok) {
        // Open a new window or tab with the success message
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head><title>Welcome</title></head>
                <body>
                    <h1>Login Successful</h1>
                    <p>${data.message}</p>
                </body>
            </html>
        `);
    } else {
        document.getElementById('loginMsg').textContent = data.message || 'Login failed';
    }
});
