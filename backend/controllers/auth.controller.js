const prisma = require('../lib/prisma');
const logger = require('../utils/logger');
const admin = require('../lib/firebase');

const userInitialization = async (req, res) => {
    try {
        const { firebaseUid, role, phone } = req.body;

        if (!firebaseUid || !role || !phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // admin is not allowed to register only lohin
        if (!['USER', 'WORKER'].includes(role)) {
            return res.status(400).json({
                error: 'Invalid role. Role must be either USER or WORKER'
            })
        }

        // adding role to the users firebase id forever
        await admin.auth().setCustomUserClaims(firebaseUid, { role })

        //now creating or fnding account
        let account
        let isNew = false;

        if (role === 'USER') {
            const existingUser = await prisma.user.findUnique({
                where: { firebaseUid }
            })

            if (existingUser) {
                account = existingUser;
                isNew = false;
            } else {
                account = await prisma.user.create({
                    data: {
                        firebaseUid,
                        phone
                    }
                })
                isNew = true;
            }
        }

        if (role === 'WORKER') {
            const existingWorker = await prisma.worker.findUnique({
                where: { firebaseUid }
            })

            if (existingWorker) {
                account = existingWorker;
                isNew = false;
            } else {
                account = await prisma.worker.create({
                    data: {
                        firebaseUid,
                        phone
                    }
                })
                isNew = true;
            }
        }

        if (isNew && account) {
            return res.status(201).json({ message: 'Account created successfully', account });
        } else if (account) {
            return res.status(200).json({ message: 'Account already exists', account });
        } else {
            return res.status(500).json({ message: 'Account creation failed' });
        }
    } catch (error) {
        logger.error('User initialization error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { userInitialization };