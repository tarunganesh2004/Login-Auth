// @ts-nocheck
// profile.js

// Get user profile when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html'; // Redirect to login if not authenticated
        return;
    }

    const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const user = await response.json();

    if (response.ok) {
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;

        // Pre-fill form with current values
        document.getElementById('updateName').value = user.name;
        document.getElementById('updateEmail').value = user.email;
    } else {
        document.getElementById('updateMessage').textContent = 'Error loading profile';
    }
});

// Handle profile update
document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    const token = localStorage.getItem('token');

    const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById('updateMessage').textContent = 'Profile updated successfully';
    } else {
        document.getElementById('updateMessage').textContent = data.message || 'Error updating profile';
    }
});
