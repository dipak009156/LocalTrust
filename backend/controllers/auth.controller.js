const admin = require('../lib/firebase');
const prisma = require('../lib/prisma');
const logger = require('../utils/logger');
const { signToken } = require('../utils/jwt');

const userInitialization = async (req, res) => {
    const { idToken, role } = req.body;

    try {
        console.log("--- Dual-Role Auth Verification ---");
        
        if (!idToken) return res.status(400).json({ message: "No token provided" });

        // 1. Verify the Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid } = decodedToken;
        const phone = decodedToken.phone_number || "Unknown";

        // 2. Check for accounts in BOTH tables (One person can be both)
        const [existingUser, existingWorker] = await Promise.all([
            prisma.user.findUnique({ where: { firebaseUid: uid } }),
            prisma.worker.findUnique({ where: { firebaseUid: uid } })
        ]);

        let account;

        // 3. Handle the requested role
        if (role === 'WORKER') {
            account = existingWorker;
            if (!account) {
                console.log("Initializing NEW Worker profile for UID:", uid);
                account = await prisma.worker.create({
                    data: {
                        firebaseUid: uid,
                        phone: phone,
                        status: 'provisional'
                    }
                });
            }
        } else {
            account = existingUser;
            if (!account) {
                console.log("Initializing NEW Customer profile for UID:", uid);
                account = await prisma.user.create({
                    data: {
                        firebaseUid: uid,
                        phone: phone
                    }
                });
            }
        }

        // 4. Generate JWT for the specific session role
        const token = signToken({ 
            uid, 
            id: account.id, 
            role: role === 'WORKER' ? 'WORKER' : 'USER' 
        });

        res.json({
            token,
            user: account,
            role: role === 'WORKER' ? 'WORKER' : 'USER',
            meta: {
                isAlreadyCustomer: !!existingUser,
                isAlreadyWorker: !!existingWorker
            }
        });

    } catch (error) {
        console.error('AUTH ERROR:', error.message);
        res.status(401).json({ message: 'Auth Failed', error: error.message });
    }
};

// Get current session data and profile
const getMe = async (req, res) => {
    // req.user is populated by the requireAuth middleware
    res.json({ user: req.user.data });
};

module.exports = { userInitialization, getMe };