const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middleware/auth');

// Get all inventory
router.get('/', authenticate, inventoryController.getInventory);

// Get low stock items
router.get('/low-stock', authenticate, authorize(['admin']), inventoryController.getLowStockItems);

// Update inventory
router.put('/:itemId', authenticate, authorize(['admin']), inventoryController.updateInventory);

// Toggle availability
router.patch('/:itemId/toggle', authenticate, authorize(['admin']), inventoryController.toggleAvailability);

// Bulk update inventory
router.post('/bulk-update', authenticate, authorize(['admin']), inventoryController.bulkUpdateInventory);

module.exports = router;