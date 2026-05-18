const express = require('express');
const router  = express.Router();

const { requireAuth, requireUser, requireVerifiedWorker } = require('../middleware/auth');
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
} = require('../controllers/booking.controller');

// ─── Public / mixed routes ───────────────────────────────────────────────────
// These require auth but may be called by USER or WORKER
router.use(requireAuth);

// Service categories
router.get('/categories',                      getCategories);
router.get('/categories/:id/workers',          getWorkersByCategory);

// Customer creates a booking
router.post('/',                               requireUser, createBooking);

// Worker views pending jobs
router.get('/pending',                         requireVerifiedWorker, getPendingBookings);

// Job lifecycle — Worker side
router.post('/:id/accept',                     requireVerifiedWorker, acceptBooking);
router.post('/:id/verify-otp',                 requireVerifiedWorker, verifyCheckinOtp);
router.post('/:id/complete',                   requireVerifiedWorker, completeBooking);

// Job lifecycle — Customer side
router.post('/:id/confirm',                    requireUser, confirmBooking);
router.post('/:id/review',                     requireUser, submitReview);

// Price adjustment
router.post('/:id/request-price',              requireVerifiedWorker, requestPriceChange);
router.post('/:id/respond-price',              requireUser, respondPriceChange);

// Cancellation — either side
router.post('/:id/cancel',                     cancelBooking);

// In-app chat — both user and worker on the booking
router.get ('/:id/chat',                       getChat);
router.post('/:id/chat',                       sendChat);

module.exports = router;