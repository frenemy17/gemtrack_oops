const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getMarketRates, getMarketNews } = require('../controllers/marketController');

router.get('/rates', protect, getMarketRates);
router.get('/news', protect, getMarketNews);

router.get('/debug', (req, res) => {
    res.json({
        nodeVersion: process.version,
        fetchAvailable: typeof fetch !== 'undefined',
        apiKeyConfigured: !!(process.env.GOLD_API_KEY || 'goldapi-3gssmipo4jj7-io'),
        envKey: process.env.GOLD_API_KEY ? 'Set in ENV' : 'Using Fallback'
    });
});

module.exports = router;