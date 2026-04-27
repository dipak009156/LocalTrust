const admin = require('../lib/firebase');
const prisma = require('../lib/prisma');
const logger = require('../utils/logger');

const requireAuth = async (rea, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = await admin.auth().verifyIdToken(token);
        const role  = decoded.role;
        if (!role) return res.status(403).json({ message: 'Forbidden' });

        let account

        if (role === 'ADMIN') {
            account = await prisma.user.findUnique({
                where : { firebaseUid : decoded.uid }
            })
        } 

        if (role === 'USER') {
            account = await prisma.user.findUnique({
                where : { firebaseUid : decoded.uid }
            })
        }

        if(role === 'WORKER') {
            account = await prisma.worker.findUnique({
                where : { firebaseUid : decoded.uid }
            })
        }

        if (!account) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = {
            uid : decoded.uid,
            id : account.id,
            data : account
        }

        next();

    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

const requireWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

const requireVerifiedWorker = (req, res, next) => {
    if (req.user.role !== 'WORKER') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.user.data.status !== 'verified') {
        return res.status(403).json({ message: 'Worker not verified' });
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireWorker,
    requireVerifiedWorker
}