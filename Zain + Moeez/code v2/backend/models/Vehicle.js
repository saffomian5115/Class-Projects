const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        enum: ['Honda', 'Toyota', 'Suzuki', 'Hyundai', 'Kia', 'BMW', 'Mercedes', 'Audi','Yamaha','United', 'Other']
    },
    model: {
        type: String,
        required: [true, 'Model is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: 1980,
        max: new Date().getFullYear() + 1
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        enum: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Other']
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Used']
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['Car', 'Bike', 'Truck', 'Van', 'SUV', 'Other']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 2000
    },
    images: [{
        type: String,
        required: true
    }],
    threeDModelUrl: {
        type: String,
        default: null
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'sold'],
        default: 'pending'
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for search optimization
vehicleSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);