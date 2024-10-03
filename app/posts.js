const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authMiddleware = require('../middleware/auth');

// POST: Create a new post (protected route)
router.post('/', authMiddleware, (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;  // Get the user ID from the token

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

module.exports = router;
