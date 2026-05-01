const express = require('express');
const router = express.Router();
const { 
    updateProfile, 
    updateLocation, 
    updateSkills, 
    submitKYC, 
    updateAvailability, 
    getEarnings 
} = require('../controllers/worker.controller');
const { requireAuth, requireWorker } = require('../middleware/auth');

router.patch('/profile', requireAuth, requireWorker, updateProfile);
router.patch('/location', requireAuth, requireWorker, updateLocation);
router.post('/skills', requireAuth, requireWorker, updateSkills);
router.post('/kyc', requireAuth, requireWorker, submitKYC);
router.patch('/availability', requireAuth, requireWorker, updateAvailability);
router.get('/earnings', requireAuth, requireWorker, getEarnings);

module.exports = router;