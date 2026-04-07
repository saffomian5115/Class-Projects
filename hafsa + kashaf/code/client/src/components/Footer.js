import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="gc-footer py-5">
    <div className="container">
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <h5 className="text-white mb-3" style={{fontFamily:'var(--font-display)'}}>🏥 GastroCare</h5>
          <p className="text-white-50 small lh-lg">Your trusted AI-powered health companion specializing in gastroenterology, nutrition, and general wellness. Available 24/7 in English, Urdu & Turkish.</p>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="gc-footer">Quick Links</h6>
          <ul className="list-unstyled mt-2">
            {[['/', 'Home'], ['/about', 'About'], ['/chatbot', 'AI Chat']].map(([to, label]) => (
              <li key={to} className="mb-1"><Link to={to} className="gc-footer">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="gc-footer">Support</h6>
          <ul className="list-unstyled mt-2">
            {[['/emergency', 'Emergency'], ['/contact', 'Contact'], ['/profile', 'Profile']].map(([to, label]) => (
              <li key={to} className="mb-1"><Link to={to} className="gc-footer">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-lg-4">
          <h6 className="gc-footer">Connect With Us</h6>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {[['bi-instagram', 'Instagram', '#'], ['bi-facebook', 'Facebook', '#'], ['bi-twitter-x', 'X (Twitter)', '#']].map(([icon, label, href]) => (
              <a key={label} href={href} className="gc-footer d-flex align-items-center gap-1 border border-secondary rounded-pill px-3 py-1" style={{fontSize:'.8rem'}}>
                <i className={`bi ${icon}`} /> {label}
              </a>
            ))}
          </div>
          <p className="text-white-50 small mt-3 mb-0">
            <i className="bi bi-envelope me-1" /> gastrocare.help@gmail.com
          </p>
        </div>
      </div>
      <hr style={{borderColor:'rgba(255,255,255,.1)'}} />
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <p className="text-white-50 small mb-0">© 2024 GastroCare. All rights reserved.</p>
        <p className="text-white-50 small mb-0">Not a substitute for professional medical advice.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
