import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out.');
    navigate('/');
  };

  const links = [
    { to: '/admin',             icon: 'fa-tachometer-alt', label: 'Dashboard',  end: true },
    { to: '/admin/elections',   icon: 'fa-poll',           label: 'Elections'              },
    { to: '/admin/voters',      icon: 'fa-users',          label: 'Voters'                 },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '80vh' }}>
      {/* Sidebar */}
      <div className="admin-sidebar d-none d-md-flex flex-column p-3" style={{ width: 230, minWidth: 230 }}>
        <div className="text-white mb-4 px-2 pt-2">
          <div className="fw-bold fs-6"><i className="fas fa-shield-alt me-2" />Admin Panel</div>
          <div className="small opacity-75 mt-1">{user?.name}</div>
          <div className="small opacity-50">{user?.email}</div>
        </div>
        <nav className="nav flex-column gap-1 flex-grow-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `nav-link px-3 py-2 ${isActive ? 'active' : ''}`}>
              <i className={`fas ${l.icon} me-2`} />{l.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline-light btn-sm mt-3" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2" />Logout
        </button>
      </div>

      {/* Mobile top bar */}
      <div className="d-md-none w-100 position-fixed top-0 start-0 z-3" style={{ background: '#1A3C6E', paddingTop: 56 }}>
        <div className="d-flex gap-2 px-3 py-2 overflow-auto">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-warning' : 'btn-outline-light'}`}>
              <i className={`fas ${l.icon} me-1`} />{l.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4 pt-md-4" style={{ paddingTop: '7rem' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
