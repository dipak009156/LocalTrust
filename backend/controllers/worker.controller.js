const prisma = require('../lib/prisma');
const logger  = require('../utils/logger');

/**
 * GET /api/worker/profile
 * Returns the logged-in worker's full profile with skills.
 */
const getProfile = async (req, res) => {
    try {
        const worker = await prisma.worker.findUnique({
            where: { id: req.user.id },
            include: {
                skills: {
                    include: { category: { select: { name: true, iconUrl: true } } },
                },
                _count: { select: { bookings: true } },
            },
        });
        if (!worker) return res.status(404).json({ message: 'Worker not found' });
        return res.status(200).json(worker);
    } catch (error) {
        logger.error('worker getProfile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/worker/profile
 * Updates basic profile fields: name, city, serviceRadius, isAvailable.
 */
const updateProfile = async (req, res) => {
    try {
        const { name, city, serviceRadius, isAvailable, homeLat, homeLng } = req.body;
        const updated = await prisma.worker.update({
            where: { id: req.user.id },
            data: {
                ...(name          !== undefined && { name }),
                ...(city          !== undefined && { city }),
                ...(serviceRadius !== undefined && { serviceRadius: Number(serviceRadius) }),
                ...(isAvailable   !== undefined && { isAvailable: Boolean(isAvailable) }),
                ...(homeLat       !== undefined && { homeLat: Number(homeLat) }),
                ...(homeLng       !== undefined && { homeLng: Number(homeLng) }),
            },
        });
        return res.status(200).json({ message: 'Profile updated', worker: updated });
    } catch (error) {
        logger.error('worker updateProfile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/worker/availability
 * Toggles isAvailable on/off — used by the dashboard toggle.
 */
const toggleAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;
        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({ message: 'isAvailable must be a boolean' });
        }
        const updated = await prisma.worker.update({
            where: { id: req.user.id },
            data:  { isAvailable },
        });
        return res.status(200).json({
            message: `You are now ${isAvailable ? 'online' : 'offline'}`,
            isAvailable: updated.isAvailable,
        });
    } catch (error) {
        logger.error('toggleAvailability error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/worker/kyc
 * Saves Aadhaar photo URLs after the worker uploads them to Firebase Storage.
 * Body: { aadhaarFront, aadhaarBack, aadhaarSelfie } — Storage download URLs
 */
const submitKyc = async (req, res) => {
    try {
        const { aadhaarFront, aadhaarBack, aadhaarSelfie } = req.body;
        if (!aadhaarFront || !aadhaarBack || !aadhaarSelfie) {
            return res.status(400).json({ message: 'All 3 Aadhaar photos are required' });
        }
        const updated = await prisma.worker.update({
            where: { id: req.user.id },
            data:  { aadhaarFront, aadhaarBack, aadhaarSelfie },
        });
        return res.status(200).json({ message: 'KYC submitted, pending admin review', worker: updated });
    } catch (error) {
        logger.error('submitKyc error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/worker/skills
 * Saves the selected skill categories with badge and optional test score.
 * Body: { skills: [{ categoryId, badge, testScore? }] }
 * Replaces all existing skills for this worker.
 */
const saveSkills = async (req, res) => {
    try {
        const { skills } = req.body;
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'At least one skill is required' });
        }

        // Delete existing, then bulk-insert new
        await prisma.workerSkill.deleteMany({ where: { workerId: req.user.id } });
        await prisma.workerSkill.createMany({
            data: skills.map(s => ({
                workerId:   req.user.id,
                categoryId: s.categoryId,
                badge:      s.badge || 'skill_tested',
                testScore:  s.testScore ?? null,
            })),
            skipDuplicates: true,
        });

        return res.status(200).json({ message: 'Skills saved successfully' });
    } catch (error) {
        logger.error('saveSkills error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/worker/jobs
 * Returns the worker's booking history.
 */
const getJobs = async (req, res) => {
    try {
        const jobs = await prisma.booking.findMany({
            where: { workerId: req.user.id },
            include: {
                category: { select: { name: true, iconUrl: true } },
                user:     { select: { id: true, name: true, phone: true } },
                earning:  { select: { netAmount: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(jobs);
    } catch (error) {
        logger.error('getJobs error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/worker/earnings
 * Returns the worker's earnings summary and history.
 */
const getEarnings = async (req, res) => {
    try {
        const earnings = await prisma.workerEarning.findMany({
            where:   { workerId: req.user.id },
            include: { booking: { include: { category: { select: { name: true } } } } },
            orderBy: { createdAt: 'desc' },
        });

        const totalNet = earnings.reduce((sum, e) => sum + e.netAmount, 0);
        const totalGross = earnings.reduce((sum, e) => sum + e.grossAmount, 0);

        return res.status(200).json({ totalGross, totalNet, earnings });
    } catch (error) {
        logger.error('getEarnings error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/worker/notifications
 * Returns notifications for the logged-in worker.
 */
const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where:   { recipientId: req.user.id, recipientType: 'worker' },
            orderBy: { sentAt: 'desc' },
            take:    50,
        });
        return res.status(200).json(notifications);
    } catch (error) {
        logger.error('getNotifications error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/worker/notifications/:id/read
 */
const markNotificationRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { id: req.params.id, recipientId: req.user.id },
            data:  { isRead: true },
        });
        return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        logger.error('worker markNotificationRead error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/worker/bookings/:id
 * Single booking full detail for worker.
 */
const getBookingDetail = async (req, res) => {
    try {
        const booking = await prisma.booking.findFirst({
            where:   { id: req.params.id, workerId: req.user.id },
            include: {
                category: true,
                user:     { select: { id: true, name: true, phone: true } },
                earning:  true,
            },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        return res.status(200).json(booking);
    } catch (error) {
        logger.error('worker getBookingDetail error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    toggleAvailability,
    submitKyc,
    saveSkills,
    getJobs,
    getEarnings,
    getNotifications,
    markNotificationRead,
    getBookingDetail,
};
