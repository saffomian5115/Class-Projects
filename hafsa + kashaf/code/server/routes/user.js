const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, profile, medicalHistory } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (profile) user.profile = { ...user.profile.toObject?.() || {}, ...profile };
    if (medicalHistory) user.medicalHistory = { ...user.medicalHistory.toObject?.() || {}, ...medicalHistory };
    await user.save();
    const updated = await User.findById(req.user._id).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/user/picture
router.put('/picture', protect, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    await User.findByIdAndUpdate(req.user._id, { 'profile.profilePicture': profilePicture });
    res.json({ message: 'Profile picture updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/user/dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const Chat = require('../models/Chat');
    const chats = await Chat.find({ userId: req.user._id }).select('title createdAt messages');
    const totalMessages = chats.reduce((sum, c) => sum + c.messages.length, 0);
    res.json({
      user,
      stats: {
        totalChats: chats.length,
        totalMessages,
        recentChats: chats.slice(-3).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
