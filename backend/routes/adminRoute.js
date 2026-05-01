const express = require('express');
const router = express.Router();
const { 
    getPendingWorkers, 
    verifyWorker, 
    getDisputes, 
    resolveDispute 
} = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/workers/pending', requireAuth, requireAdmin, getPendingWorkers);
router.patch('/workers/:id/verify', requireAuth, requireAdmin, verifyWorker);
router.get('/disputes', requireAuth, requireAdmin, getDisputes);
router.patch('/disputes/:id/resolve', requireAuth, requireAdmin, resolveDispute);

module.exports = router;