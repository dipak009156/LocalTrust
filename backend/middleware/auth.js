const jwt = require('../utils/jwt');
const logger = require('../utils/logger');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn('Unauthorized access attempt: No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next()
    } catch {
        logger.warn('Unauthorized access attempt: Invalid token');
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

const requireWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        logger.warn(`Unauthorized access attempt by user with role ${req.user.role}`);
        return res.status(403).json({ message: 'Forbidden: Access is denied' });
    }

    next()
}

const requireAdmin = (req, res, next)=>{
    if (req.user.role !== 'ADMIN') {
        logger.warn(`Unauthorized access attempt by user with role ${req.user.role}`);
        return res.status(403).json({ message: 'Forbidden: Access is denied' });
    }
    
    next()
}
             
module.exports = {
    requireAuth,
    requireWorker,
    requireAdmin
}