import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const features = [
  { icon: '🤖', title: 'AI Health Assistant', desc: 'Ask anything about gastro health, diet, and general wellness. Get instant, intelligent responses.' },
  { icon: '🌍', title: 'Multilingual Support', desc: 'Communicate in English, Urdu, or Turkish. Breaking language barriers for better healthcare.' },
  { icon: '📋', title: 'Health History', desc: 'Store your medical history, allergies, medications, and personal health profile securely.' },
  { icon: '🚨', title: 'Emergency Alerts', desc: 'Detects critical symptoms and instantly provides emergency numbers for Pakistan, USA, UK & Turkey.' },
  { icon: '💬', title: 'Chat Memory', desc: 'Resume past conversations anytime. Your health journey stays organized in your sidebar.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and private. We never share your information.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="page-pt">
      {/* Hero */}
      <section className="gc-hero d-flex align-items-center">
        <div className="container position-relative">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <div className="gc-hero-badge mb-3">
                <span>✨</span> AI-Powered Health Companion
              </div>
              <h1 className="fw-bold mb-3">
                Your <span>Smarter</span> Path<br />to Better Health
              </h1>
              <p className="lead mb-4" style={{maxWidth:520}}>
                GastroCare combines artificial intelligence with medical expertise to give you personalized health guidance — anytime, in your language.
              </p>
              <div className="d-flex flex-wrap gap-3" style={{animation:'gcFadeUp .6s ease .3s both'}}>
                <Link to={user ? '/chatbot' : '/signup'} className="btn btn-lg px-4 py-3 fw-semibold" style={{background:'var(--gc-accent)',color:'var(--gc-primary-dark)',borderRadius:50}}>
                  <i className="bi bi-robot me-2" />{user ? 'Open AI Chat' : 'Get Started Free'}
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-light px-4 py-3" style={{borderRadius:50}}>
                  Learn More <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="row g-3">
                {[
                  { icon: '🫀', val: '24/7', lbl: 'Always Available' },
                  { icon: '🌐', val: '3', lbl: 'Languages' },
                  { icon: '🛡️', val: '100%', lbl: 'Private & Secure' },
                  { icon: '⚡', val: 'Fast', lbl: 'AI Responses' },
                ].map((c, i) => (
                  <div className={`col-6 ${i % 2 !== 0 ? 'mt-4' : ''}`} key={i}>
                    <div className="gc-float-card">
                      <div style={{fontSize:'2rem',marginBottom:8}}>{c.icon}</div>
                      <div className="val">{c.val}</div>
                      <div className="lbl">{c.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="gc-section bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="gc-tag">Features</span>
            <h2 className="mt-3 mb-3">Everything You Need for<br /><span style={{color:'var(--gc-primary)'}}>Better Health</span></h2>
            <p className="text-muted" style={{maxWidth:500,margin:'0 auto'}}>Comprehensive tools designed to support your health journey at every step.</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="gc-feature-card">
                  <div className="gc-feature-icon">{f.icon}</div>
                  <h5 className="fw-bold mb-2" style={{color:'var(--gc-primary-dark)'}}>{f.title}</h5>
                  <p className="text-muted small mb-0 lh-lg">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gc-section" style={{background:'linear-gradient(135deg,var(--gc-primary-dark),var(--gc-primary))'}}>
        <div className="container text-center">
          <h2 className="text-white mb-3">Ready to Take Control<br />of Your Health?</h2>
          <p className="text-white-50 mb-4" style={{maxWidth:480,margin:'0 auto 24px'}}>
            Join thousands who trust GastroCare for smarter health decisions. It's free, private, and available in your language.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to={user ? '/chatbot' : '/signup'} className="btn btn-lg px-5 fw-semibold" style={{background:'var(--gc-accent)',color:'var(--gc-primary-dark)',borderRadius:50}}>
              {user ? 'Start Chatting' : 'Create Free Account'}
            </Link>
            <Link to="/emergency" className="btn btn-lg btn-outline-light px-4" style={{borderRadius:50}}>
              <i className="bi bi-telephone me-2" />Emergency
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
