const express = require('express');
const router = express.Router();
const { authenticateToken, adminMiddleware } = require('../middleware/auth');
const adminController = require('../controllers/admincontroller');

// Get admin settings
router.get('/admin/settings', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const settings = await adminController.getAdminSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ message: 'Failed to fetch admin settings' });
  }
});

// Update admin settings
router.put('/admin/settings', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    await adminController.updateAdminSettings(req.body);
    res.json({ message: 'Admin settings updated successfully' });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ message: 'Failed to update admin settings' });
  }
});

module.exports = router;