const { verifyToken } = require('../utils/jwt');
const prisma = require('../lib/prisma');
const logger = require('../utils/logger');

/**
 * Global Authentication Middleware
 * Verifies the custom JWT and populates req.user with the latest DB record
 */
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No session token' });
        }

        const token = authHeader.split(' ')[1];
        
        // 1. Verify custom JWT
        const decoded = verifyToken(token);
        const { id, role, uid } = decoded;

        let account;

        // 2. Refresh account data from Database
        if (role === 'ADMIN' || role === 'USER') {
            account = await prisma.user.findUnique({ where: { id: id } });
        } else if (role === 'WORKER') {
            account = await prisma.worker.findUnique({ where: { id: id } });
        }

        if (!account) {
            return res.status(401).json({ message: 'Unauthorized: Session invalid' });
        }

        // 3. Attach session to request
        req.user = {
            uid: uid,
            id: account.id,
            role: role,
            data: account
        };

        next();

    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized: Session expired' });
    }
};

/**
 * Role-Based: Customer Only
 */
const requireCustomer = (req, res, next) => {
    if (req.user.role !== 'USER') {
        return res.status(403).json({ message: 'Forbidden: Access restricted to Customers' });
    }
    next();
};

/**
 * Role-Based: Worker Only
 */
const requireWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        return res.status(403).json({ message: 'Forbidden: Access restricted to Partners' });
    }
    next();
};

/**
 * Role-Based: Admin Only
 */
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};

/**
 * Advanced: Verified Workers Only
 * Used for accepting jobs or viewing sensitive earning data
 */
const requireVerifiedWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        return res.status(403).json({ message: 'Forbidden: Partner account required' });
    }

    if (req.user.data.status !== 'verified') {
        return res.status(403).json({ 
            message: 'Access Denied: Your partner account is pending verification',
            status: req.user.data.status
        });
    }
    next();
};

module.exports = {
    requireAuth,
    requireCustomer,
    requireAdmin,
    requireWorker,
    requireVerifiedWorker
};