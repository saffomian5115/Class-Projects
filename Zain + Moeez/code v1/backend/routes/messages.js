// ============================================
// FOUR WHEELS — MESSAGES ROUTES
// POST /api/messages              — send message
// GET  /api/messages/inbox        — get all conversations
// GET  /api/messages/:vehicleId/:userId — get conversation thread
// PUT  /api/messages/read/:senderId — mark messages as read
// ============================================

const express = require('express');
const router  = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// ─────────────────────────────────────────────
// @route   POST /api/messages
// @desc    Send a message to a seller
// @access  Private
// ─────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, vehicleId, text } = req.body;

    if (!receiverId || !vehicleId || !text?.trim()) {
      return res.status(400).json({ success: false, message: 'receiverId, vehicleId and text are required' });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot message yourself' });
    }

    const message = await Message.create({
      sender:   req.user._id,
      receiver: receiverId,
      vehicle:  vehicleId,
      text:     text.trim(),
    });

    await message.populate('sender', 'firstName lastName avatar');
    await message.populate('vehicle', 'title price');

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/messages/inbox
// @desc    Get all unique conversations for the logged-in user
// @access  Private
// ─────────────────────────────────────────────
router.get('/inbox', protect, async (req, res) => {
  try {
    // Get latest message from each conversation
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .populate('sender',   'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')
      .populate('vehicle',  'title price');

    // Group by conversation (vehicleId + otherUserId)
    const seen = new Set();
    const conversations = [];
    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === req.user._id.toString()
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();
      const key = `${msg.vehicle._id}-${otherId}`;
      if (!seen.has(key)) {
        seen.add(key);
        const otherUser = msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver : msg.sender;
        conversations.push({
          key,
          vehicle:   msg.vehicle,
          otherUser,
          lastMessage: msg.text,
          lastTime:    msg.createdAt,
          unread:      !msg.isRead && msg.receiver._id.toString() === req.user._id.toString(),
        });
      }
    });

    res.json({ success: true, count: conversations.length, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/messages/:vehicleId/:userId
// @desc    Get full conversation thread
// @access  Private
// ─────────────────────────────────────────────
router.get('/:vehicleId/:userId', protect, async (req, res) => {
  try {
    const { vehicleId, userId } = req.params;
    const myId = req.user._id;

    const thread = await Message.find({
      vehicle: vehicleId,
      $or: [
        { sender: myId,   receiver: userId },
        { sender: userId, receiver: myId   },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName avatar');

    res.json({ success: true, count: thread.length, thread });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   PUT /api/messages/read/:senderId
// @desc    Mark all messages from a sender as read
// @access  Private
// ─────────────────────────────────────────────
router.put('/read/:senderId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.senderId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
