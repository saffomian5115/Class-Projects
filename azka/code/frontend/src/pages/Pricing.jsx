import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowRight,
  Zap,
  Shield,
  Crown,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { user, isAuthenticated, upgradeToPremium } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async (plan) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    
    if (user?.isPremium) {
      toast.success('You are already a premium member!');
      return;
    }

    try {
      await upgradeToPremium();
      toast.success('Successfully upgraded to Premium!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Upgrade failed. Please try again.');
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: 'Up to 25 job applications', included: true },
        { text: 'Basic status tracking', included: true },
        { text: 'Follow-up reminders', included: true },
        { text: 'Basic dashboard', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Email notifications', included: false },
        { text: 'Export to CSV', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      ctaLink: '/register',
      popular: false
    },
    {
      name: 'Premium',
      price: '$29',
      period: 'one-time',
      description: 'Everything you need to land your dream job',
      features: [
        { text: 'Unlimited job applications', included: true },
        { text: 'All status tracking features', included: true },
        { text: 'Smart follow-up reminders', included: true },
        { text: 'Advanced analytics dashboard', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Export to CSV/PDF', included: true },
        { text: 'Priority support', included: true },
        { text: 'Future updates included', included: true },
      ],
      cta: 'Get Premium',
      popular: true
    },
    {
      name: 'Career Bundle',
      price: '$49',
      period: 'one-time',
      description: 'Premium + career resources',
      features: [
        { text: 'All Premium features', included: true },
        { text: 'Resume templates', included: true },
        { text: 'Cover letter templates', included: true },
        { text: 'Interview prep guides', included: true },
        { text: 'Salary negotiation tips', included: true },
        { text: 'Job search strategies', included: true },
        { text: '1-on-1 support session', included: true },
        { text: 'Lifetime access', included: true },
      ],
      cta: 'Get Bundle',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                          flex items-center justify-center font-display font-bold text-white">
              JT
            </div>
            <span className="font-display font-semibold text-xl">JobTrackr</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-dark-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary flex items-center gap-2">
                  Get Started <ArrowRight size={18} />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 
                          border border-primary-500/20 text-primary-400 text-sm mb-6">
              <Gift size={16} />
              <span>Simple, transparent pricing</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              One-time payment, lifetime access. No subscriptions, no hidden fees.
            </p>
          </motion.div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary-900/50 to-primary-800/30 border-2 border-primary-500/50 shadow-xl shadow-primary-500/10' 
                    : 'bg-dark-800/50 border border-dark-700 hover:border-dark-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r 
                                from-primary-500 to-primary-600 rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown size={14} />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-dark-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-dark-400 ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={18} className="text-dark-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-dark-200' : 'text-dark-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.ctaLink ? (
                  <Link
                    to={plan.ctaLink}
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    }`}
                  >
                    {plan.popular && <Sparkles size={18} />}
                    {plan.cta}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-16 border-t border-dark-800"
          >
            <div className="flex items-center gap-2 text-dark-400">
              <Shield size={20} className="text-green-400" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-dark-400">
              <Zap size={20} className="text-amber-400" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-dark-400">
              <Gift size={20} className="text-primary-400" />
              <span>30-Day Money Back</span>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'Is this a one-time payment?',
                  a: 'Yes! Pay once and get lifetime access. No recurring subscriptions.'
                },
                {
                  q: 'Can I upgrade later?',
                  a: 'Absolutely. Start free and upgrade whenever you\'re ready.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards and PayPal.'
                },
                {
                  q: 'Is there a refund policy?',
                  a: 'Yes, we offer a 30-day money-back guarantee, no questions asked.'
                }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-dark-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 
                          flex items-center justify-center font-display font-bold text-white text-sm">
              JT
            </div>
            <span className="text-dark-400">© 2026 JobTrackr. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-dark-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
