const express = require('express');
const router  = express.Router();

const { requireAuth, requireUser } = require('../middleware/auth');
const {
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
} = require('../controllers/user.controller');

// All user routes require authentication + USER role
router.use(requireAuth, requireUser);

router.get   ('/profile',                  getProfile);
router.patch ('/profile',                  updateProfile);
router.get   ('/bookings',                 getBookings);
router.get   ('/bookings/active',          getActiveBooking);
router.get   ('/bookings/:id',             getBookingDetail);
router.get   ('/favourites',               getFavourites);
router.post  ('/favourites/:workerId',     addFavourite);
router.delete('/favourites/:workerId',     removeFavourite);
router.get   ('/notifications',            getNotifications);
router.patch ('/notifications/:id/read',   markNotificationRead);

module.exports = router;