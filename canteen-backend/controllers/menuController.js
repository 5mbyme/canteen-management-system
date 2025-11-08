const MenuItem = require('../models/MenuItem');
const path = require('path');
const fs = require('fs');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get menu items by category
exports.getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await MenuItem.find({ category });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create menu item with image upload
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, stock, available } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/menu/${req.file.filename}`;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      stock: stock || 50,
      available: available !== undefined ? available : true,
      image: imageUrl,
      imageUrl: imageUrl,
      slug
    });

    await menuItem.save();
    res.status(201).json({ 
      message: 'Menu item created successfully', 
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, description, price, category, stock, available } = req.body;

    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (menuItem.image) {
        const oldImagePath = path.join(__dirname, '../' + menuItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      menuItem.image = `/uploads/menu/${req.file.filename}`;
      menuItem.imageUrl = `/uploads/menu/${req.file.filename}`;
    }

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;
    if (stock !== undefined) menuItem.stock = stock;
    if (available !== undefined) menuItem.available = available;
    if (name) menuItem.slug = name.toLowerCase().replace(/\s+/g, '-');

    menuItem.updatedAt = Date.now();
    await menuItem.save();

    res.status(200).json({ 
      message: 'Menu item updated successfully', 
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const menuItem = await MenuItem.findByIdAndDelete(itemId);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Delete image file
    if (menuItem.image) {
      const imagePath = path.join(__dirname, '../' + menuItem.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
