import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Bell, 
  TrendingUp, 
  Shield, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place with status tracking'
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Never miss a follow-up with automated reminders for your applications'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Visualize your job search progress with insightful statistics'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. Only you have access'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Jobs Tracked' },
    { value: '85%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
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
            <Link to="/pricing" className="text-dark-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/login" className="text-dark-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 
                          border border-primary-500/20 text-primary-400 text-sm mb-6">
              <Sparkles size={16} />
              <span>Your job search companion</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Track Your
              <span className="gradient-text"> Job Applications</span>
              <br />Like a Pro
            </h1>
            
            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">
              Stop losing track of where you applied. Organize applications, set reminders, 
              and land your dream job with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                <Zap size={20} />
                Start Free Trial
              </Link>
              <Link to="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-12 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-dark-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-dark-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Everything You Need to
              <span className="gradient-text"> Succeed</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and help you stay organized
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/30 
                         transition-all duration-300 card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center 
                              text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-dark-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-primary-900/50 to-primary-800/30 
                     border border-primary-500/20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent" />
            <div className="relative z-10">
              <Target className="w-16 h-16 mx-auto text-primary-400 mb-6" />
              <h2 className="font-display text-4xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-dark-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of job seekers who've organized their search and found success with JobTrackr.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Get Started Free <ArrowRight size={20} />
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-dark-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

export default Landing;
