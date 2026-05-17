import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-2">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-vote-yea me-2" />Secure E-Voting
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/results">Results</NavLink>
            </li>

            {user ? (
              <>
                {!isAdmin() && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/elections">Elections</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/verify">Verify Vote</NavLink>
                    </li>
                  </>
                )}
                {isAdmin() && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      <i className="fas fa-shield-alt me-1" />Admin Panel
                    </NavLink>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i className="fas fa-user-circle me-1" />{user.name?.split(' ')[0]}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><span className="dropdown-item-text text-muted small">{user.email}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2" />Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light text-primary fw-semibold px-3 ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
