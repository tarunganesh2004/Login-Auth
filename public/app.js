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

    if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect to posts page
        window.location.href = `/posts.html?name=${encodeURIComponent(data.message)}`;
    } else {
        document.getElementById('loginMsg').textContent = data.message || 'Login failed';
    }
});
