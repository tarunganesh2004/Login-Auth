document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    
    if (name) {
        document.getElementById('welcomeMessage').textContent = `Welcome, ${name}`;
    }

    loadPosts();
});

// Handle post creation
document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const token = localStorage.getItem('token');

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Send JWT token in Authorization header
        },
        body: JSON.stringify({ title, content })
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById('postMessage').textContent = 'Post created successfully';
        loadPosts();  // Reload posts after creating a new one
    } else {
        document.getElementById('postMessage').textContent = data.message || 'Error creating post';
    }
});

// Load all posts
async function loadPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();

    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><em>By ${post.author}</em></p>
        `;
        postList.appendChild(postDiv);
    });
}
