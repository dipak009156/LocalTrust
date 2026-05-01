const express = require('express');
const router = express.Router();
const { updateProfile, toggleFavourite, getFavourites } = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth');

router.patch('/profile', requireAuth, updateProfile);
router.post('/favourites', requireAuth, toggleFavourite);
router.get('/favourites', requireAuth, getFavourites);

module.exports = router;