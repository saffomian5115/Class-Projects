import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', { name: form.name, email: form.email, password: form.password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="gc-auth-page">
      <div className="gc-auth-card">
        <div className="gc-auth-logo text-center mb-4">
          <div className="mb-2" style={{fontSize:'2.5rem'}}>🏥</div>
          <h2>Create Account</h2>
          <p className="text-muted small">Join GastroCare — it's completely free</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2" style={{fontSize:'.875rem'}}>
            <i className="bi bi-exclamation-circle" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted" /></span>
              <input type="text" className="form-control border-start-0 ps-0" name="name"
                placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted" /></span>
              <input type="email" className="form-control border-start-0 ps-0" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted" /></span>
              <input type={showPw ? 'text' : 'password'} className="form-control border-start-0 border-end-0 ps-0" name="password"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
              <button type="button" className="input-group-text bg-light" onClick={() => setShowPw(!showPw)}>
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold small text-muted">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-shield-check text-muted" /></span>
              <input type={showPw ? 'text' : 'password'} className="form-control border-start-0 ps-0" name="confirm"
                placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</> : <><i className="bi bi-person-plus me-2" />Create Account</>}
          </button>
        </form>

        <div className="text-center mt-4">
          <hr /><p className="text-muted small">Already have an account? <Link to="/login" className="fw-semibold text-decoration-none" style={{color:'var(--gc-primary)'}}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
