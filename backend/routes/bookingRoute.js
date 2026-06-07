const express = require('express');
const router  = express.Router();

const { requireAuth, requireUser, requireVerifiedWorker } = require('../middleware/auth');
const sentinelGuard = require('../middleware/sentinelGuard');

const {
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
} = require('../controllers/booking.controller');

// ─── Public routes ──────────────────────────────────────────────────────────
router.get('/recent-reviews', getRecentReviews);

// ─── Public / mixed routes ───────────────────────────────────────────────────
// These require auth but may be called by USER or WORKER
router.use(requireAuth);

// Service categories
router.get('/categories',                      getCategories);
router.get('/categories/:id/workers',          getWorkersByCategory);

// Customer creates a booking
router.post('/',                               requireUser,            sentinelGuard('create_booking'),   createBooking);

// Worker views pending jobs
router.get('/pending',                         requireVerifiedWorker, getPendingBookings);

// Job lifecycle — Worker side
router.post('/:id/accept',                     requireVerifiedWorker,  sentinelGuard('accept_booking'),   acceptBooking);
router.post('/:id/verify-otp',                 requireVerifiedWorker,  sentinelGuard('verify_checkin'),   verifyCheckinOtp);
router.post('/:id/complete',                   requireVerifiedWorker,  sentinelGuard('complete_booking'), completeBooking);

// Job lifecycle — Customer side
router.post('/:id/confirm',                    requireUser,            sentinelGuard('confirm_booking'),  confirmBooking);
router.post('/:id/review',                     requireUser,            submitReview);

// Price adjustment
router.post('/:id/request-price',              requireVerifiedWorker,  sentinelGuard('request_price'),    requestPriceChange);
router.post('/:id/respond-price',              requireUser,            sentinelGuard('respond_price'),    respondPriceChange);

// Cancellation — either side
router.post('/:id/cancel',                     cancelBooking);

// In-app chat — both user and worker on the booking
router.get ('/:id/chat',                       getChat);
router.post('/:id/chat',                       sendChat);

module.exports = router;