import React, { useState } from 'react';
import { FaBell, FaHome, FaThLarge } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const PanelHeader = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // If on landing page, show Dashboard button, else show Home button
  const isLanding = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  const handleNav = () => {
    if (isLanding) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff',
      padding: '0 24px',
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      minHeight: 48,
      height: 48,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #f0f0f0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginRight: 0,
          border: '1px solid #eee',
        }}>
          <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="Logo" style={{ width: 18, height: 18 }} />
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <FaBell size={18} color="#444" style={{ cursor: 'pointer' }} />
        <button
          onClick={handleNav}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '4px 14px',
            fontWeight: 600,
            fontSize: 15,
            fontFamily: 'Montserrat, Arial, sans-serif',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {isLanding ? <FaThLarge style={{ marginRight: 6 }} /> : <FaHome style={{ marginRight: 6 }} />}
          {isLanding ? 'Dashboard' : 'Home'}
        </button>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#222',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              fontFamily: 'Montserrat, Arial, sans-serif',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => setDropdownOpen((open) => !open)}
            tabIndex={0}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
          >
            A
          </span>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 36,
                right: 0,
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                minWidth: 120,
                zIndex: 1000,
                padding: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0.75rem 1.25rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  color: '#222',
                }}
                onMouseDown={e => e.preventDefault()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PanelHeader; 