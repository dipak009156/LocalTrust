const express = require('express');
const router  = express.Router();

const { sendOtp, verifyOtp, getMe, adminLogin } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/send-otp',    sendOtp);
router.post('/verify-otp',  verifyOtp);
router.post('/admin-login', adminLogin);
router.get ('/me',          requireAuth, getMe);

module.exports = router;