// @ts-nocheck
// app/users.js

// app/users.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authMiddleware = require('../middleware/auth'); // JWT Middleware

// GET: Retrieve user profile information (protected route)
router.get('/profile', authMiddleware, (req, res) => {
    const userId = req.user.id; // Assuming you are using JWT to get user ID

    const query = 'SELECT id, name, email FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(500).json({ message: 'User not found' });
        }

        res.json(result[0]);
    });
});

// PUT: Update user profile information (protected route)
router.put('/profile', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name, email, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating profile' });
        }

        res.json({ message: 'Profile updated successfully' });
    });
});

module.exports = router;

