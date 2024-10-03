const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const router = express.Router();

const SECRET_KEY = 'YOUR_SECRET_KEY';  // Replace with your own secure key

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error registering user' });
            }
            res.json({ message: 'Registration successful' });
        });
    });
});

// Login user and generate JWT token
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const loginQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(loginQuery, [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });

        // Send the token and success message to the frontend
        res.json({ token, message: `Welcome ${user.name}` });
    });
});

module.exports = router;
