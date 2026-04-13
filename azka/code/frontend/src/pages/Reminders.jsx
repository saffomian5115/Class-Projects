import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { jobApi } from '../services/api';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [remindersRes, jobsRes] = await Promise.all([
        jobApi.getReminders(),
        jobApi.getAll({ limit: 100 })
      ]);
      setReminders(remindersRes.data.reminders);
      setAllJobs(jobsRes.data.jobs.filter(j => j.followUpReminder?.enabled));
    } catch (error) {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async (jobId) => {
    try {
      await jobApi.setReminder(jobId, { enabled: false });
      toast.success('Reminder completed');
      fetchData();
    } catch (error) {
      toast.error('Failed to update reminder');
    }
  };

  const getTimeLabel = (date) => {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return 'Overdue';
    const days = differenceInDays(d, new Date());
    if (days < 7) return `In ${days} days`;
    return format(d, 'MMM d, yyyy');
  };

  const getTimeLabelClass = (date) => {
    const d = new Date(date);
    if (isPast(d)) return 'text-red-400 bg-red-500/10';
    if (isToday(d)) return 'text-amber-400 bg-amber-500/10';
    if (isTomorrow(d)) return 'text-orange-400 bg-orange-500/10';
    return 'text-blue-400 bg-blue-500/10';
  };

  const statusConfig = {
    wishlist: { label: 'Wishlist', class: 'status-wishlist' },
    applied: { label: 'Applied', class: 'status-applied' },
    interviewing: { label: 'Interview', class: 'status-interviewing' },
    offer: { label: 'Offer', class: 'status-offer' },
    rejected: { label: 'Rejected', class: 'status-rejected' },
    accepted: { label: 'Accepted', class: 'status-accepted' },
    withdrawn: { label: 'Withdrawn', class: 'status-withdrawn' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold">Reminders</h1>
        <p className="text-dark-400 mt-1">Stay on top of your follow-ups</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle size={18} />
            <span className="text-sm">Overdue</span>
          </div>
          <div className="font-display text-2xl font-bold text-red-400">
            {allJobs.filter(j => isPast(new Date(j.followUpReminder?.date))).length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Clock size={18} />
            <span className="text-sm">Today</span>
          </div>
          <div className="font-display text-2xl font-bold text-amber-400">
            {allJobs.filter(j => isToday(new Date(j.followUpReminder?.date))).length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Calendar size={18} />
            <span className="text-sm">This Week</span>
          </div>
          <div className="font-display text-2xl font-bold text-blue-400">
            {allJobs.filter(j => {
              const d = new Date(j.followUpReminder?.date);
              return differenceInDays(d, new Date()) <= 7 && !isPast(d);
            }).length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Bell size={18} />
            <span className="text-sm">Total Active</span>
          </div>
          <div className="font-display text-2xl font-bold text-green-400">
            {allJobs.length}
          </div>
        </div>
      </motion.div>

      {/* Reminders List */}
      {allJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Bell className="mx-auto text-dark-500 mb-4" size={60} />
          <h3 className="text-xl font-semibold mb-2">No Active Reminders</h3>
          <p className="text-dark-400 mb-6">
            Set follow-up reminders on your job applications to stay organized
          </p>
          <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
            View Applications
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="font-semibold text-lg">Active Reminders</h2>
          
          {allJobs
            .sort((a, b) => new Date(a.followUpReminder?.date) - new Date(b.followUpReminder?.date))
            .map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-dark-600 
                       transition-all flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-xl ${getTimeLabelClass(job.followUpReminder?.date)}`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link 
                      to={`/jobs/edit/${job._id}`}
                      className="font-medium hover:text-primary-400 transition-colors"
                    >
                      {job.position}
                    </Link>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusConfig[job.status]?.class}`}>
                      {statusConfig[job.status]?.label}
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm">{job.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getTimeLabelClass(job.followUpReminder?.date)}`}>
                  {getTimeLabel(job.followUpReminder?.date)}
                </div>
                <button
                  onClick={() => markAsComplete(job._id)}
                  className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                  title="Mark as complete"
                >
                  <CheckCircle2 size={18} />
                </button>
                <Link
                  to={`/jobs/edit/${job._id}`}
                  className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 
                           hover:text-white transition-colors"
                  title="Edit"
                >
                  <Briefcase size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-primary-900/30 to-primary-800/20 
                 border border-primary-500/20"
      >
        <h3 className="font-semibold mb-3">Follow-up Tips</h3>
        <ul className="space-y-2 text-dark-300 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
            <span>Follow up 1-2 weeks after applying if you haven't heard back</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
            <span>Send a thank-you email within 24 hours after interviews</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
            <span>Keep your follow-ups concise and professional</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Reminders;
