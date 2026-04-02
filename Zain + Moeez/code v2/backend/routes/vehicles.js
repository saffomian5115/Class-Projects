const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { protect, seller } = require('../middleware/auth');
const { uploadImages, uploadModel } = require('../config/multer');

// @route   GET /api/vehicles
// @desc    Get all vehicles with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { 
            city, 
            minPrice, 
            maxPrice, 
            brand, 
            vehicleType, 
            condition,
            year,
            search,
            status = 'approved',
            limit = 12,
            page = 1
        } = req.query;

        // Build filter object
        let filter = { status: 'approved' };
        
        if (status === 'all' && req.user && req.user.role === 'admin') {
            delete filter.status;
        } else if (status === 'pending' && req.user && req.user.role === 'admin') {
            filter.status = 'pending';
        }

        if (city && city !== 'all') filter.city = city;
        if (brand && brand !== 'all') filter.brand = brand;
        if (vehicleType && vehicleType !== 'all') filter.vehicleType = vehicleType;
        if (condition && condition !== 'all') filter.condition = condition;
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }
        
        if (year) filter.year = parseInt(year);
        
        if (search) {
            filter.$text = { $search: search };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get vehicles
        const vehicles = await Vehicle.find(filter)
            .populate('sellerId', 'name email phone city')
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

// @route   GET /api/vehicles/:id
// @desc    Get single vehicle by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('sellerId', 'name email phone city');
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        // Increment view count
        vehicle.views += 1;
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

// @route   POST /api/vehicles
// @desc    Create a new vehicle listing
// @access  Private (Seller or Admin)
router.post('/', protect, seller, async (req, res) => {
    try {
        const {
            title,
            brand,
            model,
            year,
            price,
            city,
            condition,
            vehicleType,
            description
        } = req.body;
        
        // Create vehicle
        const vehicle = await Vehicle.create({
            title,
            brand,
            model,
            year,
            price,
            city,
            condition,
            vehicleType,
            description,
            sellerId: req.user._id,
            images: [], // Will be updated after file upload
            status: 'pending' // Requires admin approval
        });
        
        res.status(201).json({
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

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle listing
// @access  Private (Owner or Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        // Check if user is owner or admin
        if (vehicle.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this listing'
            });
        }
        
        const {
            title,
            brand,
            model,
            year,
            price,
            city,
            condition,
            vehicleType,
            description
        } = req.body;
        
        // Update fields
        if (title) vehicle.title = title;
        if (brand) vehicle.brand = brand;
        if (model) vehicle.model = model;
        if (year) vehicle.year = year;
        if (price) vehicle.price = price;
        if (city) vehicle.city = city;
        if (condition) vehicle.condition = condition;
        if (vehicleType) vehicle.vehicleType = vehicleType;
        if (description) vehicle.description = description;
        
        // Reset status to pending if admin approved before
        if (req.user.role !== 'admin') {
            vehicle.status = 'pending';
        }
        
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

// @route   DELETE /api/vehicles/:id
// @desc    Delete vehicle listing
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        // Check if user is owner or admin
        if (vehicle.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this listing'
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

// @route   POST /api/vehicles/:id/upload-images
// @desc    Upload images for vehicle
// @access  Private (Owner or Admin)
router.post('/:id/upload-images', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        // Check if user is owner or admin
        if (vehicle.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload images'
            });
        }
        
        uploadImages(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload at least one image'
                });
            }
            
            const imageUrls = req.files.map(file => `/uploads/images/${file.filename}`);
            vehicle.images.push(...imageUrls);
            await vehicle.save();
            
            res.json({
                success: true,
                images: vehicle.images
            });
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

// @route   POST /api/vehicles/:id/upload-model
// @desc    Upload 3D model for vehicle
// @access  Private (Owner or Admin)
router.post('/:id/upload-model', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        
        // Check if user is owner or admin
        if (vehicle.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload 3D model'
            });
        }
        
        uploadModel(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a 3D model file (.glb or .gltf)'
                });
            }
            
            vehicle.threeDModelUrl = `/uploads/models/${req.file.filename}`;
            await vehicle.save();
            
            res.json({
                success: true,
                threeDModelUrl: vehicle.threeDModelUrl
            });
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

// @route   GET /api/vehicles/seller/my-listings
// @desc    Get current user's listings
// @access  Private (Seller)
router.get('/seller/my-listings', protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ sellerId: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            vehicles
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