// @ts-nocheck
// app/users.js

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const bcrypt = require('bcryptjs'); // For hashing passwords

// GET: Retrieve all users from the database (excluding passwords for security)
router.get('/users', (req, res) => {
    const query = 'SELECT id, name, email FROM users'; // Exclude password from query
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results);
        }
    });
});

// GET: Retrieve a particular user by ID (excluding password)
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, name, email FROM users WHERE id = ?'; // Exclude password from query

    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (result.length === 0) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.json(result[0]);
        }
    });
});

// POST: Add a new user to the database (with password hashing)
router.post('/users', async (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            const insertId = result.insertId; // Get the newly inserted user ID
            res.json({ id: insertId, name, email });
        }
    });
});

// PUT: Update a user's data by ID (name, email, and optionally password)
router.put('/users/:id', async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;

    // If password is provided, hash it
    let query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    let queryParams = [name, email, id];

    // If the user wants to update the password, include it in the update
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        queryParams = [name, email, hashedPassword, id];
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
});

// DELETE: Delete a user from the database by ID
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});

module.exports = router;
