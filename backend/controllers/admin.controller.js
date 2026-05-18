const prisma  = require('../lib/prisma');
const logger  = require('../utils/logger');

/**
 * GET /api/admin/stats
 * Platform-level metrics for the dashboard.
 */
const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalWorkers,
            pendingKyc,
            activeDisputes,
            completedBookings,
            pendingBookings,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.worker.count(),
            prisma.worker.count({ where: { aadhaarFront: { not: null }, aadhaarVerified: false } }),
            prisma.dispute.count({ where: { outcome: 'pending' } }),
            prisma.booking.count({ where: { status: 'confirmed' } }),
            prisma.booking.count({ where: { status: 'pending' } }),
        ]);

        const escrowResult = await prisma.workerEarning.aggregate({ _sum: { grossAmount: true } });

        // Fetch last 7 days of bookings for trends
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentBookings = await prisma.booking.groupBy({
            by: ['status'],
            where: { createdAt: { gte: sevenDaysAgo } },
            _count: true
        });

        return res.status(200).json({
            totalUsers,
            totalWorkers,
            pendingKyc,
            activeDisputes,
            completedBookings,
            pendingBookings,
            totalEscrow: escrowResult._sum.grossAmount ?? 0,
            recentTrends: recentBookings
        });
    } catch (error) {
        logger.error('admin getStats error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/admin/workers?status=pending_kyc|all
 * List workers, optionally filtered by KYC status.
 */
const getWorkers = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status === 'pending_kyc') {
            where.aadhaarFront   = { not: null };
            where.aadhaarVerified = false;
        }
        const workers = await prisma.worker.findMany({
            where,
            include: {
                skills: { include: { category: { select: { name: true } } } },
                _count: { select: { bookings: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return res.status(200).json(workers);
    } catch (error) {
        logger.error('admin getWorkers error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/admin/workers/:id/verify
 * Approve a worker's KYC.
 */
const verifyWorker = async (req, res) => {
    try {
        const updated = await prisma.worker.update({
            where: { id: req.params.id },
            data:  { aadhaarVerified: true, status: 'verified' },
        });
        logger.info(`Admin ${req.user.id} approved KYC for worker ${req.params.id}`);
        return res.status(200).json({ message: 'Worker verified', worker: updated });
    } catch (error) {
        logger.error('admin verifyWorker error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/admin/workers/:id/reject
 * Reject a worker's KYC — clear uploaded docs.
 * Body: { reason }
 */
const rejectWorker = async (req, res) => {
    try {
        const { reason } = req.body;
        const updated = await prisma.worker.update({
            where: { id: req.params.id },
            data:  {
                aadhaarFront:    null,
                aadhaarBack:     null,
                aadhaarSelfie:   null,
                aadhaarVerified: false,
            },
        });
        logger.info(`Admin ${req.user.id} rejected KYC for worker ${req.params.id} — reason: ${reason}`);
        return res.status(200).json({ message: 'Worker KYC rejected', worker: updated });
    } catch (error) {
        logger.error('admin rejectWorker error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/admin/customers
 * List all customers.
 */
const getCustomers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { _count: { select: { bookings: true, reviews: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return res.status(200).json(users);
    } catch (error) {
        logger.error('admin getCustomers error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/admin/bookings
 * List all bookings with customer + worker info.
 */
const getBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const bookings = await prisma.booking.findMany({
            where:   status ? { status } : {},
            include: {
                category: { select: { name: true } },
                user:     { select: { id: true, name: true, phone: true } },
                worker:   { select: { id: true, name: true, phone: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return res.status(200).json(bookings);
    } catch (error) {
        logger.error('admin getBookings error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/admin/bookings/:id
 * Single booking full detail for admin.
 */
const getBookingDetail = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where:   { id: req.params.id },
            include: {
                category: true,
                user:     true,
                worker:   true,
                review:   true,
                earning:  true,
                dispute:  true,
                chat:     { orderBy: { sentAt: 'asc' } },
            },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        return res.status(200).json(booking);
    } catch (error) {
        logger.error('admin getBookingDetail error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/admin/workers/:id/status
 * Update worker status. Body: { status }
 */
const updateWorkerStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['provisional', 'verified', 'suspended', 'banned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
        }

        const worker = await prisma.worker.update({
            where: { id: req.params.id },
            data: { status },
        });
        return res.status(200).json({ message: 'Worker status updated', worker });
    } catch (error) {
        logger.error('admin updateWorkerStatus error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/admin/disputes
 * List all disputes.
 */
const getDisputes = async (req, res) => {
    try {
        const disputes = await prisma.dispute.findMany({
            include: {
                booking: {
                    include: {
                        category: { select: { name: true } },
                        user:     { select: { id: true, name: true } },
                        worker:   { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(disputes);
    } catch (error) {
        logger.error('admin getDisputes error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/admin/disputes/:id/resolve
 * Resolve a dispute. Body: { resolution, favour }
 */
const resolveDispute = async (req, res) => {
    try {
        const { outcome, adminNote } = req.body;

        const validOutcomes = ['released_to_worker', 'refunded_to_user', 'split'];
        if (!outcome || !validOutcomes.includes(outcome)) {
            return res.status(400).json({ message: `outcome must be one of: ${validOutcomes.join(', ')}` });
        }

        const dispute = await prisma.dispute.findUnique({
            where: { id: req.params.id },
            select: { bookingId: true },
        });
        if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

        // Map dispute outcome to a booking status
        const bookingStatus =
            outcome === 'released_to_worker' ? 'confirmed' :
            outcome === 'refunded_to_user'   ? 'cancelled' :
            'confirmed'; // split — mark as confirmed (earnings handled separately)

        // Update dispute + booking in a transaction
        const [updatedDispute] = await prisma.$transaction([
            prisma.dispute.update({
                where: { id: req.params.id },
                data:  { outcome, adminNote: adminNote ?? null, resolvedAt: new Date() },
            }),
            prisma.booking.update({
                where: { id: dispute.bookingId },
                data:  { status: bookingStatus },
            }),
        ]);

        return res.status(200).json({ message: 'Dispute resolved', dispute: updatedDispute });
    } catch (error) {
        logger.error('admin resolveDispute error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/admin/categories
 * List all categories with children.
 */
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.serviceCategory.findMany({
            where: { parentId: null },
            include: { children: true },
            orderBy: { name: 'asc' },
        });
        return res.status(200).json(categories);
    } catch (error) {
        logger.error('admin getCategories error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/admin/categories
 * Create a category or sub-category. Body: { name, parentId, fixedPrice, iconUrl }
 */
const createCategory = async (req, res) => {
    try {
        const { name, parentId, fixedPrice, iconUrl } = req.body;
        const category = await prisma.serviceCategory.create({
            data: { name, parentId, fixedPrice, iconUrl },
        });
        return res.status(201).json(category);
    } catch (error) {
        logger.error('admin createCategory error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * DELETE /api/admin/categories/:id
 */
const deleteCategory = async (req, res) => {
    try {
        await prisma.serviceCategory.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        logger.error('admin deleteCategory error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getStats,
    getWorkers,
    verifyWorker,
    rejectWorker,
    getCustomers,
    getBookings,
    getBookingDetail,
    getDisputes,
    resolveDispute,
    updateWorkerStatus,
    getCategories,
    createCategory,
    deleteCategory,
};
