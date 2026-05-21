import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: 'fa-shield-alt',   color: '#1A3C6E', title: 'Secure Authentication', desc: 'Multi-layer JWT + OTP verification keeps your identity protected at every step.' },
  { icon: 'fa-lock',         color: '#2E75B6', title: 'Encrypted Votes',        desc: 'Every vote is SHA-256 encrypted before storage. Nobody can trace your choice.' },
  { icon: 'fa-check-double', color: '#198754', title: 'Double-Vote Prevention', desc: 'Smart server logic and database constraints guarantee you can only vote once per election.' },
  { icon: 'fa-chart-bar',    color: '#fd7e14', title: 'Live Results',           desc: 'View transparent results with beautiful charts as soon as polls close.' },
  { icon: 'fa-receipt',      color: '#6610f2', title: 'Vote Receipt',           desc: 'Get a unique SHA-256 receipt hash to independently verify your vote was counted.' },
  { icon: 'fa-user-shield',  color: '#C00000', title: 'Admin Controls',         desc: 'Full election lifecycle management: create, open, monitor, and close elections.' },
];

const steps = [
  { num: '01', title: 'Register',       desc: 'Sign up with your name, email, Aadhaar number and create a password.' },
  { num: '02', title: 'Verify Email',   desc: 'Enter the OTP sent to your registered email to confirm your identity.' },
  { num: '03', title: 'Admin Approval', desc: 'Wait for the Election Commission admin to verify and approve your account.' },
  { num: '04', title: 'Cast Your Vote', desc: 'Log in, browse active elections, pick your candidate, and submit securely.' },
];

const Home = () => {
  const { user } = useAuth();
  return (
    <>
      {/* Hero */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="mb-3">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6">
              🔒 100% Secure &nbsp;|&nbsp; 🗳️ Transparent &nbsp;|&nbsp; ✅ Verified
            </span>
          </div>
          <h1>Secure E-Voting System</h1>
          <p className="lead mt-3 mb-4" style={{maxWidth:600,margin:'auto'}}>
            A modern, cryptographically secure electronic voting platform built with
            React, Node.js, and MongoDB. Your vote. Your voice. Protected.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {user ? (
              <Link to="/elections" className="btn btn-warning btn-lg px-4 fw-bold">
                <i className="fas fa-vote-yea me-2" />View Elections
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-warning btn-lg px-4 fw-bold">
                  <i className="fas fa-user-plus me-2" />Register to Vote
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-sign-in-alt me-2" />Login
                </Link>
              </>
            )}
            <Link to="/results" className="btn btn-outline-light btn-lg px-4">
              <i className="fas fa-chart-bar me-2" />View Results
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{background:'#1A3C6E'}} className="py-3">
        <div className="container">
          <div className="row text-center text-white g-2">
            {[['fas fa-users','Registered Voters','Secure & Verified'],
              ['fas fa-poll','Active Elections','Ongoing Now'],
              ['fas fa-vote-yea','Votes Cast','Encrypted & Safe'],
              ['fas fa-lock','Security Level','Enterprise Grade']].map(([ic,label,sub],i)=>(
              <div key={i} className="col-6 col-md-3">
                <i className={`fas ${ic} fa-lg mb-1`}></i>
                <div className="fw-bold">{label}</div>
                <div className="small opacity-75">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{color:'#1A3C6E'}}>Why Choose Our Platform?</h2>
          <p className="text-center text-muted mb-5">Built with security-first architecture for trustworthy elections</p>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 p-4">
                  <div className="mb-3">
                    <div style={{width:52,height:52,borderRadius:12,background:f.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <i className={`fas ${f.icon} fa-lg`} style={{color:f.color}} />
                    </div>
                  </div>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5" style={{background:'#f0f4fb'}}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{color:'#1A3C6E'}}>How It Works</h2>
          <p className="text-center text-muted mb-5">Four simple steps to cast your secure vote</p>
          <div className="row g-4">
            {steps.map((s, i) => (
              <div key={i} className="col-md-3 text-center">
                <div style={{width:64,height:64,borderRadius:'50%',background:'#1A3C6E',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',fontWeight:700,margin:'0 auto 16px'}}>
                  {s.num}
                </div>
                <h5 className="fw-bold">{s.title}</h5>
                <p className="text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Get Started <i className="fas fa-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 text-center" style={{background:'linear-gradient(135deg,#1A3C6E,#2E75B6)',color:'#fff'}}>
        <div className="container">
          <h2 className="fw-bold">Ready to Exercise Your Democratic Right?</h2>
          <p className="lead mt-2 mb-4">Join the secure, transparent, and tamper-proof e-voting revolution.</p>
          {!user && (
            <Link to="/register" className="btn btn-warning btn-lg px-5 fw-bold">
              <i className="fas fa-vote-yea me-2" />Register Now — It's Free
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
