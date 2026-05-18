const prisma  = require('../lib/prisma');
const logger  = require('../utils/logger');

/**
 * GET /api/user/profile
 * Returns the logged-in customer's full profile.
 */
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                phone: true,
                name: true,
                city: true,
                bookerScore: true,
                createdAt: true,
                _count: { select: { bookings: true, reviews: true, favourites: true } },
            },
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (error) {
        logger.error('getProfile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/user/profile
 * Updates name and/or city for the logged-in customer.
 */
const updateProfile = async (req, res) => {
    try {
        const { name, city } = req.body;
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name !== undefined && { name }),
                ...(city !== undefined && { city }),
            },
        });
        return res.status(200).json({ message: 'Profile updated', user: updated });
    } catch (error) {
        logger.error('updateProfile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/user/bookings
 * Returns a list of bookings for the logged-in customer.
 */
const getBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: {
                category: { select: { name: true, iconUrl: true } },
                worker:   { select: { id: true, name: true, phone: true, profilePhoto: true, avgRating: true } },
                review:   { select: { rating: true } },
                escrow:   { select: { status: true, amount: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(bookings);
    } catch (error) {
        logger.error('getBookings error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/user/bookings/active
 * Returns the most recent active booking (pending / accepted / in_progress / completed)
 * Used by Waiting screen to poll for a worker match.
 */
const getActiveBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findFirst({
            where: {
                userId: req.user.id,
                status: { in: ['pending', 'accepted', 'in_progress', 'completed', 'disputed'] },
            },
            include: {
                category: { select: { name: true, iconUrl: true } },
                worker:   { select: { id: true, name: true, phone: true, profilePhoto: true, avgRating: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(booking ?? null);
    } catch (error) {
        logger.error('getActiveBooking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/user/bookings/:id
 * Single booking detail — only accessible by the booking's owner.
 */
const getBookingDetail = async (req, res) => {
    try {
        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: {
                category: true,
                worker:   { select: { id: true, name: true, phone: true, profilePhoto: true, avgRating: true, totalJobs: true } },
                review:   true,
                escrow:   true,
                dispute:  true,
            },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        return res.status(200).json(booking);
    } catch (error) {
        logger.error('getBookingDetail error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/user/favourites
 * Returns the customer's saved workers.
 */
const getFavourites = async (req, res) => {
    try {
        const favs = await prisma.favourite.findMany({
            where: { userId: req.user.id },
            include: {
                worker: {
                    select: {
                        id: true, name: true, profilePhoto: true,
                        avgRating: true, totalJobs: true, city: true,
                        skills: { include: { category: { select: { name: true } } } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(favs.map(f => f.worker));
    } catch (error) {
        logger.error('getFavourites error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/user/favourites/:workerId
 * Adds a worker to favourites. Idempotent.
 */
const addFavourite = async (req, res) => {
    try {
        const { workerId } = req.params;

        // Check worker exists
        const worker = await prisma.worker.findUnique({ where: { id: workerId } });
        if (!worker) return res.status(404).json({ message: 'Worker not found' });

        await prisma.favourite.upsert({
            where:  { userId_workerId: { userId: req.user.id, workerId } },
            update: {},
            create: { userId: req.user.id, workerId },
        });
        return res.status(200).json({ message: 'Added to favourites' });
    } catch (error) {
        logger.error('addFavourite error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * DELETE /api/user/favourites/:workerId
 * Removes a worker from favourites.
 */
const removeFavourite = async (req, res) => {
    try {
        const { workerId } = req.params;
        await prisma.favourite.deleteMany({
            where: { userId: req.user.id, workerId },
        });
        return res.status(200).json({ message: 'Removed from favourites' });
    } catch (error) {
        logger.error('removeFavourite error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/user/notifications
 * Returns unread notifications for the logged-in user.
 */
const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { recipientId: req.user.id, recipientType: 'user' },
            orderBy: { sentAt: 'desc' },
            take: 50,
        });
        return res.status(200).json(notifications);
    } catch (error) {
        logger.error('getNotifications error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/user/notifications/:id/read
 * Marks a notification as read.
 */
const markNotificationRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { id: req.params.id, recipientId: req.user.id },
            data:  { isRead: true },
        });
        return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        logger.error('markNotificationRead error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getBookings,
    getActiveBooking,
    getBookingDetail,
    getFavourites,
    addFavourite,
    removeFavourite,
    getNotifications,
    markNotificationRead,
};
