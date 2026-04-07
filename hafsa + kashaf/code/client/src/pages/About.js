import React from 'react';
import Footer from '../components/Footer';

const About = () => (
  <div className="page-pt">
    {/* Hero */}
    <section className="gc-about-hero">
      <div className="container">
        <span className="gc-tag" style={{background:'rgba(255,255,255,.15)',color:'rgba(255,255,255,.9)'}}>About Us</span>
        <h1 className="text-white mt-3 mb-3">The Story Behind <br /><span style={{color:'var(--gc-accent-light)'}}>GastroCare</span></h1>
        <p className="text-white-50 mx-auto" style={{maxWidth:580,fontSize:'1.05rem'}}>
          Born from the belief that everyone deserves access to quality health information — in their own language, at any time.
        </p>
      </div>
    </section>

    {/* Stats */}
    <section className="gc-section bg-white">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <span className="gc-tag">Our Mission</span>
            <h2 className="mt-3 mb-3">Bridging the Gap Between <span style={{color:'var(--gc-primary)'}}>AI & Healthcare</span></h2>
            <p className="text-muted lh-lg mb-4">
              GastroCare was founded to make health information accessible to everyone, regardless of language or location. We specialize in gastroenterology, nutrition, and general wellness — empowered by cutting-edge AI.
            </p>
            <p className="text-muted lh-lg">
              Our platform combines intelligent conversation with multilingual support (English, Urdu, Turkish), emergency detection, and personalized health tracking — all in one secure place.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {[['24/7', 'Always Available'], ['3', 'Languages Supported'], ['100%', 'Free to Use'], ['∞', 'Chat History Stored']].map(([num, lbl]) => (
                <div className="col-6" key={lbl}>
                  <div className="gc-stat-box">
                    <div className="num">{num}</div>
                    <div className="lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Mission cards */}
    <section className="gc-section">
      <div className="container">
        <div className="text-center mb-5">
          <span className="gc-tag">Our Values</span>
          <h2 className="mt-3">What Drives Us</h2>
        </div>
        <div className="row g-4">
          {[
            { icon: '🎯', title: 'Accuracy', desc: 'We provide evidence-based health information from trusted medical sources.' },
            { icon: '🤝', title: 'Accessibility', desc: 'Healthcare information should be free, easy to use, and available in your language.' },
            { icon: '🔒', title: 'Privacy', desc: 'Your health data is yours alone. We use industry-standard encryption to protect it.' },
            { icon: '💡', title: 'Innovation', desc: 'We continuously improve our AI to provide smarter, more helpful health guidance.' },
            { icon: '🌍', title: 'Inclusivity', desc: 'Multilingual support ensures no one is left behind due to language barriers.' },
            { icon: '⚡', title: 'Reliability', desc: 'Available round-the-clock, especially when you need emergency guidance most.' },
          ].map((v, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div className="gc-mission-card">
                <div style={{fontSize:'2.5rem',marginBottom:16}}>{v.icon}</div>
                <h5 style={{color:'var(--gc-primary)'}}>{v.title}</h5>
                <p className="text-muted small mb-0 lh-lg">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="gc-section bg-white">
      <div className="container">
        <div className="alert border-0 rounded-gc p-4" style={{background:'rgba(201,168,76,.08)',borderLeft:'4px solid var(--gc-accent)!important'}}>
          <div className="d-flex gap-3 align-items-start">
            <span style={{fontSize:'1.5rem'}}>⚠️</span>
            <div>
              <h5 style={{color:'var(--gc-primary-dark)'}}>Medical Disclaimer</h5>
              <p className="mb-0 text-muted small lh-lg">
                GastroCare provides general health information and is <strong>not a substitute</strong> for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns. In emergencies, call your local emergency number immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
