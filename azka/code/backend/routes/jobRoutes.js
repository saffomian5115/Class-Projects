import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getReminders,
  setReminder
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getJobs)
  .post(createJob);

router.get('/stats', getJobStats);
router.get('/reminders', getReminders);

router.route('/:id')
  .get(getJob)
  .put(updateJob)
  .delete(deleteJob);

router.put('/:id/reminder', setReminder);

export default router;
