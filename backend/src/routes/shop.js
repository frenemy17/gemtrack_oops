const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, shopController.getProfile);
router.put('/', protect, shopController.updateProfile);

module.exports = router;
