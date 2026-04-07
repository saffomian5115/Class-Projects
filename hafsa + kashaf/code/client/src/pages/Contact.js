import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', rating: 0 });
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post('/api/feedback', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '', rating: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-pt">
      {/* Hero */}
      <section className="gc-contact-hero">
        <div className="container">
          <span className="gc-tag" style={{background:'rgba(255,255,255,.15)',color:'rgba(255,255,255,.9)'}}>Contact</span>
          <h1 className="text-white mt-3 mb-3">Get in Touch</h1>
          <p className="text-white-50 mx-auto" style={{maxWidth:480,fontSize:'1.05rem'}}>
            We'd love to hear from you. Send us your feedback, questions, or suggestions.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="gc-section">
        <div className="container">
          <div className="row g-5">
            {/* Left info */}
            <div className="col-lg-4">
              <h3 style={{color:'var(--gc-primary)'}} className="mb-3">Let's Connect</h3>
              <p className="text-muted lh-lg mb-4">Have a question about GastroCare? Want to report a problem or share a suggestion? Reach out — we read every message.</p>

              {[
                { icon: 'bi-envelope', title: 'Email Us', text: 'gastrocare.help@gmail.com', href: 'mailto:gastrocare.help@gmail.com' },
                { icon: 'bi-clock', title: 'AI Available', text: '24/7 via Chatbot', href: '/chatbot' },
                { icon: 'bi-geo-alt', title: 'Based In', text: 'Serving Globally 🌍', href: null },
              ].map((item, i) => (
                <div className="d-flex gap-3 align-items-start mb-4" key={i}>
                  <div style={{width:44,height:44,background:'rgba(10,79,60,.08)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>
                    <i className={`bi ${item.icon} text-primary`} />
                  </div>
                  <div>
                    <div className="fw-semibold small" style={{color:'var(--gc-primary-dark)'}}>{item.title}</div>
                    {item.href ? <a href={item.href} className="text-muted small text-decoration-none">{item.text}</a> : <div className="text-muted small">{item.text}</div>}
                  </div>
                </div>
              ))}

              {/* Social links */}
              <h6 className="fw-bold mb-3" style={{color:'var(--gc-primary-dark)'}}>Follow Us</h6>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {[['bi-instagram','Instagram','#'],['bi-facebook','Facebook','#'],['bi-twitter-x','X (Twitter)','#']].map(([icon,label,href])=>(
                  <a key={label} href={href} className="gc-social-link">
                    <i className={`bi ${icon}`}/> {label}
                  </a>
                ))}
              </div>

              {/* Availability */}
              <div className="gc-avail-card">
                <h6 className="text-white mb-3">⏰ Availability</h6>
                {[['AI Chatbot','24/7 Always'],['Feedback Response','1-2 Business Days'],['Emergency Info','Always Active']].map(([label,val])=>(
                  <div className="d-flex justify-content-between mb-2" key={label} style={{fontSize:'.875rem'}}>
                    <span><span className="gc-avail-dot" />{label}</span>
                    <span className="fw-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Form */}
            <div className="col-lg-8">
              <div className="bg-white p-4 p-lg-5 rounded-gc shadow-gc">
                <h3 style={{color:'var(--gc-primary)'}} className="mb-4">Send Feedback</h3>

                {success && (
                  <div className="gc-success-msg mb-4">
                    <i className="bi bi-check-circle-fill" />
                    Thank you! Your feedback has been submitted successfully.
                  </div>
                )}
                {error && <div className="alert alert-danger small py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Full Name *</label>
                      <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Email Address *</label>
                      <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Subject *</label>
                      <select className="form-select" name="subject" value={form.subject} onChange={handleChange} required>
                        <option value="">Select a subject</option>
                        <option>General Feedback</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                        <option>AI Chatbot Issue</option>
                        <option>Account Problem</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Your Rating</label>
                      <div className="d-flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`gc-star ${star <= (hover || form.rating) ? 'active' : ''}`}
                            onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                            onClick={() => setForm({...form, rating: star})}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Message *</label>
                      <textarea className="form-control" rows={5} name="message" value={form.message} onChange={handleChange} placeholder="Tell us what you think..." required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold" disabled={loading}>
                        {loading ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</> : <><i className="bi bi-send me-2" />Send Feedback</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
