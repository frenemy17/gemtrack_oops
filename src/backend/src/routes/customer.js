// backend/src/routes/customer.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');
// For protected routes

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// GET /api/customers (with pagination/search)
router.get('/', customerController.getAllCustomers);

// POST /api/customers
router.post('/', customerController.createCustomer);

// PUT /api/customers/:id
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;