const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['snacks', 'meals', 'beverages', 'desserts'], required: true },
  imageUrl: { type: String, default: '' },
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);

