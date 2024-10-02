// @ts-nocheck
// index.js

const express = require('express');
const path = require('path');
const userRoutes = require('./app/users');
const authRoutes = require('./app/auth');
const postRoutes = require('./app/posts');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Backend API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
