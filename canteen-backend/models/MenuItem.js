const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['meals', 'snacks', 'beverages', 'desserts'],
    required: true
  },
  image: { type: String }, // Store image path/URL
  imageUrl: { type: String }, // For compatibility
  stock: { type: Number, default: 50 },
  available: { type: Boolean, default: true },
  slug: { type: String, unique: true }, // For URL-friendly names
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
