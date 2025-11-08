const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const auth = require('../middleware/auth');

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({ available: true }).sort({ date: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: 'Food item not found' });
    }
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new food (Admin only)
router.post('/', auth, async (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;

  try {
    const newFood = new Food({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      available: stock > 0
    });

    const food = await newFood.save();
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
