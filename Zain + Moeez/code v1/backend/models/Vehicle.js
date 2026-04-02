// ============================================
// FOUR WHEELS — VEHICLE MODEL
// ============================================

const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vehicle title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1970, 'Year must be after 1970'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Car', 'SUV', 'Truck', 'Bike', 'Other'],
  },
  fuel: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'],
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'],
    default: 'Manual',
  },
  engine: { type: String, trim: true },
  mileage: { type: Number, min: 0, default: 0 },
  color:   { type: String, trim: true },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    default: 'Used',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1000, 'Price must be at least PKR 1000'],
  },
  priceType: {
    type: String,
    enum: ['Fixed', 'Negotiable', 'Exchange'],
    default: 'Fixed',
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  images: [{
    url: { type: String },
    public_id: { type: String },
  }],
  city: {
    type: String,
    required: [true, 'City is required'],
    enum: ['Karachi','Lahore','Islamabad','Multan','Faisalabad','Peshawar','Rawalpindi','Quetta','Sialkot','Other'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'sold'],
    default: 'pending',
  },
  views:  { type: Number, default: 0 },
  saved:  { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Index for search performance
VehicleSchema.index({ city: 1, type: 1, price: 1 });
VehicleSchema.index({ brand: 'text', model: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Vehicle', VehicleSchema);
