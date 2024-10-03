const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authMiddleware = require('../middleware/auth');

// POST: Create a new post (protected route)
router.post('/', authMiddleware, (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    const query = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';
    db.query(query, [title, content, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating post' });
        }
        res.json({ message: 'Post created successfully' });
    });
});

// GET: Retrieve all posts
router.get('/', (req, res) => {
    const query = 'SELECT posts.id, posts.title, posts.content, users.name AS author FROM posts JOIN users ON posts.user_id = users.id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching posts' });
        }
        res.json(results);
    });
});

// PUT: Edit a post (protected route)
router.put('/:id', authMiddleware, (req, res) => {
    const { title, content } = req.body;
    const postId = req.params.id;

    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, postId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating post' });
        }
        res.json({ message: 'Post updated successfully' });
    });
});

// DELETE: Delete a post (protected route)
router.delete('/:id', authMiddleware, (req, res) => {
    const postId = req.params.id;

    const query = 'DELETE FROM posts WHERE id = ?';
    db.query(query, [postId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting post' });
        }
        res.json({ message: 'Post deleted successfully' });
    });
});

module.exports = router;
