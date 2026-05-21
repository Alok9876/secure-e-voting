import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1); // 1=form, 2=otp
  const [loading, setLoading] = useState(false);
  const [otp, setOtp]         = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    aadhaarNo: '', dateOfBirth: '', phone: '', constituency: 'General',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (form.aadhaarNo.length !== 12) {
      return toast.error('Aadhaar number must be 12 digits.');
    }
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      await API.post('/auth/send-otp', { email: form.email });
      toast.success('Registered! OTP sent to your email.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/verify-otp', { email: form.email, otp });
      toast.success('Email verified! Await admin approval to login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card p-4">
            <div className="text-center mb-4">
              <i className="fas fa-user-plus fa-2x mb-2" style={{color:'#1A3C6E'}} />
              <h4 className="fw-bold">Voter Registration</h4>
              <p className="text-muted small">
                {step === 1 ? 'Fill in your details to register as a voter' : 'Enter the OTP sent to your email'}
              </p>
              {/* Progress */}
              <div className="d-flex justify-content-center gap-2 mt-3">
                {['Details','Verify Email','Admin Approval'].map((s,i)=>(
                  <div key={i} className="d-flex align-items-center gap-1">
                    <div style={{width:24,height:24,borderRadius:'50%',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',background: step>i ? '#198754' : step===i+1 ? '#1A3C6E' : '#dee2e6',color: step>=i+1 ? '#fff' : '#666',fontWeight:700}}>
                      {step > i+1 ? '✓' : i+1}
                    </div>
                    <span className="small">{s}</span>
                    {i<2 && <span className="text-muted">›</span>}
                  </div>
                ))}
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleRegister}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="As per Aadhaar card" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password *</label>
                    <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" minLength={8} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm Password *</label>
                    <input className="form-control" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Aadhaar Number *</label>
                    <input className="form-control" name="aadhaarNo" value={form.aadhaarNo} onChange={handleChange} placeholder="12-digit Aadhaar" maxLength={12} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date of Birth *</label>
                    <input className="form-control" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Constituency</label>
                    <select className="form-select" name="constituency" value={form.constituency} onChange={handleChange}>
                      {['General','North','South','East','West','Central'].map(c=>(
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="alert alert-info small mb-0 py-2">
                      <i className="fas fa-info-circle me-2" />
                      After registration, verify your email and await admin approval before you can vote.
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100 py-2 fw-semibold" type="submit" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Registering...</> : 'Register & Send OTP'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="alert alert-success">
                  <i className="fas fa-envelope-open-text me-2" />
                  OTP sent to <strong>{form.email}</strong>. Check your inbox (and spam folder).
                </div>
                <label className="form-label fw-semibold">Enter 6-Digit OTP *</label>
                <input
                  className="form-control form-control-lg text-center fw-bold"
                  value={otp} onChange={e=>setOtp(e.target.value)}
                  maxLength={6} placeholder="_ _ _ _ _ _" required
                />
                <button className="btn btn-success w-100 py-2 fw-semibold mt-3" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Verifying...</> : 'Verify Email'}
                </button>
                <button type="button" className="btn btn-outline-secondary w-100 mt-2"
                  onClick={async () => { await API.post('/auth/send-otp',{email:form.email}); toast.info('OTP resent!'); }}>
                  Resend OTP
                </button>
              </form>
            )}

            <p className="text-center mt-3 mb-0 small">
              Already have an account? <Link to="/login" className="fw-semibold">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
