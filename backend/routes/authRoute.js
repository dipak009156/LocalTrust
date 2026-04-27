const express = require("express");
const router = express.Router();

const { userInitialization } = require('../controllers/auth.controller');

router.post('/user-init', userInitialization);

module.exports = router;