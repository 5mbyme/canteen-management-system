
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

// Create order (customer)
router.post('/', authenticate, orderController.createOrder);

// Get my orders (customer)
router.get('/my-orders', authenticate, orderController.getMyOrders);

// Get order by ID
router.get('/:orderId', authenticate, orderController.getOrderById);

// Get all orders (admin)
router.get('/', authenticate, authorize(['admin', 'cashier']), orderController.getAllOrders);

// Cancel order (customer - time limited)
router.post('/:orderId/cancel', authenticate, orderController.cancelOrder);

// Modify order (customer - time limited)
router.put('/:orderId/modify', authenticate, orderController.modifyOrder);

// Update order status (admin)
router.patch('/:orderId/status', authenticate, authorize(['admin', 'cashier']), orderController.updateOrderStatus);

// Get pending payments (admin)
router.get('/pending', authenticate, authorize(['admin']), orderController.getPendingPayments);

// Approve payment (admin)
router.post('/:orderId/approve-payment', authenticate, authorize(['admin']), orderController.approvePayment);

// Reject payment (admin)
router.post('/:orderId/reject-payment', authenticate, authorize(['admin']), orderController.rejectPayment);

module.exports = router;