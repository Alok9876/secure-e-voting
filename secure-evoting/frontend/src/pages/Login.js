import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.voter, data.token);
      toast.success(`Welcome back, ${data.voter.name.split(' ')[0]}! 🗳️`);
      navigate(data.voter.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card p-4">
            <div className="text-center mb-4">
              <div style={{width:64,height:64,borderRadius:16,background:'#1A3C6E',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                <i className="fas fa-lock fa-xl text-white" />
              </div>
              <h4 className="fw-bold">Voter Login</h4>
              <p className="text-muted small">Secure access to your voting portal</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-envelope" /></span>
                  <input className="form-control" type="email" name="email"
                    value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-key" /></span>
                  <input className="form-control" type={showPass ? 'text' : 'password'}
                    name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your password" required />
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => setShowPass(!showPass)}>
                    <i className={`fas fa-eye${showPass ? '-slash' : ''}`} />
                  </button>
                </div>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-semibold" type="submit" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Logging in...</> : <><i className="fas fa-sign-in-alt me-2" />Login</>}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="small mb-1">Don't have an account? <Link to="/register" className="fw-semibold">Register</Link></p>
            </div>

            <hr />
            <div className="alert alert-info small py-2 mb-0">
              <strong>Demo Admin:</strong><br />
              📧 admin@evoting.com &nbsp;|&nbsp; 🔑 Admin@123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
