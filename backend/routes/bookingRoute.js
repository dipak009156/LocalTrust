const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getBookings, 
    getBookingById, 
    cancelBooking, 
    updateBookingStatus 
} = require('../controllers/booking.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, getBookings);
router.get('/:id', requireAuth, getBookingById);
router.patch('/:id/cancel', requireAuth, cancelBooking);
router.patch('/:id/status', requireAuth, updateBookingStatus);

module.exports = router;