// ============================================
// FOUR WHEELS — MESSAGE MODEL
// ============================================

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for fast conversation fetch
MessageSchema.index({ sender: 1, receiver: 1, vehicle: 1 });

module.exports = mongoose.model('Message', MessageSchema);
