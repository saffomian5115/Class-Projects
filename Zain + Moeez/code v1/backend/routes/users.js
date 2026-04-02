// ============================================
// FOUR WHEELS — USERS ROUTES
// GET    /api/users/profile
// PUT    /api/users/profile
// POST   /api/users/avatar
// GET    /api/users/saved
// POST   /api/users/saved/:vehicleId
// DELETE /api/users/saved/:vehicleId
// ============================================

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/auth');
const upload  = require('../middleware/upload');

// ─────────────────────────────────────────────
// @route   GET /api/users/profile
// @desc    Get current user profile + my listings
// @access  Private
// ─────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const myListings = await Vehicle.find({ seller: req.user._id })
      .select('title price city type status year emoji createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      myListings,
      stats: {
        total:  myListings.length,
        active: myListings.filter(v => v.status === 'active').length,
        sold:   myListings.filter(v => v.status === 'sold').length,
        pending: myListings.filter(v => v.status === 'pending').length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
// ─────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, bio } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, city, bio },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/users/avatar
// @desc    Upload profile avatar
// @access  Private
// ─────────────────────────────────────────────
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });

    res.json({ success: true, message: 'Avatar updated', avatarUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/users/saved
// @desc    Get user's saved vehicles
// @access  Private
// ─────────────────────────────────────────────
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedVehicles',
        select: 'title price city type year emoji status',
        match: { status: 'active' },
      });

    res.json({ success: true, saved: user.savedVehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/users/saved/:vehicleId
// @desc    Save a vehicle
// @access  Private
// ─────────────────────────────────────────────
router.post('/saved/:vehicleId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.savedVehicles.includes(req.params.vehicleId)) {
      return res.status(400).json({ success: false, message: 'Vehicle already saved' });
    }

    user.savedVehicles.push(req.params.vehicleId);
    await user.save();

    // Increment vehicle saved count
    await Vehicle.findByIdAndUpdate(req.params.vehicleId, { $inc: { saved: 1 } });

    res.json({ success: true, message: 'Vehicle saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   DELETE /api/users/saved/:vehicleId
// @desc    Remove a saved vehicle
// @access  Private
// ─────────────────────────────────────────────
router.delete('/saved/:vehicleId', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedVehicles: req.params.vehicleId }
    });

    await Vehicle.findByIdAndUpdate(req.params.vehicleId, { $inc: { saved: -1 } });

    res.json({ success: true, message: 'Removed from saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
