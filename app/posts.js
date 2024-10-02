// @ts-nocheck
// app/posts.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authMiddleware = require('../middleware/auth');

// GET: Retrieve all posts
router.get('/posts', (req, res) => {
    const query = 'SELECT * FROM posts';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

// POST: Create a new post (protected route)
router.post('/posts', authMiddleware, (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.id;
    const query = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';

    db.query(query, [title, content, user_id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Post created successfully' });
    });
});

// PUT: Update a post (protected route)
router.put('/posts/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.user.id;
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?';

    db.query(query, [title, content, id, user_id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Post updated successfully' });
    });
});

// DELETE: Delete a post (protected route)
router.delete('/posts/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const query = 'DELETE FROM posts WHERE id = ? AND user_id = ?';

    db.query(query, [id, user_id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Post deleted successfully' });
    });
});

module.exports = router;
