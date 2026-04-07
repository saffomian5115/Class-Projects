import React from 'react';
import Footer from '../components/Footer';

const countries = [
  {
    flag: '🇵🇰', name: 'Pakistan',
    numbers: [{ label: 'Rescue / Ambulance', num: '1122' }, { label: 'Emergency Helpline', num: '115' }, { label: 'Police', num: '15' }, { label: 'Fire Brigade', num: '16' }]
  },
  {
    flag: '🇺🇸', name: 'United States',
    numbers: [{ label: 'Emergency (All)', num: '911' }, { label: 'Poison Control', num: '1-800-222-1222' }, { label: 'Crisis Helpline', num: '988' }]
  },
  {
    flag: '🇬🇧', name: 'United Kingdom',
    numbers: [{ label: 'Emergency (All)', num: '999' }, { label: 'Non-Emergency', num: '111' }, { label: 'Samaritans', num: '116 123' }]
  },
  {
    flag: '🇹🇷', name: 'Turkey',
    numbers: [{ label: 'Ambulance (Acil)', num: '112' }, { label: 'Police', num: '155' }, { label: 'Fire (İtfaiye)', num: '110' }]
  },
];

const tips = [
  { icon: '😮‍💨', title: 'Stay Calm', desc: 'Panic worsens most situations. Breathe deeply and assess what is happening before acting.' },
  { icon: '📍', title: 'Know Your Location', desc: 'Always be ready to tell responders your exact address or nearest landmark.' },
  { icon: '🩹', title: 'Control Bleeding', desc: 'Apply firm pressure with a clean cloth. Do not remove it — add more layers if needed.' },
  { icon: '💊', title: 'Do Not Self-Medicate', desc: 'Avoid giving medications unless prescribed, especially for chest pain, strokes, or poisoning.' },
  { icon: '🏥', title: 'Recovery Position', desc: 'For unconscious patients who are breathing, turn them on their side to prevent choking.' },
  { icon: '⚡', title: 'CPR Ready', desc: 'If the person is not breathing, start hands-only CPR — 100-120 compressions per minute.' },
  { icon: '🌡️', title: 'Severe Fever', desc: 'Temperature above 40°C (104°F) requires immediate medical attention, especially in children.' },
  { icon: '🫁', title: 'Breathing Difficulty', desc: 'Keep person upright, loosen tight clothing, and call emergency services immediately.' },
];

const Emergency = () => (
  <div className="page-pt">
    {/* Hero */}
    <section className="gc-emergency-hero">
      <div className="container">
        <div className="gc-pulse mx-auto">🚨</div>
        <h1 className="mb-2">Emergency Services</h1>
        <p className="text-white-50 mb-0" style={{maxWidth:480,margin:'0 auto'}}>
          If you are in immediate danger, call the emergency number for your country right now.
        </p>
      </div>
    </section>

    {/* Alert Banner */}
    <div className="py-3" style={{background:'#fff3cd',borderBottom:'2px solid #ffc107'}}>
      <div className="container">
        <p className="mb-0 text-center fw-semibold" style={{color:'#664d03'}}>
          <i className="bi bi-exclamation-triangle-fill me-2" />
          GastroCare's AI chatbot can detect emergency symptoms and alert you automatically during conversations.
        </p>
      </div>
    </div>

    {/* Country Numbers */}
    <section className="gc-section">
      <div className="container">
        <div className="text-center mb-5">
          <span className="gc-tag">Emergency Contacts</span>
          <h2 className="mt-3">Call Immediately</h2>
          <p className="text-muted">Active phone numbers — tap to call directly from your device</p>
        </div>
        <div className="row g-4">
          {countries.map(c => (
            <div className="col-md-6 col-lg-3" key={c.name}>
              <div className="gc-country-card p-4 h-100">
                <div style={{fontSize:'2.5rem',marginBottom:8}}>{c.flag}</div>
                <h4 style={{color:'var(--gc-primary-dark)'}} className="mb-3">{c.name}</h4>
                {c.numbers.map(n => (
                  <div className="gc-num-row" key={n.num}>
                    <div>
                      <div style={{fontSize:'.75rem',color:'var(--gc-text-light)'}}>{n.label}</div>
                      <div className="num">{n.num}</div>
                    </div>
                    <a href={`tel:${n.num}`} className="gc-call-btn ms-2">
                      <i className="bi bi-telephone-fill" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Emergency Tips */}
    <section className="gc-section bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <span className="gc-tag">First Aid</span>
          <h2 className="mt-3">Emergency Tips</h2>
          <p className="text-muted">What to do while waiting for help to arrive</p>
        </div>
        <div className="row g-4">
          {tips.map((t, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="gc-tip-card h-100">
                <div className="gc-tip-icon">{t.icon}</div>
                <div>
                  <h6 className="fw-bold mb-1" style={{color:'var(--gc-primary-dark)'}}>{t.title}</h6>
                  <p className="text-muted small mb-0 lh-lg">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* AI Alert Info */}
    <section className="gc-section" style={{background:'linear-gradient(135deg,var(--gc-primary-dark),var(--gc-primary))'}}>
      <div className="container text-center">
        <div style={{fontSize:'3rem',marginBottom:16}}>🤖</div>
        <h2 className="text-white mb-3">AI Emergency Detection</h2>
        <p className="text-white-50 mb-4 mx-auto" style={{maxWidth:560}}>
          Our AI chatbot automatically detects emergency keywords like "chest pain," "can't breathe," or "heart attack" in all 3 languages and immediately shows you emergency numbers with a red alert.
        </p>
        <a href="/chatbot" className="btn btn-lg fw-semibold px-5" style={{background:'var(--gc-accent)',color:'var(--gc-primary-dark)',borderRadius:50}}>
          <i className="bi bi-robot me-2" />Open AI Chat
        </a>
      </div>
    </section>

    <Footer />
  </div>
);

export default Emergency;
