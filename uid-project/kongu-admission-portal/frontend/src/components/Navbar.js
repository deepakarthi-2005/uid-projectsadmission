import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <span className="brand-logo">KEC</span>
          <span className="brand-text">Kongu Engineering College</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && (
            <>
              <Link to="/admission" className="logout-button" style={{ textDecoration: 'none' }}>
                Admission
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="logout-button" style={{ textDecoration: 'none' }}>
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/applications" className="logout-button" style={{ textDecoration: 'none' }}>
                    Admin Applications
                  </Link>
                </>
              )}
            </>
          )}
        
        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user.fullName}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
