const express = require('express');
const router = express.Router();
const { raiseDispute, respondToDispute, getDisputeById } = require('../controllers/dispute.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, raiseDispute);
router.patch('/:id/respond', requireAuth, respondToDispute);
router.get('/:id', requireAuth, getDisputeById);

module.exports = router;