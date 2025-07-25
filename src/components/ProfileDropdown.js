import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import './ProfileDropdown.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { useDispatch } from 'react-redux';
import { userLogout } from '../store/userSlice';

const ProfileDropdown = ({ userName }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    dispatch(userLogout());
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  return (
    loading ? (
      <Loader />
    ) : (
      <div
        className="profile-dropdown-container"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ display: 'inline-block', position: 'relative' }}
      >
        <div className="profile-icon">
          {userName ? (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              aspectRatio: '1/1',
              borderRadius: '50%',
              background: '#111',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 13,
              boxSizing: 'border-box',
              padding: 0,
              margin: 0
            }}>{userName.charAt(0).toUpperCase()}</span>
          ) : (
            <FaUser color="#111" />
          )}
        </div>
        {open && (
          <div className="profile-dropdown-menu">
            <button className="profile-dropdown-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/my-account')}>My Account</button>
            <button className="profile-dropdown-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/my-orders')}>My Orders</button>
            <button className="profile-dropdown-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    )
  );
};

export default ProfileDropdown; 