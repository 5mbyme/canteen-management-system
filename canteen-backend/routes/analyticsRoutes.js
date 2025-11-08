const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

// Dashboard stats
router.get('/dashboard', authenticate, authorize(['admin']), analyticsController.getDashboardStats);

// Daily sales
router.get('/daily-sales', authenticate, authorize(['admin']), analyticsController.getDailySales);

// Weekly sales
router.get('/weekly-sales', authenticate, authorize(['admin']), analyticsController.getWeeklySales);

// Monthly sales
router.get('/monthly-sales', authenticate, authorize(['admin']), analyticsController.getMonthlySales);

// Popular items
router.get('/popular-items', authenticate, authorize(['admin']), analyticsController.getPopularItems);

// Category breakdown
router.get('/category-breakdown', authenticate, authorize(['admin']), analyticsController.getCategoryBreakdown);

// Revenue stats
router.get('/revenue-stats', authenticate, authorize(['admin']), analyticsController.getRevenueStats);

// Hourly trend
router.get('/hourly-trend', authenticate, authorize(['admin']), analyticsController.getHourlyTrend);

module.exports = router;