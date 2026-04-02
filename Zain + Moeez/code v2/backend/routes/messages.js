const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Send a message about a vehicle
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { vehicleId, message } = req.body;
        
        // Find vehicle to get seller ID
        const vehicle = await Vehicle.findById(vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        // Cannot send message to yourself
        if (vehicle.sellerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot send a message about your own vehicle'
            });
        }
        
        // Create message
        const newMessage = await Message.create({
            vehicleId,
            buyerId: req.user._id,
            sellerId: vehicle.sellerId,
            message
        });
        
        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/messages/inbox
// @desc    Get messages received (as seller)
// @access  Private
router.get('/inbox', protect, async (req, res) => {
    try {
        const messages = await Message.find({ sellerId: req.user._id })
            .populate('buyerId', 'name email phone')
            .populate('vehicleId', 'title brand model price')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/messages/sent
// @desc    Get messages sent (as buyer)
// @access  Private
router.get('/sent', protect, async (req, res) => {
    try {
        const messages = await Message.find({ buyerId: req.user._id })
            .populate('sellerId', 'name email phone')
            .populate('vehicleId', 'title brand model price')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        // Only seller can mark as read
        if (message.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        message.isRead = true;
        await message.save();
        
        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        // Check if user is sender or receiver
        if (message.buyerId.toString() !== req.user._id.toString() && 
            message.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        await message.deleteOne();
        
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;