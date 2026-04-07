import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TABS = ['Personal Info', 'Medical History', 'Change Password'];

const Profile = () => {
  const { user, login } = useAuth();
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ name:'', age:'', height:'', maritalStatus:'', profession:'', income:'', area:'', country:'', profilePicture:'' });
  const [medical, setMedical] = useState({ bloodGroup:'', allergies:[], chronicDiseases:[], currentMedications:[], previousSurgeries:[], smokingStatus:'', alcoholConsumption:'', digestiveIssues:[], dietType:'', weight:'' });
  const [tagInputs, setTagInputs] = useState({ allergies:'', chronicDiseases:'', currentMedications:'', previousSurgeries:'', digestiveIssues:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwForm, setPwForm] = useState({ current:'', newPw:'', confirm:'' });
  const fileRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/user/profile');
        setProfile({ name: data.name || '', ...data.profile });
        if (data.medicalHistory) setMedical(data.medicalHistory);
      } catch {}
    };
    fetchProfile();
  }, []);

  const handleProfileChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleMedicalChange = e => setMedical({ ...medical, [e.target.name]: e.target.value });

  const addTag = (field) => {
    if (!tagInputs[field].trim()) return;
    setMedical(prev => ({ ...prev, [field]: [...(prev[field]||[]), tagInputs[field].trim()] }));
    setTagInputs(prev => ({ ...prev, [field]: '' }));
  };
  const removeTag = (field, idx) => setMedical(prev => ({ ...prev, [field]: prev[field].filter((_,i)=>i!==idx) }));

  const saveProfile = async () => {
    setSaving(true); setMsg('');
    try {
      const { data } = await axios.put('/api/user/profile', { name: profile.name, profile, medicalHistory: medical });
      login({ ...user, name: data.name, profile: data.profile });
      setMsg('✅ Profile saved successfully!');
    } catch { setMsg('❌ Failed to save. Try again.'); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handlePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        await axios.put('/api/user/picture', { profilePicture: base64 });
        setProfile(p => ({ ...p, profilePicture: base64 }));
        login({ ...user, profile: { ...user.profile, profilePicture: base64 } });
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const initial = profile.name?.[0]?.toUpperCase() || 'U';

  const TagField = ({ field, label }) => (
    <div className="mb-3">
      <label className="form-label fw-semibold small text-muted">{label}</label>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {(medical[field]||[]).map((t,i) => (
          <span key={i} className="gc-tag-badge">
            {t} <button onClick={() => removeTag(field, i)}>×</button>
          </span>
        ))}
      </div>
      <div className="input-group input-group-sm" style={{maxWidth:320}}>
        <input type="text" className="form-control" placeholder={`Add ${label.toLowerCase()}...`}
          value={tagInputs[field]} onChange={e => setTagInputs(p=>({...p,[field]:e.target.value}))}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(field))} />
        <button className="btn btn-outline-primary" onClick={() => addTag(field)}>Add</button>
      </div>
    </div>
  );

  return (
    <div className="page-pt">
      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="bg-white rounded-gc shadow-gc p-4 text-center">
              <div className="position-relative d-inline-block mb-3">
                <div className="gc-profile-avatar">
                  {profile.profilePicture ? <img src={profile.profilePicture} alt="" /> : initial}
                </div>
                <div className="gc-avatar-upload-btn" onClick={() => fileRef.current.click()} title="Change photo">
                  <i className="bi bi-camera-fill" style={{fontSize:'.7rem'}}/>
                </div>
                <input type="file" ref={fileRef} className="d-none" accept="image/*" onChange={handlePicture} />
              </div>
              <h5 className="mb-1">{profile.name || user?.name}</h5>
              <p className="text-muted small mb-3">{user?.email}</p>
              <span className="badge px-3 py-2 rounded-pill" style={{background:'rgba(10,79,60,.1)',color:'var(--gc-primary)'}}>
                <i className="bi bi-shield-check me-1"/>Verified User
              </span>
              <hr />
              <div className="d-flex flex-column gap-1">
                {TABS.map((t, i) => (
                  <button key={i} className={`btn btn-sm text-start ${tab===i ? 'btn-primary' : 'btn-light'}`} onClick={() => setTab(i)}>
                    <i className={`bi ${['bi-person','bi-heart-pulse','bi-lock'][i]} me-2`}/>{t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="col-lg-9">
            {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'} py-2 mb-3`}>{msg}</div>}

            {/* Personal Info */}
            {tab === 0 && (
              <div className="bg-white rounded-gc shadow-gc p-4">
                <h5 style={{color:'var(--gc-primary)',borderBottom:'2px solid var(--gc-bg)',paddingBottom:12,marginBottom:24}}>
                  <i className="bi bi-person me-2"/>Personal Information
                </h5>
                <div className="row g-3">
                  {[
                    {label:'Full Name',name:'name',type:'text',ph:'Your full name'},
                    {label:'Age',name:'age',type:'number',ph:'Your age'},
                    {label:'Height (cm/ft)',name:'height',type:'text',ph:'e.g. 170cm or 5\'7"'},
                    {label:'Weight (kg/lbs)',name:'weight',type:'text',ph:'e.g. 70kg'},
                    {label:'Profession',name:'profession',type:'text',ph:'Your profession'},
                    {label:'Monthly Income',name:'income',type:'text',ph:'e.g. PKR 50,000'},
                    {label:'Area / City',name:'area',type:'text',ph:'Your city'},
                    {label:'Country',name:'country',type:'text',ph:'Your country'},
                  ].map(f => (
                    <div className="col-md-6" key={f.name}>
                      <label className="form-label fw-semibold small text-muted">{f.label}</label>
                      <input type={f.type} className="form-control" name={f.name}
                        value={profile[f.name]||''} onChange={handleProfileChange} placeholder={f.ph} />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Marital Status</label>
                    <select className="form-select" name="maritalStatus" value={profile.maritalStatus||''} onChange={handleProfileChange}>
                      <option value="">Select status</option>
                      {['Single','Married','Divorced','Widowed'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary mt-4 px-4 fw-semibold" onClick={saveProfile} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</> : <><i className="bi bi-check-lg me-2"/>Save Changes</>}
                </button>
              </div>
            )}

            {/* Medical History */}
            {tab === 1 && (
              <div className="bg-white rounded-gc shadow-gc p-4">
                <h5 style={{color:'var(--gc-primary)',borderBottom:'2px solid var(--gc-bg)',paddingBottom:12,marginBottom:24}}>
                  <i className="bi bi-heart-pulse me-2"/>Medical History
                </h5>
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Blood Group</label>
                    <select className="form-select" name="bloodGroup" value={medical.bloodGroup||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=><option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Diet Type</label>
                    <select className="form-select" name="dietType" value={medical.dietType||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['Omnivore','Vegetarian','Vegan','Pescatarian','Keto','Other'].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Smoking Status</label>
                    <select className="form-select" name="smokingStatus" value={medical.smokingStatus||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['Never','Former','Current'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Alcohol Consumption</label>
                    <select className="form-select" name="alcoholConsumption" value={medical.alcoholConsumption||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['Never','Occasionally','Regularly'].map(a=><option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <TagField field="allergies" label="Allergies" />
                <TagField field="chronicDiseases" label="Chronic Diseases" />
                <TagField field="currentMedications" label="Current Medications" />
                <TagField field="previousSurgeries" label="Previous Surgeries" />
                <TagField field="digestiveIssues" label="Digestive Issues" />
                <button className="btn btn-primary mt-2 px-4 fw-semibold" onClick={saveProfile} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</> : <><i className="bi bi-check-lg me-2"/>Save Medical History</>}
                </button>
              </div>
            )}

            {/* Change Password */}
            {tab === 2 && (
              <div className="bg-white rounded-gc shadow-gc p-4">
                <h5 style={{color:'var(--gc-primary)',borderBottom:'2px solid var(--gc-bg)',paddingBottom:12,marginBottom:24}}>
                  <i className="bi bi-lock me-2"/>Change Password
                </h5>
                <div style={{maxWidth:400}}>
                  {['current','newPw','confirm'].map((f,i)=>(
                    <div className="mb-3" key={f}>
                      <label className="form-label fw-semibold small text-muted">{['Current Password','New Password','Confirm New Password'][i]}</label>
                      <input type="password" className="form-control" value={pwForm[f]} onChange={e=>setPwForm(p=>({...p,[f]:e.target.value}))} placeholder="••••••••" />
                    </div>
                  ))}
                  <button className="btn btn-primary fw-semibold px-4">
                    <i className="bi bi-shield-lock me-2"/>Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
