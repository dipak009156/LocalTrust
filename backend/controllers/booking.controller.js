const prisma = require('../lib/prisma');
const logger  = require('../utils/logger');

// ─── Helper: create a notification row ──────────────────────────────────────
const notify = async ({ recipientId, recipientType, bookingId, type, title, body }) => {
    try {
        await prisma.notification.create({
            data: { recipientId, recipientType, bookingId, type, title, body },
        });
    } catch (err) {
        logger.warn('Failed to create notification:', err.message);
    }
};

// ─── Helper: generate a 4-digit OTP code ────────────────────────────────────
const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

// ─── Helper: recalculate worker avg rating ──────────────────────────────────
const refreshWorkerRating = async (workerId) => {
    const reviews = await prisma.review.findMany({
        where:  { workerId },
        select: { rating: true },
    });
    if (reviews.length === 0) return;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await prisma.worker.update({
        where: { id: workerId },
        data:  { avgRating: parseFloat(avg.toFixed(2)) },
    });
};

/**
 * POST /api/booking
 * Customer creates a new booking.
 * Body: { categoryId, address, lat?, lng?, problemDesc?, problemPhoto?, scheduledAt?, isInspection? }
 */
const createBooking = async (req, res) => {
    try {
        const {
            categoryId,
            address,
            lat,
            lng,
            problemDesc,
            problemPhoto,
            scheduledAt,
            isInspection,
        } = req.body;

        if (!categoryId || !address) {
            return res.status(400).json({ message: 'categoryId and address are required' });
        }

        const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const basePrice   = isInspection ? 99 : (category.fixedPrice ?? 0);
        const inspectionFee = isInspection ? 99 : null;

        const booking = await prisma.booking.create({
            data: {
                userId:        req.user.id,
                categoryId,
                address,
                lat:           lat    ?? null,
                lng:           lng    ?? null,
                problemDesc:   problemDesc   ?? null,
                problemPhoto:  problemPhoto  ?? null,
                scheduledAt:   scheduledAt   ? new Date(scheduledAt) : null,
                isInspection:  Boolean(isInspection),
                inspectionFee,
                basePrice,
                status:        'pending',
            },
            include: { category: true },
        });

        logger.info(`Booking ${booking.id} created by user ${req.user.id}`);
        return res.status(201).json(booking);
    } catch (error) {
        logger.error('createBooking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/booking/pending
 * Returns all pending bookings near the worker (no location filter yet — will filter once location is integrated).
 * Worker-facing. Only returns bookings that match at least one of their skills.
 */
const getPendingBookings = async (req, res) => {
    try {
        // In production, only verified workers see jobs. 
        // For testing/demo, we allow all except suspended/banned.
        if (['suspended', 'banned'].includes(req.user.data.status)) {
            return res.status(403).json({ message: 'Your account is suspended' });
        }

        // Grab worker's skill category IDs
        const skills = await prisma.workerSkill.findMany({
            where:  { workerId: req.user.id },
            select: { categoryId: true },
        });
        const baseCategoryIds = skills.map(s => s.categoryId);

        let categoryIds = [...baseCategoryIds];
        
        // If worker has parent categories, include all their children in the filter
        if (baseCategoryIds.length > 0) {
            const children = await prisma.serviceCategory.findMany({
                where: { parentId: { in: baseCategoryIds } },
                select: { id: true }
            });
            categoryIds = [...categoryIds, ...children.map(c => c.id)];
        }

        const where = {
            status:     'pending',
            workerId:   null,
        };

        // Filter by skills only if they have picked some. 
        if (baseCategoryIds.length > 0) {
            where.categoryId = { in: categoryIds };
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                category: { select: { name: true, iconUrl: true } },
                user:     { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
            take:    20,
        });

        console.log(`[DEBUG] Worker ${req.user.id} fetching pending jobs. Found: ${bookings.length}. Where:`, JSON.stringify(where));

        return res.status(200).json(bookings);
    } catch (error) {
        logger.error('getPendingBookings error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/accept
 * Worker accepts a pending booking.
 */
const acceptBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'pending') {
            return res.status(409).json({ message: `Cannot accept booking with status '${booking.status}'` });
        }
        if (booking.workerId) {
            return res.status(409).json({ message: 'Booking already accepted by another worker' });
        }

        const otp = generateOtp();

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data:  {
                workerId:   req.user.id,
                status:     'accepted',
                otpCode:    otp,
                acceptedAt: new Date(),
            },
            include: {
                category: true,
                user:     { select: { id: true, name: true, phone: true } },
            },
        });

        // Notify customer
        await notify({
            recipientId:   updated.userId,
            recipientType: 'user',
            bookingId:     updated.id,
            type:          'booking_accepted',
            title:         'Worker Found! 🎉',
            body:          `A worker is on the way for your ${updated.category.name} booking.`,
        });

        logger.info(`Booking ${booking.id} accepted by worker ${req.user.id}`);
        return res.status(200).json({ message: 'Booking accepted', booking: updated });
    } catch (error) {
        logger.error('acceptBooking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/verify-otp
 * Worker enters the 4-digit OTP shown to the customer to confirm check-in.
 */
const verifyCheckinOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) return res.status(400).json({ message: 'OTP is required' });

        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, workerId: req.user.id },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'accepted') {
            return res.status(409).json({ message: `Cannot verify OTP for status '${booking.status}'` });
        }

        if (String(booking.otpCode) !== String(otp)) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data:  {
                otpVerified: true,
                status:      'in_progress',
                startedAt:   new Date(),
            },
        });

        await notify({
            recipientId:   booking.userId,
            recipientType: 'user',
            bookingId:     booking.id,
            type:          'job_started',
            title:         'Job Started ✅',
            body:          'The worker has checked in and started working.',
        });

        return res.status(200).json({ message: 'OTP verified. Job is now in progress.', booking: updated });
    } catch (error) {
        logger.error('verifyCheckinOtp error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/complete
 * Worker marks the job as complete and uploads a proof photo URL.
 * Body: { proofPhoto } — Firebase Storage URL
 */
const completeBooking = async (req, res) => {
    try {
        const { proofPhoto } = req.body;

        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, workerId: req.user.id },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'in_progress') {
            return res.status(409).json({ message: `Cannot complete booking with status '${booking.status}'` });
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data:  {
                status:      'completed',
                proofPhoto:  proofPhoto ?? null,
                completedAt: new Date(),
            },
        });

        await notify({
            recipientId:   booking.userId,
            recipientType: 'user',
            bookingId:     booking.id,
            type:          'job_completed',
            title:         'Job Completed 🏁',
            body:          'Please confirm the job and leave a review.',
        });

        return res.status(200).json({ message: 'Booking marked as completed', booking: updated });
    } catch (error) {
        logger.error('completeBooking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/confirm
 * Customer confirms the completed job — this triggers escrow release logic.
 */
const confirmBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: { worker: true, category: true },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'completed') {
            return res.status(409).json({ message: `Cannot confirm booking with status '${booking.status}'` });
        }
        if (!booking.workerId) return res.status(400).json({ message: 'No worker assigned' });

        const finalPrice = booking.finalPrice ?? booking.basePrice;
        const commission = parseFloat((finalPrice * 0.15).toFixed(2));
        const netAmount  = parseFloat((finalPrice - commission).toFixed(2));

        // Confirm booking + create escrow + create earning in a transaction
        const [updatedBooking] = await prisma.$transaction([
            prisma.booking.update({
                where: { id: booking.id },
                data:  { status: 'confirmed', confirmedAt: new Date() },
            }),
            prisma.workerEarning.upsert({
                where:  { bookingId: booking.id },
                create: {
                    workerId:    booking.workerId,
                    bookingId:   booking.id,
                    grossAmount: finalPrice,
                    commission,
                    netAmount,
                },
                update: { grossAmount: finalPrice, commission, netAmount },
            }),
            // Increment worker's totalJobs
            prisma.worker.update({
                where: { id: booking.workerId },
                data:  { totalJobs: { increment: 1 } },
            }),
        ]);

        // Notify worker
        await notify({
            recipientId:   booking.workerId,
            recipientType: 'worker',
            bookingId:     booking.id,
            type:          'job_confirmed',
            title:         'Payment Confirmed 💰',
            body:          `You earned ₹${netAmount} for ${booking.category.name}.`,
        });

        return res.status(200).json({ message: 'Booking confirmed', booking: updatedBooking });
    } catch (error) {
        logger.error('confirmBooking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/cancel
 * Customer or worker cancels a booking (only while pending/accepted).
 */
const cancelBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Only the owner (user) or assigned worker can cancel
        const isUser   = req.user.role === 'USER'   && booking.userId   === req.user.id;
        const isWorker = req.user.role === 'WORKER' && booking.workerId === req.user.id;
        if (!isUser && !isWorker) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (!['pending', 'accepted'].includes(booking.status)) {
            return res.status(409).json({ message: `Cannot cancel booking with status '${booking.status}'` });
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data:  { status: 'cancelled', cancelledAt: new Date() },
        });

        return res.status(200).json({ message: 'Booking cancelled', booking: updated });
    } catch (error) {
        logger.error('cancelBooking error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/review
 * Customer submits a review after job is confirmed.
 * Body: { rating, punctuality?, quality?, behaviour?, value?, comment?, tags? }
 */
const submitReview = async (req, res) => {
    try {
        const { rating, punctuality, quality, behaviour, value, comment, tags } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'confirmed') {
            return res.status(409).json({ message: 'Can only review confirmed bookings' });
        }
        if (!booking.workerId) return res.status(400).json({ message: 'No worker assigned' });

        // Check if already reviewed
        const existing = await prisma.review.findUnique({ where: { bookingId: booking.id } });
        if (existing) return res.status(409).json({ message: 'Review already submitted' });

        const review = await prisma.review.create({
            data: {
                bookingId:   booking.id,
                userId:      req.user.id,
                workerId:    booking.workerId,
                rating,
                punctuality: punctuality ?? null,
                quality:     quality     ?? null,
                behaviour:   behaviour   ?? null,
                value:       value       ?? null,
                comment:     comment     ?? null,
                tags:        tags        ?? [],
            },
        });

        // Update the worker's average rating
        await refreshWorkerRating(booking.workerId);

        return res.status(201).json({ message: 'Review submitted', review });
    } catch (error) {
        logger.error('submitReview error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/booking/:id/chat
 * Returns all chat messages for a booking.
 */
const getChat = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Only the user or the worker on this booking can read the chat
        const isUser   = req.user.role === 'USER'   && booking.userId   === req.user.id;
        const isWorker = req.user.role === 'WORKER' && booking.workerId === req.user.id;
        const isAdmin  = req.user.role === 'ADMIN';
        if (!isUser && !isWorker && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

        const messages = await prisma.chatMessage.findMany({
            where:   { bookingId: req.params.id },
            orderBy: { sentAt: 'asc' },
        });
        return res.status(200).json(messages);
    } catch (error) {
        logger.error('getChat error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/chat
 * Sends a chat message. Body: { message }
 */
const sendChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });

        const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const isUser   = req.user.role === 'USER'   && booking.userId   === req.user.id;
        const isWorker = req.user.role === 'WORKER' && booking.workerId === req.user.id;
        if (!isUser && !isWorker) return res.status(403).json({ message: 'Forbidden' });

        const msg = await prisma.chatMessage.create({
            data: {
                bookingId:  booking.id,
                senderRole: req.user.role === 'USER' ? 'user' : 'worker',
                userId:     req.user.role === 'USER'   ? req.user.id : null,
                workerId:   req.user.role === 'WORKER' ? req.user.id : null,
                message:    message.trim(),
            },
        });
        return res.status(201).json(msg);
    } catch (error) {
        logger.error('sendChat error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/booking/categories
 * Returns all active service categories for the home screen grid.
 */
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.serviceCategory.findMany({
            where:   { isActive: true },
            orderBy: { name: 'asc' },
        });
        return res.status(200).json(categories);
    } catch (error) {
        logger.error('getCategories error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/booking/categories/:id/workers
 * Returns workers who offer a given service category — for the WorkerDetail screen.
 */
const getWorkersByCategory = async (req, res) => {
    try {
        const skills = await prisma.workerSkill.findMany({
            where: { categoryId: req.params.id },
            include: {
                worker: {
                    select: {
                        id: true, name: true, profilePhoto: true,
                        avgRating: true, totalJobs: true, city: true, isAvailable: true,
                    },
                },
            },
        });
        const workers = skills
            .map(s => s.worker)
            .filter(w => w.isAvailable);

        return res.status(200).json(workers);
    } catch (error) {
        logger.error('getWorkersByCategory error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/request-price
 * Worker requests a price change with a reason.
 */
const requestPriceChange = async (req, res) => {
    try {
        const { amount, reason } = req.body;
        const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.workerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        if (booking.status !== 'accepted' && booking.status !== 'in_progress') {
            return res.status(400).json({ message: 'Price can only be changed during en-route or in-progress status' });
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: {
                adjustmentPrice:  parseFloat(amount),
                adjustmentReason: reason,
            }
        });

        return res.status(200).json({ message: 'Price change requested', booking: updated });
    } catch (error) {
        logger.error('requestPriceChange error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/booking/:id/respond-price
 * Customer accepts or rejects a price change.
 */
const respondPriceChange = async (req, res) => {
    try {
        const { action } = req.body; // 'accept' | 'reject'
        const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        
        if (!booking.adjustmentPrice) {
            return res.status(400).json({ message: 'No pending price adjustment found' });
        }

        let updateData = {
            adjustmentPrice:  null,
            adjustmentReason: null,
        };

        if (action === 'accept') {
            updateData.finalPrice = booking.adjustmentPrice;
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data:  updateData,
        });

        return res.status(200).json({ 
            message: action === 'accept' ? 'Price adjustment approved' : 'Price adjustment rejected', 
            booking: updated 
        });
    } catch (error) {
        logger.error('respondPriceChange error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getRecentReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            take: 15,
            include: {
                user: { select: { name: true, city: true } },
                booking: { include: { category: { select: { name: true } } } },
            },
        });
        return res.status(200).json(reviews);
    } catch (error) {
        logger.error('getRecentReviews error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createBooking,
    getPendingBookings,
    acceptBooking,
    verifyCheckinOtp,
    completeBooking,
    confirmBooking,
    cancelBooking,
    submitReview,
    getChat,
    sendChat,
    getCategories,
    getWorkersByCategory,
    requestPriceChange,
    respondPriceChange,
    getRecentReviews,
};
