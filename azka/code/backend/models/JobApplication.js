import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Please provide job position'],
    trim: true,
    maxlength: [100, 'Position cannot be more than 100 characters']
  },
  location: {
    type: String,
    trim: true,
    default: 'Remote'
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    enum: ['wishlist', 'applied', 'interviewing', 'offer', 'rejected', 'accepted', 'withdrawn'],
    default: 'applied'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'remote'
  },
  jobUrl: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  contacts: [{
    name: String,
    email: String,
    phone: String,
    role: String,
    notes: String
  }],
  appliedDate: {
    type: Date,
    default: Date.now
  },
  interviewDates: [{
    date: Date,
    type: { type: String, enum: ['phone', 'video', 'onsite', 'technical', 'behavioral'] },
    notes: String,
    completed: { type: Boolean, default: false }
  }],
  followUpReminder: {
    enabled: { type: Boolean, default: false },
    date: Date,
    notified: { type: Boolean, default: false }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
jobApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
jobApplicationSchema.index({ user: 1, status: 1 });
jobApplicationSchema.index({ user: 1, createdAt: -1 });
jobApplicationSchema.index({ 'followUpReminder.enabled': 1, 'followUpReminder.date': 1, 'followUpReminder.notified': 1 });

export default mongoose.model('JobApplication', jobApplicationSchema);
