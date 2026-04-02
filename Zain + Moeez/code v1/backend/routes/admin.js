// ============================================
// FOUR WHEELS — ADMIN ROUTES
// GET    /api/admin/stats
// GET    /api/admin/users
// PUT    /api/admin/users/:id
// DELETE /api/admin/users/:id
// GET    /api/admin/vehicles
// PUT    /api/admin/vehicles/:id/status
// PUT    /api/admin/vehicles/:id
// DELETE /api/admin/vehicles/:id
// ============================================

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Message = require('../models/Message');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ─────────────────────────────────────────────
// @route   GET /api/admin/stats
// @desc    Dashboard statistics
// @access  Admin
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      bannedUsers,
      totalVehicles,
      activeVehicles,
      pendingVehicles,
      rejectedVehicles,
      totalMessages,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ status: 'banned' }),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'active' }),
      Vehicle.countDocuments({ status: 'pending' }),
      Vehicle.countDocuments({ status: 'rejected' }),
      Message.countDocuments(),
    ]);

    // Monthly listings for bar chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Vehicle.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Vehicle type breakdown
    const typeBreakdown = await Vehicle.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, bannedUsers,
        totalVehicles, activeVehicles, pendingVehicles, rejectedVehicles,
        totalMessages,
      },
      monthlyData,
      typeBreakdown,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// USERS MANAGEMENT
// ─────────────────────────────────────────────

// GET all users
router.get('/users', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const query = { role: 'user' };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName:  new RegExp(search, 'i') },
        { email:     new RegExp(search, 'i') },
        { city:      new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, users, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE user
router.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, city, status },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated', user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
    }

    // Also delete their vehicles
    await Vehicle.deleteMany({ seller: req.params.id });
    await user.deleteOne();

    res.json({ success: true, message: 'User and all their listings deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// VEHICLES MANAGEMENT
// ─────────────────────────────────────────────

// GET all vehicles (admin sees all statuses)
router.get('/vehicles', async (req, res) => {
  try {
    const { search, status, type, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type)   query.type   = type;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { city:  new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('seller', 'firstName lastName email'),
      Vehicle.countDocuments(query),
    ]);

    res.json({ success: true, vehicles, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// APPROVE or REJECT vehicle
router.put('/vehicles/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'rejected', 'pending', 'sold'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('seller', 'firstName email');

    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    res.json({
      success: true,
      message: `Vehicle ${status === 'active' ? 'approved' : status}`,
      vehicle,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// EDIT vehicle (admin full edit)
router.put('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, message: 'Vehicle updated', vehicle });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE vehicle
router.delete('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    await vehicle.deleteOne();
    res.json({ success: true, message: 'Vehicle listing deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
