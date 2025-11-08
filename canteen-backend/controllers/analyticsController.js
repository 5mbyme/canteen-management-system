const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Approved',
          createdAt: { $gte: today }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ paymentStatus: 'Pending' });

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailySales = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Approved',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeeklySales = async (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 12;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Approved',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $week: '$createdAt'
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlySales = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Approved',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPopularItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const popularItems = await Order.aggregate([
      { $match: { paymentStatus: 'Approved' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          itemName: { $arrayElemAt: ['$itemDetails.name', 0] },
          itemPrice: { $arrayElemAt: ['$itemDetails.price', 0] },
          category: { $arrayElemAt: ['$itemDetails.category', 0] }
        }
      }
    ]);

    res.json(popularItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const breakdown = await Order.aggregate([
      { $match: { paymentStatus: 'Approved' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$itemDetails.category', 0] },
          totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 },
          itemCount: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { paymentStatus: 'Approved' };
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
          maxOrderValue: { $max: '$totalAmount' },
          minOrderValue: { $min: '$totalAmount' }
        }
      }
    ]);

    res.json(stats[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      maxOrderValue: 0,
      minOrderValue: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHourlyTrend = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hourlyData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Approved',
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(hourlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};