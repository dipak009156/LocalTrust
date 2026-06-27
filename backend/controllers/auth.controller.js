const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const https = require('https');

// ─── Fast2SMS helper ──────────────────────────────────────────────────────────
const sendSms = (phone, otp) => {
    return new Promise((resolve, reject) => {
        const message = `${otp} is your LocalTrust verification code. Valid for 10 minutes. Do not share it with anyone.`;
        const params = new URLSearchParams({
            authorization: process.env.FAST2SMS_API_KEY,
            route: 'q',
            message,
            language: 'english',
            flash: 0,
            numbers: phone,
        });
        const options = {
            hostname: 'www.fast2sms.com',
            path: `/dev/bulkV2?${params.toString()}`,
            method: 'GET',
            headers: { 'cache-control': 'no-cache' },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.return === true) resolve(json);
                    else reject(new Error(json.message || 'Fast2SMS error'));
                } catch { reject(new Error('Invalid Fast2SMS response')); }
            });
        });
        req.on('error', reject);
        req.end();
    });
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const signToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * POST /api/auth/send-otp
 * Body: { phone, role }
 */
const sendOtp = async (req, res) => {
    try {
        const { phone, role } = req.body;
        const digits = String(phone).replace(/\D/g, '');
        if (digits.length !== 10) {
            return res.status(400).json({ message: 'Enter a valid 10-digit phone number' });
        }
        if (!['USER', 'WORKER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'Role must be USER, WORKER or ADMIN' });
        }

        // ── Dev bypass — skip DB + SMS entirely ───────────────────────────────
        // When true, sendOtp always succeeds so you can use bypass OTPs to login.
        // Flip to false (or delete) before going to production.
        const DEV_BYPASS_MODE = true;
        if (DEV_BYPASS_MODE) {
            logger.warn(`[DEV] sendOtp bypassed for ${digits.slice(0, 5)}***** role=${role} — use bypass OTP to login`);
            return res.status(200).json({ message: 'OTP sent successfully' });
        }

        // Rate limit — max 3 unused OTPs per phone in last 5 minutes
        const recentCount = await prisma.otpRequest.count({
            where: {
                phone: digits,
                used: false,
                expiresAt: { gt: new Date() },
                createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
            },
        });
        if (recentCount >= 3) {
            return res.status(429).json({ message: 'Too many OTP requests. Wait a few minutes.' });
        }

        const code = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Invalidate previous unused OTPs
        await prisma.otpRequest.updateMany({
            where: { phone: digits, used: false },
            data: { used: true },
        });

        await prisma.otpRequest.create({
            data: { phone: digits, code, role, expiresAt },
        });

        try {
            await sendSms(digits, code);
        } catch (smsError) {
            logger.warn(`Fast2SMS failed (${smsError.message}). OTP for ${digits}: ${code}`);
        }

        logger.info(`OTP generated for ${digits.slice(0, 5)}***** : ${code}`);
        return res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        logger.error('sendOtp error:', error);
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};


/**
 * POST /api/auth/verify-otp
 * Body: { phone, otp, role }
 * Returns: { token, account, isNew }
 */
const verifyOtp = async (req, res) => {
    try {
        const { phone, otp, role } = req.body;
        const digits = String(phone).replace(/\D/g, '');

        if (digits.length !== 10) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }
        if (!otp || String(otp).length !== 6) {
            return res.status(400).json({ message: 'OTP must be 6 digits' });
        }

        // ── Dev bypass OTPs — any of these always pass, skipping DB lookup ──────
        // Remove / comment out before going to production.
        const BYPASS_OTPS = ['000000', '111111', '123456', '999999', '159753'];
        const isBypass = BYPASS_OTPS.includes(String(otp));

        if (!isBypass) {
            // Validate OTP from DB
            const otpRecord = await prisma.otpRequest.findFirst({
                where: { phone: digits, used: false, expiresAt: { gt: new Date() } },
                orderBy: { createdAt: 'desc' },
            });

            if (!otpRecord) {
                return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
            }
            if (otpRecord.code !== String(otp)) {
                return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
            }
            if (otpRecord.role !== role) {
                return res.status(400).json({ message: 'Role mismatch. Use the correct login page.' });
            }

            await prisma.otpRequest.update({ where: { id: otpRecord.id }, data: { used: true } });
        } else {
            logger.warn(`[DEV] Bypass OTP used for ${digits.slice(0, 5)}***** role=${role}`);
        }

        // Find or create account
        let account;
        let isNew = false;

        if (role === 'USER') {
            const existing = await prisma.user.findFirst({ where: { phone: digits } });
            if (existing) {
                account = existing;
            } else {
                account = await prisma.user.create({ data: { phone: digits } });
                isNew = true;
            }
        }

        if (role === 'WORKER') {
            const existing = await prisma.worker.findFirst({ where: { phone: digits } });
            if (existing) {
                account = existing;
            } else {
                account = await prisma.worker.create({ data: { phone: digits } });
                isNew = true;
            }
        }

        if (!account) {
            return res.status(500).json({ message: 'Account creation failed' });
        }

        // Issue JWT
        const token = signToken({ id: account.id, role });

        logger.info(`Login ${isNew ? '(new)' : '(existing)'} — ${role} ${digits.slice(0, 5)}*****`);
        return res.status(200).json({ message: isNew ? 'Account created' : 'Login successful', token, account, isNew });

    } catch (error) {
        logger.error('verifyOtp error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            id: req.user.id,
            role: req.user.role,
            data: req.user.data,
        });
    } catch (error) {
        logger.error('getMe error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/auth/admin-login
 * Body: { phone, otp }
 * Returns: { token, account }
 */
const adminLogin = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const digits = String(phone).replace(/\D/g, '');

        if (digits.length !== 10) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }

        const adminAccount = await prisma.admin.findUnique({ where: { phone: digits } });
        if (!adminAccount) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const otpRecord = await prisma.otpRequest.findFirst({
            where: { phone: digits, used: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });

        // ── Dev bypass OTPs — same list as verifyOtp ──────────────────────────
        const BYPASS_OTPS = ['000000', '111111', '123456', '999999', '159753'];
        const isBypass = BYPASS_OTPS.includes(String(otp));

        if (!isBypass && (!otpRecord || otpRecord.code !== String(otp))) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (!isBypass) {
            await prisma.otpRequest.update({ where: { id: otpRecord.id }, data: { used: true } });
        } else {
            logger.warn(`[DEV] Bypass OTP used for admin ${digits.slice(0, 5)}*****`);
        }

        const token = signToken({ id: adminAccount.id, role: 'ADMIN' });

        logger.info(`Admin login: ${adminAccount.name} (${digits.slice(0, 5)}*****)`);
        return res.status(200).json({ message: 'Admin login successful', token, account: adminAccount });

    } catch (error) {
        logger.error('adminLogin error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { sendOtp, verifyOtp, getMe, adminLogin };