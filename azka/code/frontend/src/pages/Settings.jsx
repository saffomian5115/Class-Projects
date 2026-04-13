import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Sparkles, 
  CreditCard,
  Trash2,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, logout, upgradeToPremium } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', { name, email });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await upgradeToPremium();
      toast.success('Successfully upgraded to Premium!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not available in demo mode');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-dark-400 mt-1">Manage your account preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-6">
          <User className="text-primary-400" size={20} />
          Profile Information
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-2xl border ${
          user?.isPremium 
            ? 'bg-gradient-to-br from-primary-900/30 to-primary-800/20 border-primary-500/30' 
            : 'bg-dark-800/50 border-dark-700'
        }`}
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Sparkles className="text-primary-400" size={20} />
          Subscription
        </h2>

        {user?.isPremium ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <CheckCircle2 className="text-primary-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg">Premium Member</p>
                <p className="text-dark-400 text-sm">Enjoy all premium features</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-dark-300">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm">Unlimited applications</span>
              </div>
              <div className="flex items-center gap-2 text-dark-300">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2 text-dark-300">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm">Email notifications</span>
              </div>
              <div className="flex items-center gap-2 text-dark-300">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-dark-400">
              Upgrade to Premium for unlimited applications, advanced analytics, and more!
            </p>
            <div className="flex items-center gap-4">
              <Link to="/pricing" className="btn-primary flex items-center gap-2">
                <CreditCard size={18} />
                View Pricing
              </Link>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="btn-secondary flex items-center gap-2"
              >
                {upgrading ? (
                  <div className="w-5 h-5 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={18} />
                    Quick Upgrade ($29)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-6">
          <Shield className="text-blue-400" size={20} />
          Security
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={() => toast.error('Password change is not available in demo mode')}
            className="btn-secondary flex items-center gap-2"
          >
            <Lock size={18} />
            Change Password
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 text-red-400">
          <Trash2 size={20} />
          Danger Zone
        </h2>
        <p className="text-dark-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 
                   transition-colors flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
