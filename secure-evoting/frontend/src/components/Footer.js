import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1A3C6E', color: '#cdd9e5' }} className="py-4 mt-auto">
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-3">
          <h6 className="text-white fw-bold"><i className="fas fa-vote-yea me-2" />Secure E-Voting System</h6>
          <p className="small mb-0">A B.Tech Major Project — Department of CSE<br />Session 2024–2025</p>
        </div>
        <div className="col-md-4 mb-3">
          <h6 className="text-white fw-bold">Quick Links</h6>
          <ul className="list-unstyled small">
            <li><Link to="/"        className="text-decoration-none" style={{color:'#cdd9e5'}}>Home</Link></li>
            <li><Link to="/login"   className="text-decoration-none" style={{color:'#cdd9e5'}}>Login</Link></li>
            <li><Link to="/results" className="text-decoration-none" style={{color:'#cdd9e5'}}>Election Results</Link></li>
            <li><Link to="/verify"  className="text-decoration-none" style={{color:'#cdd9e5'}}>Verify Your Vote</Link></li>
          </ul>
        </div>
        <div className="col-md-4 mb-3">
          <h6 className="text-white fw-bold">Tech Stack</h6>
          <p className="small mb-0">
            React.js &nbsp;|&nbsp; Node.js &nbsp;|&nbsp; Express.js<br />
            MongoDB &nbsp;|&nbsp; JWT &nbsp;|&nbsp; bcrypt &nbsp;|&nbsp; SHA-256
          </p>
        </div>
      </div>
      <hr style={{borderColor:'rgba(255,255,255,.2)'}} />
      <p className="text-center small mb-0">
        © 2025 Secure E-Voting System &nbsp;|&nbsp; B.Tech Major Project &nbsp;|&nbsp;
        <span className="text-warning">All Rights Reserved</span>
      </p>
    </div>
  </footer>
);

export default Footer;
