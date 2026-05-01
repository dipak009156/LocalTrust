const express = require('express');
const router = express.Router();
const { submitReview, getWorkerReviews } = require('../controllers/review.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, submitReview);
router.get('/worker/:workerId', getWorkerReviews);

module.exports = router;
