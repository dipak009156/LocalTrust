const express = require('express');
const router  = express.Router();

const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
    getStats,
    getWorkers,
    verifyWorker,
    rejectWorker,
    getCustomers,
    getBookings,
    getBookingDetail,
    getDisputes,
    resolveDispute,
    updateWorkerStatus,
    getCategories,
    createCategory,
    deleteCategory,
} = require('../controllers/admin.controller');

router.use(requireAuth, requireAdmin);

router.get ('/ping',                     (req, res) => res.json({ ok: true }));
router.get ('/stats',                    getStats);
router.get ('/workers',                  getWorkers);
router.patch('/workers/:id/verify',      verifyWorker);
router.patch('/workers/:id/reject',      rejectWorker);
router.get ('/customers',               getCustomers);
router.get ('/bookings',                getBookings);
router.get ('/bookings/:id',            getBookingDetail);
router.get ('/disputes',                getDisputes);
router.patch('/disputes/:id/resolve',   resolveDispute);
router.patch('/workers/:id/status',     updateWorkerStatus);

router.get ('/categories',              getCategories);
router.post('/categories',              createCategory);
router.delete('/categories/:id',        deleteCategory);

module.exports = router;