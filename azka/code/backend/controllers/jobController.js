import JobApplication from '../models/JobApplication.js';

// @desc    Get all job applications for user
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res, next) => {
  try {
    const { status, search, sort, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user.id };
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by company or position
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'company') sortOption = { company: 1 };
    if (sort === 'status') sortOption = { status: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };

    const total = await JobApplication.countDocuments(query);
    const jobs = await JobApplication.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job application
// @route   GET /api/jobs/:id
// @access  Private
export const getJob = async (req, res, next) => {
  try {
    const job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job application
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const job = await JobApplication.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res, next) => {
  try {
    let job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    job = await JobApplication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res, next) => {
  try {
    const job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job application deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private
export const getJobStats = async (req, res, next) => {
  try {
    const stats = await JobApplication.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await JobApplication.countDocuments({ user: req.user.id });
    
    // Get applications this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = await JobApplication.countDocuments({
      user: req.user.id,
      createdAt: { $gte: weekAgo }
    });

    // Get applications this month
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const thisMonth = await JobApplication.countDocuments({
      user: req.user.id,
      createdAt: { $gte: monthAgo }
    });

    // Format stats by status
    const statusStats = {
      wishlist: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      stats: {
        total: totalApplications,
        thisWeek,
        thisMonth,
        byStatus: statusStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming reminders
// @route   GET /api/jobs/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const reminders = await JobApplication.find({
      user: req.user.id,
      'followUpReminder.enabled': true,
      'followUpReminder.date': { $gte: today, $lte: nextWeek },
      'followUpReminder.notified': false
    }).select('company position followUpReminder status');

    res.json({ success: true, reminders });
  } catch (error) {
    next(error);
  }
};

// @desc    Set follow-up reminder
// @route   PUT /api/jobs/:id/reminder
// @access  Private
export const setReminder = async (req, res, next) => {
  try {
    const { date, enabled } = req.body;
    
    const job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    job.followUpReminder = {
      enabled: enabled !== undefined ? enabled : true,
      date: date ? new Date(date) : job.followUpReminder.date,
      notified: false
    };

    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};
