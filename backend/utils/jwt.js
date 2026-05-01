const jwt = require('jsonwebtoken');

const signToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
        // Fallback for safety during dev, but we should fix the .env
        return jwt.sign(payload, 'fallback_secret_for_dev_only', { expiresIn: '7d' });
    }

    return jwt.sign(payload, secret, {
        expiresIn: '7d'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { signToken, verifyToken };
