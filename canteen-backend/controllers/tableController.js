const Table = require('../models/Table');

// Initialize 24 tables
exports.initializeTables = async (req, res) => {
  try {
    const existingTables = await Table.countDocuments();
    if (existingTables === 0) {
      const tables = [];
      for (let i = 1; i <= 24; i++) {
        tables.push({ tableNumber: i, status: 'unoccupied' });
      }
      await Table.insertMany(tables);
      return res.status(201).json({ message: '24 tables initialized successfully' });
    }
    res.status(200).json({ message: 'Tables already initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate('currentOrder');
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { status, orderId } = req.body;
    
    const table = await Table.findOneAndUpdate(
      { tableNumber },
      { 
        status, 
        currentOrder: orderId || null,
        lastUpdated: Date.now()
      },
      { new: true }
    );
    
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
