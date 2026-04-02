const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { protect, admin } = require('../middleware/auth');

// All admin routes are protected with admin middleware

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        
        res.json({
            success: true,
            users
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

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Private/Admin
router.get('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user
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

// @route   PUT /api/admin/users/:id
// @desc    Update user (admin)
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const { name, email, phone, city, role, isBlocked } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (city) user.city = city;
        if (role) user.role = role;
        if (isBlocked !== undefined) user.isBlocked = isBlocked;
        
        await user.save();
        
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                role: user.role,
                isBlocked: user.isBlocked
            }
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

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (admin)
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }
        
        // Also delete all vehicles of this user
        await Vehicle.deleteMany({ sellerId: user._id });
        
        await user.deleteOne();
        
        res.json({
            success: true,
            message: 'User and their vehicles deleted successfully'
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

// @route   GET /api/admin/vehicles
// @desc    Get all vehicles (including pending)
// @access  Private/Admin
router.get('/vehicles', protect, admin, async (req, res) => {
    try {
        const { status, limit = 50, page = 1 } = req.query;
        
        let filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const vehicles = await Vehicle.find(filter)
            .populate('sellerId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Vehicle.countDocuments(filter);
        
        res.json({
            success: true,
            vehicles,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
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

// @route   PUT /api/admin/vehicles/:id/approve
// @desc    Approve vehicle listing
// @access  Private/Admin
router.put('/vehicles/:id/approve', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        vehicle.status = 'approved';
        await vehicle.save();
        
        res.json({
            success: true,
            vehicle
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

// @route   PUT /api/admin/vehicles/:id/reject
// @desc    Reject vehicle listing
// @access  Private/Admin
router.put('/vehicles/:id/reject', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        vehicle.status = 'rejected';
        await vehicle.save();
        
        res.json({
            success: true,
            vehicle
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

// @route   DELETE /api/admin/vehicles/:id
// @desc    Delete vehicle (admin)
// @access  Private/Admin
router.delete('/vehicles/:id', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        await vehicle.deleteOne();
        
        res.json({
            success: true,
            message: 'Vehicle deleted successfully'
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

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const pendingVehicles = await Vehicle.countDocuments({ status: 'pending' });
        const approvedVehicles = await Vehicle.countDocuments({ status: 'approved' });
        const sellers = await User.countDocuments({ role: 'seller' });
        const buyers = await User.countDocuments({ role: 'buyer' });
        
        // Get recent users
        const recentUsers = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get recent vehicles
        const recentVehicles = await Vehicle.find({})
            .populate('sellerId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalVehicles,
                pendingVehicles,
                approvedVehicles,
                sellers,
                buyers
            },
            recentUsers,
            recentVehicles
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