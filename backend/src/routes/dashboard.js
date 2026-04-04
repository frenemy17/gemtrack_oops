const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', protect, dashboardController.getStats);
router.get('/sales-over-time', protect, dashboardController.getSalesOverTime);
router.get('/top-items', protect, dashboardController.getTopSellingItems);
router.get('/customer-dues', protect, dashboardController.getCustomerDues);
router.get('/sales-by-year', protect, dashboardController.getSalesByYear);
router.get('/sales-by-category', protect, dashboardController.getSalesByCategory);
router.get('/pieces-by-metal', protect, dashboardController.getPiecesByMetal);
router.get('/total-sales-stats', protect, dashboardController.getTotalSalesStats);
router.get('/recent-sales', protect, dashboardController.getRecentSales);

module.exports = router;