import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  DollarSign,
  FileText,
  Tag,
  Calendar,
  Bell,
  Save,
  Trash2
} from 'lucide-react';
import { jobApi } from '../services/api';
import toast from 'react-hot-toast';
import SearchableSelect from '../components/SearchableSelect';

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
  { value: 'SEK', label: 'SEK - Swedish Krona' },
  { value: 'NOK', label: 'NOK - Norwegian Krone' },
  { value: 'DKK', label: 'DKK - Danish Krone' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
  { value: 'PLN', label: 'PLN - Polish Zloty' },
  { value: 'THB', label: 'THB - Thai Baht' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
  { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
  { value: 'PHP', label: 'PHP - Philippine Peso' },
  { value: 'VND', label: 'VND - Vietnamese Dong' },
  { value: 'RUB', label: 'RUB - Russian Ruble' },
  { value: 'TRY', label: 'TRY - Turkish Lira' },
];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    status: 'applied',
    jobType: 'full-time',
    workMode: 'remote',
    jobUrl: '',
    description: '',
    notes: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    priority: 'medium',
    tags: '',
    appliedDate: new Date().toISOString().split('T')[0],
    reminderEnabled: false,
    reminderDate: ''
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await jobApi.getById(id);
      const job = res.data.job;
      setFormData({
        company: job.company || '',
        position: job.position || '',
        location: job.location || '',
        status: job.status || 'applied',
        jobType: job.jobType || 'full-time',
        workMode: job.workMode || 'remote',
        jobUrl: job.jobUrl || '',
        description: job.description || '',
        notes: job.notes || '',
        salaryMin: job.salary?.min || '',
        salaryMax: job.salary?.max || '',
        salaryCurrency: job.salary?.currency || 'USD',
        priority: job.priority || 'medium',
        tags: job.tags?.join(', ') || '',
        appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '',
        reminderEnabled: job.followUpReminder?.enabled || false,
        reminderDate: job.followUpReminder?.date ? new Date(job.followUpReminder.date).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      toast.error('Failed to load application');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        company: formData.company,
        position: formData.position,
        location: formData.location || 'Remote',
        status: formData.status,
        jobType: formData.jobType,
        workMode: formData.workMode,
        jobUrl: formData.jobUrl,
        description: formData.description,
        notes: formData.notes,
        priority: formData.priority,
        appliedDate: formData.appliedDate,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (formData.salaryMin || formData.salaryMax) {
        data.salary = {
          min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
          max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
          currency: formData.salaryCurrency
        };
      }

      data.followUpReminder = {
        enabled: formData.reminderEnabled,
        date: formData.reminderDate || undefined,
        notified: false
      };

      await jobApi.update(id, data);
      toast.success('Application updated!');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await jobApi.delete(id);
        toast.success('Application deleted');
        navigate('/jobs');
      } catch (error) {
        toast.error('Failed to delete application');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link 
              to="/jobs" 
              className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Back to Applications
            </Link>
            <h1 className="font-display text-3xl font-bold">Edit Application</h1>
            <p className="text-dark-400 mt-1">{formData.company} - {formData.position}</p>
          </div>
          <button
            onClick={handleDelete}
            className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Delete Application"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 space-y-5">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Building2 className="text-primary-400" size={20} />
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Google"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Job URL</label>
                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Work Mode</label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary & Priority */}
          <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 space-y-5">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="text-green-400" size={20} />
              Salary & Priority
            </h2>

            <div className="grid md:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Min Salary</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Max Salary</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="80000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Currency</label>
                <SearchableSelect
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  options={currencyOptions}
                  placeholder="Select currency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates & Reminders */}
          <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 space-y-5">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="text-blue-400" size={20} />
              Dates & Reminders
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Applied Date</label>
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="reminderEnabled"
                    checked={formData.reminderEnabled}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/20"
                  />
                  <span className="text-sm font-medium text-dark-300 flex items-center gap-2">
                    <Bell size={16} className="text-amber-400" />
                    Set Follow-up Reminder
                  </span>
                </label>
                {formData.reminderEnabled && (
                  <input
                    type="date"
                    name="reminderDate"
                    value={formData.reminderDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 space-y-5">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="text-purple-400" size={20} />
              Additional Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Job description, requirements, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Your personal notes about this application..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                <Tag size={16} />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. react, remote, startup (comma separated)"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link to="/jobs" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Update Application
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditJob;
