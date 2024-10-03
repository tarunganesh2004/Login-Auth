const jwt = require('jsonwebtoken');
const SECRET_KEY = 'YOUR_SECRET_KEY';  // Use a secure secret key

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Extract token from 'Authorization: Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);  // Verify the token
        req.user = decoded;  // Attach decoded user to request object
        next();  // Pass control to next middleware or route
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
