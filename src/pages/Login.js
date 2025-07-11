import React, { useState } from 'react';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Global.css';

const Login = () => {
  const [loginType, setLoginType] = useState('User');

  return (
    <div className="login-bg">
      <div className="login-header-row">
        <Link to="/" className="login-back-arrow" title="Back to Home">
          <FaArrowLeft />
        </Link>
        <span className="login-brand login-brand-left">SHOP.CO</span>
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="login-bg-video"
        src={`${process.env.PUBLIC_URL}/assets/videos/login-bg.mp4`}
      />
      <div className="login-content">
        <div className="login-form-title">Login Form</div>
        <div className="login-type-switch">
          <div
            className={`login-type-box${loginType === 'User' ? ' selected' : ''}`}
            onClick={() => setLoginType('User')}
          >
            User
          </div>
          <div
            className={`login-type-box${loginType === 'Admin' ? ' selected' : ''}`}
            onClick={() => setLoginType('Admin')}
          >
            Admin
          </div>
        </div>
        <form className="login-form">
          <div className="login-input-group">
            <span className="login-icon"><FaUser /></span>
            <input
              type="text"
              placeholder={loginType === 'Admin' ? 'Username' : 'Username'}
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <span className="login-icon"><FaLock /></span>
            <input type="password" placeholder="Password" className="login-input" />
          </div>
          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="login-forgot">Forgot Password?</a>
          </div>
          <button type="submit" className="login-btn-main">LOGIN</button>
          {loginType === 'User' && (
            <div className="login-signup-message">Don't have an account? <a href="#" className="login-signup-link">Signup!</a></div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login; 