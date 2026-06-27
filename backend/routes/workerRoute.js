const express = require('express');
const router  = express.Router();

const { requireAuth, requireWorker, requireVerifiedWorker } = require('../middleware/auth');
const sentinelGuard = require('../middleware/sentinelGuard');
const {
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
} = require('../controllers/worker.controller');

// All worker routes require Firebase authentication
router.use(requireAuth, requireWorker);

router.get   ('/profile',                  getProfile);
router.patch ('/profile',                  updateProfile);
router.patch ('/availability',             sentinelGuard('toggle_availability'), toggleAvailability);
router.post  ('/kyc',                      sentinelGuard('submit_kyc'),          submitKyc);
router.post  ('/skills',                   sentinelGuard('save_skills'),         saveSkills);
router.get   ('/jobs',                     requireVerifiedWorker, getJobs);
router.get   ('/bookings/:id',             requireVerifiedWorker, getBookingDetail);
router.get   ('/earnings',                 requireVerifiedWorker, getEarnings);
router.get   ('/notifications',            getNotifications);
router.patch ('/notifications/:id/read',   markNotificationRead);

module.exports = router;