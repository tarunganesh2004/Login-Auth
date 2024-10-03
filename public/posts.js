document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

    if (name) {
        document.getElementById('welcomeMessage').textContent = ` ${name}`;
    }

    // Handle dashboard options
    document.getElementById('viewPostsBtn').addEventListener('click', loadPosts);
    document.getElementById('createPostBtn').addEventListener('click', () => {
        document.getElementById('createPostSection').style.display = 'block';
        document.getElementById('postsTableSection').style.display = 'none';
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
                'Authorization': `Bearer ${token}`
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
});

// Load all posts and display them in a table
async function loadPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();

    const postsTableBody = document.getElementById('postsTableBody');
    postsTableBody.innerHTML = '';  // Clear the current table

    posts.forEach(post => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${post.title}</td>
            <td>${post.content}</td>
            <td>${post.author}</td>
            <td>
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
            </td>
        `;

        postsTableBody.appendChild(row);
    });

    // Show the posts table
    document.getElementById('postsTableSection').style.display = 'block';
    document.getElementById('createPostSection').style.display = 'none';
}

// Edit post (open the form and fill it with post data)
function editPost(postId) {
    // This will be expanded in the next step to handle editing posts
    alert(`Edit post: ${postId}`);
}

// Delete post
async function deletePost(postId) {
    const token = localStorage.getItem('token');

    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        loadPosts();  // Reload posts after deletion
    } else {
        alert('Failed to delete post');
    }
}
