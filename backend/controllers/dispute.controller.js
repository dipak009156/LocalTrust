const prisma = require('../lib/prisma');
const logger  = require('../utils/logger');

// ─── Helper ──────────────────────────────────────────────────────────────────
const notify = async ({ recipientId, recipientType, bookingId, type, title, body }) => {
    try {
        await prisma.notification.create({
            data: { recipientId, recipientType, bookingId, type, title, body },
        });
    } catch (err) {
        logger.warn('Failed to create notification:', err.message);
    }
};

/**
 * POST /api/dispute
 * Customer raises a dispute on a completed booking.
 * Body: { bookingId, reason, userEvidence? }
 */
const raiseDispute = async (req, res) => {
    try {
        const { bookingId, reason, userEvidence } = req.body;

        if (!bookingId || !reason) {
            return res.status(400).json({ message: 'bookingId and reason are required' });
        }

        const booking = await prisma.booking.findFirst({
            where: { id: bookingId, userId: req.user.id },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (!['completed', 'confirmed'].includes(booking.status)) {
            return res.status(409).json({ message: 'Can only dispute completed bookings' });
        }

        // Check not already disputed
        const existing = await prisma.dispute.findUnique({ where: { bookingId } });
        if (existing) return res.status(409).json({ message: 'A dispute already exists for this booking' });

        // Mark booking as disputed + create dispute row (transaction)
        const [updatedBooking, dispute] = await prisma.$transaction([
            prisma.booking.update({
                where: { id: bookingId },
                data:  { status: 'disputed' },
            }),
            prisma.dispute.create({
                data: {
                    bookingId,
                    reason,
                    userEvidence: Array.isArray(userEvidence) ? userEvidence : [],
                },
            }),
        ]);

        // Notify the worker
        if (booking.workerId) {
            await notify({
                recipientId:   booking.workerId,
                recipientType: 'worker',
                bookingId,
                type:          'dispute_raised',
                title:         'Dispute Raised ⚠️',
                body:          'A customer has raised a dispute on your booking. Please respond within 48 hours.',
            });
        }

        logger.info(`Dispute raised on booking ${bookingId} by user ${req.user.id}`);
        return res.status(201).json({ message: 'Dispute raised', dispute, booking: updatedBooking });
    } catch (error) {
        logger.error('raiseDispute error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/dispute/:bookingId
 * Returns the dispute for a booking. Accessible by the user or worker on that booking.
 */
const getDispute = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const isUser   = req.user.role === 'USER'   && booking.userId   === req.user.id;
        const isWorker = req.user.role === 'WORKER' && booking.workerId === req.user.id;
        if (!isUser && !isWorker) return res.status(403).json({ message: 'Forbidden' });

        const dispute = await prisma.dispute.findUnique({
            where:   { bookingId },
            include: { booking: { include: { category: true, user: { select: { name: true } }, worker: { select: { name: true } } } } },
        });
        if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

        return res.status(200).json(dispute);
    } catch (error) {
        logger.error('getDispute error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PATCH /api/dispute/:bookingId/respond
 * Worker submits their response and evidence.
 * Body: { workerResponse, workerEvidence? }
 */
const workerRespond = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { workerResponse, workerEvidence } = req.body;

        if (!workerResponse) return res.status(400).json({ message: 'workerResponse is required' });

        const booking = await prisma.booking.findFirst({
            where: { id: bookingId, workerId: req.user.id },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'disputed') {
            return res.status(409).json({ message: 'Booking is not in disputed state' });
        }

        const dispute = await prisma.dispute.findUnique({ where: { bookingId } });
        if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

        const updated = await prisma.dispute.update({
            where: { bookingId },
            data:  {
                workerResponse,
                workerEvidence: Array.isArray(workerEvidence) ? workerEvidence : [],
            },
        });

        return res.status(200).json({ message: 'Response submitted', dispute: updated });
    } catch (error) {
        logger.error('workerRespond error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    raiseDispute,
    getDispute,
    workerRespond,
};
