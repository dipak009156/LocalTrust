const express = require("express");
const router = express.Router();

const { userInitialization } = require('../controllers/auth.controller');

router.post('/user-init', userInitialization);
router.get('/me', )

module.exports = router;