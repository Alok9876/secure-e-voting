import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container py-5 text-center">
    <div style={{ fontSize: '5rem' }}>🗳️</div>
    <h1 className="fw-bold" style={{ color: '#1A3C6E' }}>404</h1>
    <h4 className="text-muted mb-3">Page Not Found</h4>
    <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary px-4">
      <i className="fas fa-home me-2" />Go Home
    </Link>
  </div>
);

export default NotFound;
