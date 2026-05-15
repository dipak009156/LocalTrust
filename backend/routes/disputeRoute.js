const express = require('express');
const router  = express.Router();

const { requireAuth } = require('../middleware/auth');
const { raiseDispute, getDispute, workerRespond } = require('../controllers/dispute.controller');

router.use(requireAuth);

router.post  ('/',                  raiseDispute);     // Customer raises a dispute
router.get   ('/:bookingId',        getDispute);       // User or Worker views dispute
router.patch ('/:bookingId/respond', workerRespond);   // Worker submits their response

module.exports = router;