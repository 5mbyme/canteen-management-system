const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Food = require('../models/Food');
const auth = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
  const { items, totalAmount, paymentMethod, roomNumber } = req.body;

  try {
    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      paymentMethod,
      roomNumber
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.food')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all orders (Admin)
router.get('/all', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', ['name', 'email', 'role'])
      .populate('items.food')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update order status (Admin only)
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    if (status === 'confirmed') {
      order.confirmedAt = Date.now();
    }
    if (status === 'delivered') {
      order.completedAt = Date.now();
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
