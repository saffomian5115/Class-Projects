const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    age: Number,
    height: String,
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    profession: String,
    income: String,
    area: String,
    country: String,
    profilePicture: String,
  },
  medicalHistory: {
    bloodGroup: String,
    allergies: [String],
    chronicDiseases: [String],
    currentMedications: [String],
    previousSurgeries: [String],
    smokingStatus: { type: String, enum: ['Never', 'Former', 'Current'] },
    alcoholConsumption: { type: String, enum: ['Never', 'Occasionally', 'Regularly'] },
    digestiveIssues: [String],
    dietType: String,
    weight: String,
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
