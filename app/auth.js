const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const authMiddleware = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'User registered successfully' });
    });
});

// Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        // @ts-ignore
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;