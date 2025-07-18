import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowLeft, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Global.css';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik
import * as Yup from 'yup'; // Import Yup
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../store/authSlice';
import { userLogin } from '../store/userSlice';
import db from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Signup validation schema
const signupValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

// Login validation schema
const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [loginType, setLoginType] = useState('User');
  const query = useQuery();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false); // for login
  const [showSignupPassword, setShowSignupPassword] = useState(false); // for signup

  // Redux
  const dispatch = useDispatch();
  const { user, error } = useSelector(state => state.auth);

  useEffect(() => {
    const qMode = query.get('mode');
    if (qMode === 'signup') setMode('signup');
    else setMode('login');
  }, [query]);

  useEffect(() => {
    // Clear all login/signup fields on mount
    const ids = ['user_email', 'user_password', 'admin_email', 'admin_password', 'signup_email', 'signup_password', 'signup_name'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    // Persist user login from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    if (userEmail && userName && userId) {
      dispatch(userLogin({ id: userId, email: userEmail, name: userName }));
    }
  }, [mode, loginType, dispatch]);

  // Redirect to admin dashboard on successful admin login
  useEffect(() => {
    if (user && loginType === 'Admin' && mode === 'login') {
      navigate('/admin'); // Correct route
    }
  }, [user, loginType, mode, navigate]);

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
        <button
          type="button"
          className="login-back-arrow"
          title="Back to Home"
          aria-label="Back to Home"
          tabIndex={0}
          style={{
            cursor: 'pointer',
            background: 'rgba(0,0,0,0.3)',
            border: 'none',
            outline: 'none',
            zIndex: 1000,
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={() => navigate('/')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              e.preventDefault();
              navigate('/');
            }
          }}
        >
          <FaArrowLeft />
        </button>
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
            key="signup"
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={signupValidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
              try {
                // Add user to Firestore 'users' collection
                await addDoc(collection(db, 'users'), {
                  name: values.name,
                  email: values.email,
                  password: values.password, // WARNING: Do not store plain text passwords in production
                  orders: [],
                  phone: '',
                  address: ''
                });
                setStatus({ success: 'Signup successful! You can now log in.' });
                resetForm();
                setTimeout(() => {
                  navigate('/login');
                }, 1500);
              } catch (error) {
                setStatus({ error: 'Signup failed. Please try again.' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ status }) => (
              <Form className="signup-form" autoComplete="off">
                <div className="login-input-group">
                  <span className="login-icon"><FaUser /></span>
                  <Field type="text" name="name" id="signup_name" placeholder="Name" className="login-input" autoComplete="off" readOnly onFocus={e => e.target.removeAttribute('readOnly')} />
                </div>
                <ErrorMessage name="name" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group">
                  <span className="login-icon"><FaEnvelope /></span>
                  <Field type="email" name="email" id="signup_email" placeholder="Email" className="login-input" autoComplete="off" readOnly onFocus={e => e.target.removeAttribute('readOnly')} />
                </div>
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group" style={{ position: 'relative' }}>
                  <span className="login-icon"><FaLock /></span>
                  <Field
                    type={showSignupPassword ? 'text' : 'password'}
                    name="password"
                    id="signup_password"
                    placeholder="Password"
                    className="login-input"
                    autoComplete="off"
                    readOnly
                    onFocus={e => e.target.removeAttribute('readOnly')}
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
                {status && status.success && <div style={{ color: 'green', fontSize: '0.9rem', marginTop: 8 }}>{status.success}</div>}
                {status && status.error && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: 8 }}>{status.error}</div>}
                <div className="login-signup-message">
                  Already have an account? <button type="button" className="login-signup-link" onClick={handleLoginClick}>Login!</button>
                </div>
              </Form>
            )}
          </Formik>
        ) : loginType === 'User' ? (
          <Formik
            key="user-login"
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
              try {
                const inputEmail = values.email.trim().toLowerCase();
                const inputPassword = values.password.trim();
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef); // fetch all users
                console.log('Attempting login for email:', inputEmail);
                let found = false;
                let foundUserId = '';
                let foundUserName = '';
                querySnapshot.forEach(docSnap => {
                  const userData = docSnap.data();
                  console.log('Checking user:', userData.email, userData.password);
                  if (
                    userData.email &&
                    userData.email.trim().toLowerCase() === inputEmail &&
                    userData.password &&
                    userData.password.trim() === inputPassword
                  ) {
                    found = true;
                    foundUserId = docSnap.id;
                    foundUserName = userData.name || '';
                  }
                });
                if (found) {
                  localStorage.setItem('userName', foundUserName);
                  localStorage.setItem('userEmail', inputEmail);
                  localStorage.setItem('userId', foundUserId);
                  dispatch(userLogin({ id: foundUserId, email: inputEmail, name: foundUserName }));
                  setStatus({ success: 'Login successful! Redirecting...' });
                  setTimeout(() => {
                    navigate('/');
                  }, 1200);
                } else {
                  setStatus({ error: 'Invalid email or password.' });
                }
              } catch (error) {
                console.error('Login error:', error);
                setStatus({ error: 'Login failed. Please try again.' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ status }) => (
              <Form className="login-form" autoComplete="off">
                <div className="login-input-group">
                  <span className="login-icon"><FaUser /></span>
                  <Field
                    type="email"
                    name="email"
                    id="user_email"
                    placeholder="Email"
                    className="login-input"
                    autoComplete="off"
                    readOnly
                    onFocus={e => e.target.removeAttribute('readOnly')}
                  />
                </div>
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group" style={{ position: 'relative' }}>
                  <span className="login-icon"><FaLock /></span>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="user_password"
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
                {status && status.success && <div style={{ color: 'green', fontSize: '0.9rem', marginTop: 8 }}>{status.success}</div>}
                {status && status.error && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: 8 }}>{status.error}</div>}
                <div className="login-signup-message">
                  Don't have an account? <button type="button" className="login-signup-link" onClick={handleSignupClick}>Signup!</button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            key="admin-login"
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={values => {
              dispatch(loginRequest(values));
            }}
          >
            {() => (
              <Form className="login-form" autoComplete="off">
                <div className="login-input-group">
                  <span className="login-icon"><FaUser /></span>
                  <Field
                    type="email"
                    name="email"
                    id="admin_email"
                    placeholder="Email"
                    className="login-input"
                    autoComplete="off"
                    readOnly
                    onFocus={e => e.target.removeAttribute('readOnly')}
                  />
                </div>
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
                <div className="login-input-group" style={{ position: 'relative' }}>
                  <span className="login-icon"><FaLock /></span>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="admin_password"
                    placeholder="Password"
                    className="login-input"
                    autoComplete="off"
                    readOnly
                    onFocus={e => e.target.removeAttribute('readOnly')}
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
                {error && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: 8 }}>{error}</div>}
                <button type="submit" className="login-btn-main">LOGIN</button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Login; 