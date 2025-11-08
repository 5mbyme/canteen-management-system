const MenuItem = require('../models/MenuItem');
const Notification = require('../models/Notification');

const LOW_STOCK_THRESHOLD = 10;

exports.getInventory = async (req, res) => {
  try {
    const inventory = await MenuItem.find().select('name stock available category price');
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;

    const item = await MenuItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const oldQuantity = item.stock;
    item.stock = quantity;

    if (quantity < LOW_STOCK_THRESHOLD) {
      item.available = false;
      
      // Create notification for admin
      await Notification.create({
        customerId: null,
        type: 'inventory',
        title: `Low Stock Alert: ${item.name}`,
        message: `${item.name} has only ${quantity} items left. Stock is below threshold.`,
        relatedItemId: itemId
      });
    } else {
      item.available = true;
    }

    await item.save();

    res.status(200).json({
      message: 'Inventory updated',
      item: {
        _id: item._id,
        name: item.name,
        oldQuantity,
        newQuantity: quantity,
        reason,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await MenuItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.available = !item.available;
    await item.save();

    res.status(200).json({
      message: `Item ${item.available ? 'enabled' : 'disabled'}`,
      item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await MenuItem.find({
      stock: { $lt: LOW_STOCK_THRESHOLD }
    }).select('name stock category price');

    res.status(200).json(lowStockItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkUpdateInventory = async (req, res) => {
  try {
    const { items } = req.body;
    
    const results = [];
    for (let item of items) {
      const updated = await MenuItem.findByIdAndUpdate(
        item.itemId,
        { stock: item.quantity },
        { new: true }
      );
      results.push(updated);
    }

    res.status(200).json({
      message: 'Bulk inventory updated',
      items: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};