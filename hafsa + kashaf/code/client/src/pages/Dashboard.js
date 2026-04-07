import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/user/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="gc-loading page-pt">
      <div className="text-center">
        <div className="gc-spinner mb-3" />
        <p className="text-muted">Loading your dashboard...</p>
      </div>
    </div>
  );

  const med = data?.user?.medicalHistory || {};
  const profile = data?.user?.profile || {};
  const stats = data?.stats || {};
  const profileComplete = [profile.age, profile.country, profile.maritalStatus, med.bloodGroup].filter(Boolean).length;

  const healthItems = [
    { label: 'Profile Complete', val: (profileComplete / 4) * 100, color: 'var(--gc-primary)' },
    { label: 'Medical Info', val: med.bloodGroup ? 100 : 30, color: '#27ae60' },
    { label: 'Chat Activity', val: Math.min(stats.totalChats * 20, 100), color: 'var(--gc-accent)' },
  ];

  return (
    <div className="page-pt">
      <div className="container py-5">
        {/* Header */}
        <div className="mb-4">
          <h2>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-muted">Here's your GastroCare health overview.</p>
        </div>

        {/* Stats row */}
        <div className="row g-3 mb-4">
          {[
            { icon: '💬', label: 'Total Chats', val: stats.totalChats || 0 },
            { icon: '📨', label: 'Messages Sent', val: stats.totalMessages || 0 },
            { icon: '🩺', label: 'Conditions Tracked', val: (med.chronicDiseases||[]).length },
            { icon: '💊', label: 'Medications', val: (med.currentMedications||[]).length },
          ].map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div className="gc-stat-card">
                <div className="gc-stat-icon">{s.icon}</div>
                <div>
                  <div className="fw-bold fs-4">{s.val}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="row g-4">
          {/* Recent chats */}
          <div className="col-lg-7">
            <div className="bg-white rounded-gc shadow-gc p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0" style={{color:'var(--gc-primary-dark)'}}>Recent Chats</h5>
                <Link to="/chatbot" className="btn btn-sm btn-outline-primary">+ New Chat</Link>
              </div>
              {(stats.recentChats||[]).length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <div style={{fontSize:'3rem',marginBottom:12}}>💬</div>
                  <p>No chats yet. <Link to="/chatbot" style={{color:'var(--gc-primary)'}}>Start your first chat!</Link></p>
                </div>
              ) : (stats.recentChats||[]).map((c, i) => (
                <Link to="/chatbot" key={i} className="text-decoration-none">
                  <div className="gc-recent-item">
                    <div className="gc-chat-ico">💬</div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small" style={{color:'var(--gc-primary-dark)'}}>{c.title}</div>
                      <div className="text-muted" style={{fontSize:'.75rem'}}>{c.messages?.length || 0} messages</div>
                    </div>
                    <div className="text-muted" style={{fontSize:'.75rem'}}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Health summary */}
          <div className="col-lg-5">
            <div className="bg-white rounded-gc shadow-gc p-4 mb-4">
              <h5 className="mb-4" style={{color:'var(--gc-primary-dark)'}}>Health Overview</h5>
              {healthItems.map((h, i) => (
                <div key={i} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-semibold" style={{color:'var(--gc-text-mid)'}}>{h.label}</span>
                    <span className="small fw-bold" style={{color:h.color}}>{Math.round(h.val)}%</span>
                  </div>
                  <div className="gc-health-bar">
                    <div className="gc-health-fill" style={{width:`${h.val}%`,background:h.color}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick info card */}
            <div className="rounded-gc p-4 text-white" style={{background:'linear-gradient(135deg,var(--gc-primary),var(--gc-primary-light))'}}>
              <h6 className="mb-3"><i className="bi bi-person-vcard me-2"/>Quick Info</h6>
              {[
                ['Blood Group', med.bloodGroup || '—'],
                ['Diet', med.dietType || '—'],
                ['Country', profile.country || '—'],
                ['Age', profile.age ? `${profile.age} years` : '—'],
              ].map(([k, v]) => (
                <div key={k} className="d-flex justify-content-between mb-2" style={{fontSize:'.875rem',borderBottom:'1px solid rgba(255,255,255,.1)',paddingBottom:8}}>
                  <span style={{opacity:.8}}>{k}</span>
                  <span className="fw-semibold">{v}</span>
                </div>
              ))}
              <Link to="/profile" className="btn btn-sm w-100 mt-2 fw-semibold" style={{background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.3)'}}>
                <i className="bi bi-pencil me-2"/>Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4">
          <h5 className="mb-3" style={{color:'var(--gc-primary-dark)'}}>Quick Actions</h5>
          <div className="row g-3">
            {[
              { icon: '🤖', title: 'Start AI Chat', desc: 'Ask a health question', to: '/chatbot', color: 'var(--gc-primary)' },
              { icon: '🚨', title: 'Emergency Info', desc: 'View ambulance numbers', to: '/emergency', color: 'var(--gc-danger)' },
              { icon: '👤', title: 'Update Profile', desc: 'Complete your health profile', to: '/profile', color: 'var(--gc-accent-dark)' },
              { icon: '📞', title: 'Send Feedback', desc: 'Help us improve', to: '/contact', color: 'var(--gc-primary-light)' },
            ].map((a, i) => (
              <div className="col-6 col-lg-3" key={i}>
                <Link to={a.to} className="text-decoration-none">
                  <div className="bg-white rounded-gc shadow-gc p-3 text-center h-100" style={{transition:'all .25s',cursor:'pointer'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>{a.icon}</div>
                    <div className="fw-semibold small" style={{color:a.color}}>{a.title}</div>
                    <div className="text-muted" style={{fontSize:'.75rem'}}>{a.desc}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
