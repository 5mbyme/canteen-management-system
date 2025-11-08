const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { 
    type: Number, 
    required: true, 
    unique: true,
    min: 1,
    max: 24
  },
  status: { 
    type: String, 
    enum: ['occupied', 'unoccupied'], 
    default: 'unoccupied' 
  },
  currentOrder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    default: null
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Table', tableSchema);
