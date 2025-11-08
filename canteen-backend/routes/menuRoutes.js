const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// All logged-in users can access
router.get('/', authenticate, menuController.getAllMenuItems);
router.get('/category/:category', authenticate, menuController.getMenuByCategory);

// Only admins can access
router.post('/', authenticate, authorize(['admin']), (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('image')(req, res, next);
}, menuController.createMenuItem);

router.put('/:itemId', authenticate, authorize(['admin']), (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('image')(req, res, next);
}, menuController.updateMenuItem);

router.delete('/:itemId', authenticate, authorize(['admin']), menuController.deleteMenuItem);

module.exports = router;
