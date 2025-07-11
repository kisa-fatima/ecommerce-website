import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowLeft, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Global.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Login = () => {
  const [loginType, setLoginType] = useState('User');
  const query = useQuery();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    const qMode = query.get('mode');
    if (qMode === 'signup') setMode('signup');
    else setMode('login');
  }, [query]);

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/login?mode=signup');
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

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
      <div className={`login-content${mode === 'signup' ? ' signup-mode' : ''}`}>
        <div className="login-form-title">{mode === 'signup' ? 'Signup Form' : 'Login Form'}</div>
        {mode === 'login' && (
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
        )}
        <form className={mode === 'signup' ? 'signup-form' : 'login-form'}>
          {mode === 'signup' && (
            <>
              <div className="login-input-group">
                <span className="login-icon"><FaUser /></span>
                <input type="text" placeholder="Name" className="login-input" />
              </div>
              <div className="login-input-group">
                <span className="login-icon"><FaEnvelope /></span>
                <input type="email" placeholder="Email" className="login-input" />
              </div>
              <div className="login-input-group">
                <span className="login-icon"><FaPhone /></span>
                <input type="tel" placeholder="Contact No" className="login-input" />
              </div>
            </>
          )}
          <div className="login-input-group">
            <span className="login-icon"><FaUser /></span>
            <input
              type="text"
              placeholder={mode === 'signup' ? 'Username' : (loginType === 'Admin' ? 'Username' : 'Username')}
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <span className="login-icon"><FaLock /></span>
            <input type="password" placeholder="Password" className="login-input" />
          </div>
          {mode === 'login' && (
            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="login-forgot">Forgot Password?</a>
            </div>
          )}
          <button type="submit" className="login-btn-main">{mode === 'signup' ? 'SIGNUP' : 'LOGIN'}</button>
          {mode === 'login' ? (
            loginType === 'User' ? ( // Only show signup for User
              <div className="login-signup-message">
                Don't have an account? <a href="#" className="login-signup-link" onClick={handleSignupClick}>Signup!</a>
              </div>
            ) : null // No signup for Admin
          ) : (
            <div className="login-signup-message">
              Already have an account? <a href="#" className="login-signup-link" onClick={handleLoginClick}>Login!</a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login; 