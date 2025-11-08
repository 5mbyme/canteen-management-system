const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'promo', 'system', 'payment', 'inventory'],
    default: 'order'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    default: null
  },
  isRead: { type: Boolean, default: false },
  actionUrl: String,
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Notification', notificationSchema);
