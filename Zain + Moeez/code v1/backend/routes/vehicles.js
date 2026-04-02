// ============================================
// FOUR WHEELS — VEHICLES ROUTES
// GET    /api/vehicles          — all active listings
// GET    /api/vehicles/:id      — single vehicle
// POST   /api/vehicles          — create listing
// PUT    /api/vehicles/:id      — update listing
// DELETE /api/vehicles/:id      — delete listing
// POST   /api/vehicles/:id/images — upload images
// GET    /api/vehicles/my       — my listings
// ============================================

const express = require('express');
const router  = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect, optionalAuth } = require('../middleware/auth');
const upload  = require('../middleware/upload');

// ─────────────────────────────────────────────
// @route   GET /api/vehicles
// @desc    Get all active vehicles with filters + pagination
// @access  Public
// ─────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type, city, fuel, condition,
      minPrice, maxPrice,
      yearFrom, yearTo,
      search,
      sort = 'newest',
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'active' };

    if (type)      query.type = type;
    if (city)      query.city = city;
    if (fuel)      query.fuel = fuel;
    if (condition) query.condition = condition;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (yearFrom || yearTo) {
      query.year = {};
      if (yearFrom) query.year.$gte = parseInt(yearFrom);
      if (yearTo)   query.year.$lte = parseInt(yearTo);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {
      newest:     { createdAt: -1 },
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'year-desc':  { year: -1 },
      'year-asc':   { year: 1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(20, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(limitNum)
        .populate('seller', 'firstName lastName city phone'),
      Vehicle.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      vehicles,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/vehicles/my
// @desc    Get my own listings
// @access  Private
// ─────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/vehicles/:id
// @desc    Get single vehicle by ID
// @access  Public
// ─────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('seller', 'firstName lastName city phone avatar createdAt');

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Increment view count (don't await — non-blocking)
    Vehicle.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    // Similar vehicles
    const similar = await Vehicle.find({
      _id: { $ne: vehicle._id },
      status: 'active',
      $or: [{ type: vehicle.type }, { city: vehicle.city }],
    }).limit(4).select('title price city type year emoji');

    res.json({ success: true, vehicle, similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/vehicles
// @desc    Create a new vehicle listing
// @access  Private
// ─────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const vehicleData = { ...req.body, seller: req.user._id, status: 'pending' };
    const vehicle = await Vehicle.create(vehicleData);

    res.status(201).json({
      success: true,
      message: 'Listing submitted for review',
      vehicle,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   PUT /api/vehicles/:id
// @desc    Update vehicle listing
// @access  Private (owner only)
// ─────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Only owner or admin can update
    if (vehicle.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised to update this listing' });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Listing updated', vehicle });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   DELETE /api/vehicles/:id
// @desc    Delete vehicle listing
// @access  Private (owner or admin)
// ─────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (vehicle.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    await vehicle.deleteOne();
    res.json({ success: true, message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/vehicles/:id/images
// @desc    Upload images to a vehicle listing
// @access  Private (owner)
// ─────────────────────────────────────────────
router.post('/:id/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const newImages = req.files.map(f => ({ url: `/uploads/${f.filename}` }));
    vehicle.images.push(...newImages);
    await vehicle.save();

    res.json({ success: true, message: `${req.files.length} image(s) uploaded`, images: vehicle.images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
