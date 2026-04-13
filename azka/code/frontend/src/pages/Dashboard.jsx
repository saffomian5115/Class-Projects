import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  Plus,
  Bell
} from 'lucide-react';
import { jobApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, jobsRes, remindersRes] = await Promise.all([
        jobApi.getStats(),
        jobApi.getAll({ limit: 5, sort: 'newest' }),
        jobApi.getReminders()
      ]);
      setStats(statsRes.data.stats);
      setRecentJobs(jobsRes.data.jobs);
      setReminders(remindersRes.data.reminders);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Applications', 
      value: stats?.total || 0, 
      icon: Briefcase, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'This Week', 
      value: stats?.thisWeek || 0, 
      icon: Calendar, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Interviewing', 
      value: stats?.byStatus?.interviewing || 0, 
      icon: MessageSquare, 
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    { 
      label: 'Offers', 
      value: stats?.byStatus?.offer || 0, 
      icon: Target, 
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
  ];

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
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold">
            Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-dark-400 mt-1">Wishing you success in your job search today</p>
        </div>
        <Link to="/jobs/add" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          Add Application
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-dark-600 
                     transition-all duration-300 card-hover"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="font-display text-3xl font-bold">{stat.value}</div>
            <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
      >
        <h2 className="font-semibold text-lg mb-4">Application Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div 
              key={key}
              className={`p-4 rounded-xl border ${config.class} text-center`}
            >
              <div className="font-display text-2xl font-bold">{stats?.byStatus?.[key] || 0}</div>
              <div className="text-sm mt-1 opacity-80">{config.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Applications</h2>
            <Link to="/jobs" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto text-dark-500 mb-3" size={40} />
              <p className="text-dark-400">No applications yet</p>
              <Link to="/jobs/add" className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block">
                Add your first application
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/edit/${job._id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 
                           hover:bg-dark-700 transition-all border border-transparent hover:border-dark-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center 
                                  text-primary-400 font-semibold">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{job.position}</p>
                      <p className="text-sm text-dark-400">{job.company}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[job.status]?.class}`}>
                    {statusConfig[job.status]?.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Upcoming Reminders</h2>
            <Link to="/reminders" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto text-dark-500 mb-3" size={40} />
              <p className="text-dark-400">No upcoming reminders</p>
              <p className="text-dark-500 text-sm mt-1">
                Set reminders on your applications
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                >
                  <Clock className="text-amber-400 flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{reminder.company} - {reminder.position}</p>
                    <p className="text-sm text-amber-400">
                      {format(new Date(reminder.followUpReminder.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-primary-900/30 to-primary-800/20 
                 border border-primary-500/20"
      >
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/jobs/add"
            className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 
                     transition-all border border-dark-700 hover:border-primary-500/30"
          >
            <Plus className="text-primary-400" size={20} />
            <span>Add Application</span>
          </Link>
          <Link
            to="/jobs?status=interviewing"
            className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 
                     transition-all border border-dark-700 hover:border-amber-500/30"
          >
            <MessageSquare className="text-amber-400" size={20} />
            <span>View Interviews</span>
          </Link>
          <Link
            to="/reminders"
            className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 
                     transition-all border border-dark-700 hover:border-blue-500/30"
          >
            <Bell className="text-blue-400" size={20} />
            <span>Check Reminders</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
