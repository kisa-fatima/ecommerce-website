import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="profile-dropdown-container"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <div className="profile-icon">
        <FaUser color="#111" />
      </div>
      {open && (
        <div className="profile-dropdown-menu">
          <button className="profile-dropdown-item" style={{ cursor: 'pointer' }}>My Account</button>
          <button className="profile-dropdown-item" style={{ cursor: 'pointer' }}>My Orders</button>
          <button className="profile-dropdown-item" style={{ cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 