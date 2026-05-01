const express = require("express");
const router = express.Router();
const { userInitialization, getMe } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/user-init', userInitialization);
router.get('/me', requireAuth, getMe);

module.exports = router;