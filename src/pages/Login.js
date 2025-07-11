import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowLeft, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Global.css';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik
import * as Yup from 'yup'; // Import Yup

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Signup validation schema
const signupValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .required('Email is required')
    .test('is-gmail', 'Invalid email', value => value && value.includes('@gmail')),
  username: Yup.string()
    .required('Username is required')
    .test('is-gmail', 'Invalid username', value => value && value.includes('@gmail')),
  password: Yup.string().required('Password is required'),
});

// Login validation schema
const loginValidationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .test('is-gmail', 'Invalid username', value => value && value.includes('@gmail')),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [loginType, setLoginType] = useState('User');
  const query = useQuery();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false); // for login
  const [showSignupPassword, setShowSignupPassword] = useState(false); // for signup

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
      <div className="login-form-header">
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
      </div>
      <div className={`login-content${mode === 'signup' ? ' signup-mode' : ''}`}>
        {mode === 'signup' ? (
          <Formik
            initialValues={{ name: '', email: '', username: '', password: '' }}
            validationSchema={signupValidationSchema}
            onSubmit={values => { /* handle signup */ }}
          >
            {() => (
              <Form className="signup-form" autoComplete="off"> {/* Turn off autocomplete */}
                <div className="login-input-group">
                  <span className="login-icon"><FaUser /></span>
                  <Field type="text" name="name" placeholder="Name" className="login-input" autoComplete="off" />
                </div>
                <ErrorMessage name="name" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group">
                  <span className="login-icon"><FaEnvelope /></span>
                  <Field type="email" name="email" placeholder="Email" className="login-input" autoComplete="off" />
                </div>
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group">
                  <span className="login-icon"><FaUser /></span>
                  <Field type="text" name="username" placeholder="Username" className="login-input" autoComplete="off" />
                </div>
                <ErrorMessage name="username" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group" style={{ position: 'relative' }}>
                  <span className="login-icon"><FaLock /></span>
                  <Field
                    type={showSignupPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    className="login-input"
                    autoComplete="off"
                  />
                  <span
                    className="password-eye"
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#888',
                      fontSize: '1.1rem'
                    }}
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                  >
                    {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <button type="submit" className="login-btn-main">SIGNUP</button>
                <div className="login-signup-message">
                  Already have an account? <a href="#" className="login-signup-link" onClick={handleLoginClick}>Login!</a>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={values => { /* handle login */ }}
          >
            {() => (
              <Form className="login-form" autoComplete="off"> {/* Turn off autocomplete */}
                <div className="login-input-group">
                  <span className="login-icon"><FaUser /></span>
                  <Field
                    type="text"
                    name="username"
                    placeholder={loginType === 'Admin' ? 'Username' : 'Username'}
                    className="login-input"
                    autoComplete="off"
                  />
                </div>
                <ErrorMessage name="username" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group" style={{ position: 'relative' }}>
                  <span className="login-icon"><FaLock /></span>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    className="login-input"
                    autoComplete="off"
                  />
                  <span
                    className="password-eye"
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#888',
                      fontSize: '1.1rem'
                    }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-options">
                  <label className="login-remember">
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#" className="login-forgot">Forgot Password?</a>
                </div>
                <button type="submit" className="login-btn-main">LOGIN</button>
                {loginType === 'User' ? (
                  <div className="login-signup-message">
                    Don't have an account? <a href="#" className="login-signup-link" onClick={handleSignupClick}>Signup!</a>
                  </div>
                ) : null}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Login; 