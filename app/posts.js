// app/posts.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authMiddleware = require('../middleware/auth'); // JWT middleware

// POST: Create a new post (protected route)
router.post('/', authMiddleware, (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { title, content } = req.body;

    const query = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';
    db.query(query, [title, content, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating post' });
        }
        res.json({ message: 'Post created successfully' });
    });
});

// GET: Retrieve all posts (public route)
router.get('/', (req, res) => {
    const query = 'SELECT posts.id, posts.title, posts.content, users.name as author FROM posts JOIN users ON posts.user_id = users.id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching posts' });
        }
        res.json(results);
    });
});

module.exports = router;
