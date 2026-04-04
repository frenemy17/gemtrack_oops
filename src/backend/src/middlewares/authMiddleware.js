const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (!req.user.id && req.user.userId) {
            // Handle legacy token case if necessary, or just log it
            console.warn("Legacy token detected (userId instead of id). Mapping to id.");
            req.user.id = req.user.userId;
        }

        if (!req.user.id) {
            console.error("Token valid but missing user ID:", decoded);
            return res.status(401).json({ message: 'Not authorized, invalid token payload' });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};