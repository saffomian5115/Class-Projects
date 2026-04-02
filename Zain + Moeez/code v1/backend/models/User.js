// ============================================
// FOUR WHEELS — USER MODEL
// ============================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+92|0)?3[0-9]{9}$/, 'Please enter a valid Pakistani number'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    enum: ['Karachi','Lahore','Islamabad','Multan','Faisalabad','Peshawar','Rawalpindi','Quetta','Sialkot','Gujranwala','Other'],
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot exceed 300 characters'],
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active',
  },
  savedVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  }],
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual: full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual: listings count
UserSchema.virtual('listingsCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'seller',
  count: true,
});

module.exports = mongoose.model('User', UserSchema);
