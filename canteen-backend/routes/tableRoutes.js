const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { authenticate } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Initialize tables (admin only)
router.post('/initialize', authenticate, authorize(['admin']), tableController.initializeTables);

// Get all tables (authenticated users can view)
router.get('/', authenticate, tableController.getAllTables);

// Update table status (admin and cashier only)
router.put('/:tableNumber', authenticate, authorize(['admin', 'cashier']), tableController.updateTableStatus);

module.exports = router;
