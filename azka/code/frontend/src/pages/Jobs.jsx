import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  MoreVertical,
  Edit2,
  Trash2,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { jobApi } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sort, setSort] = useState('newest');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [status, sort, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getAll({
        status: status !== 'all' ? status : undefined,
        search: search || undefined,
        sort,
        page: pagination.page,
        limit: 10
      });
      setJobs(res.data.jobs);
      setPagination({
        page: res.data.currentPage,
        totalPages: res.data.totalPages,
        total: res.data.total
      });
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await jobApi.delete(id);
        toast.success('Application deleted');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete application');
      }
    }
    setActiveMenu(null);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'withdrawn', label: 'Withdrawn' },
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

  const priorityConfig = {
    low: { label: 'Low', class: 'priority-low' },
    medium: { label: 'Medium', class: 'priority-medium' },
    high: { label: 'High', class: 'priority-high' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold">Applications</h1>
          <p className="text-dark-400 mt-1">{pagination.total} total applications</p>
        </div>
        <Link to="/jobs/add" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          Add Application
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1"
            placeholder="Search company or position..."
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-primary-500 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="input-field w-full md:w-48"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-full md:w-40"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="company">Company A-Z</option>
          <option value="priority">Priority</option>
        </select>
      </motion.div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Briefcase className="mx-auto text-dark-500 mb-4" size={60} />
          <h3 className="text-xl font-semibold mb-2">No applications found</h3>
          <p className="text-dark-400 mb-6">
            {search ? 'Try adjusting your search or filters' : 'Start tracking your job search'}
          </p>
          <Link to="/jobs/add" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Add Your First Application
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-dark-600 
                         transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Company Logo */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 
                                flex items-center justify-center text-primary-400 font-display font-bold text-xl
                                border border-primary-500/20 flex-shrink-0">
                    {job.company.charAt(0)}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{job.position}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[job.status]?.class}`}>
                        {statusConfig[job.status]?.label}
                      </span>
                      {job.priority !== 'medium' && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${priorityConfig[job.priority]?.class}`}>
                          {priorityConfig[job.priority]?.label}
                        </span>
                      )}
                    </div>
                    <p className="text-dark-300">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-dark-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(job.appliedDate), 'MMM d, yyyy')}
                      </span>
                      {job.followUpReminder?.enabled && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Bell size={14} />
                          Reminder set
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 
                                 hover:text-white transition-colors"
                        title="View Job Posting"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <Link
                      to={`/jobs/edit/${job._id}`}
                      className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 
                               hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === job._id ? null : job._id)}
                        className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 
                                 hover:text-white transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {activeMenu === job._id && (
                        <div className="absolute right-0 top-full mt-1 w-40 py-2 rounded-xl bg-dark-700 
                                      border border-dark-600 shadow-xl z-10">
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-dark-600 
                                     flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dark-700">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-dark-700 text-dark-300 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="px-4 py-2 text-dark-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
