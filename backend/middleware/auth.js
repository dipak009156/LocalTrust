const jwt    = require('jsonwebtoken');
const prisma  = require('../lib/prisma');
const logger  = require('../utils/logger');

/**
 * requireAuth
 * Verifies the LocalTrust JWT (issued by /api/auth/verify-otp or /api/auth/admin-login).
 * Attaches { id, role, uid, data } to req.user.
 */
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized — no token' });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized — invalid or expired token' });
        }

        const { id, role } = decoded;
        if (!id || !role) {
            return res.status(401).json({ message: 'Unauthorized — malformed token' });
        }

        let account;
        if (role === 'USER') {
            account = await prisma.user.findUnique({ where: { id } });
        } else if (role === 'WORKER') {
            account = await prisma.worker.findUnique({ where: { id } });
        } else if (role === 'ADMIN') {
            account = await prisma.admin.findUnique({ where: { id } });
        }

        if (!account) {
            return res.status(401).json({ message: 'Unauthorized — account not found' });
        }

        req.user = { id, role, uid: id, data: account };
        next();

    } catch (error) {
        logger.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const requireUser = (req, res, next) => {
    if (req.user.role !== 'USER') {
        return res.status(403).json({ message: 'Forbidden — customers only' });
    }
    next();
};

const requireWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        return res.status(403).json({ message: 'Forbidden — workers only' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden — admins only' });
    }
    next();
};

const requireVerifiedWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        return res.status(403).json({ message: 'Forbidden — workers only' });
    }
    if (req.user.data.status === 'suspended' || req.user.data.status === 'banned') {
        return res.status(403).json({ message: 'Forbidden — account suspended' });
    }
    next();
};

module.exports = {
    requireAuth,
    requireUser,
    requireWorker,
    requireAdmin,
    requireVerifiedWorker,
};