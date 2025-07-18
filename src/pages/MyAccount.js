import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import db from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Loader from '../components/Loader';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const MyAccount = () => {
  const [userDocId, setUserDocId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setUserDocId(docSnap.id);
          const data = docSnap.data();
          setInitialValues({
            name: data.name || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
          });
        } else {
          setStatus({ error: 'User not found.' });
        }
      } catch (err) {
        setStatus({ error: 'Failed to fetch user details.' });
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) fetchUser();
    else {
      setStatus({ error: 'Not logged in.' });
      setLoading(false);
    }
  }, [userEmail]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus(null);
    try {
      if (userDocId) {
        const userRef = doc(db, 'users', userDocId);
        await updateDoc(userRef, values);
        setStatus({ success: 'Profile updated successfully!' });
      }
    } catch (err) {
      setStatus({ error: 'Failed to update profile.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!initialValues) return <div style={{ padding: 32 }}>{status?.error || 'No data.'}</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#f7f7f7', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 32 }}>
      <h2 style={{ marginBottom: 24, textAlign: 'center', fontWeight: 'bold', color: '#111' }}>My Account</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <Field name="name" placeholder="Name" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
              <ErrorMessage name="name" component="div" style={{ color: 'red', fontSize: 13 }} />
            </div>
            {/* Address */}
            <div style={{ marginBottom: 18 }}>
              <Field name="address" placeholder="Address" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
              <ErrorMessage name="address" component="div" style={{ color: 'red', fontSize: 13 }} />
            </div>
            {/* Phone number */}
            <div style={{ marginBottom: 18 }}>
              <Field name="phone" placeholder="Phone number" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
              <ErrorMessage name="phone" component="div" style={{ color: 'red', fontSize: 13 }} />
            </div>
            {/* Email (read-only) */}
            <div style={{ marginBottom: 18 }}>
              <Field name="email" placeholder="Email" className="form-input" readOnly style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, background: '#eee' }} />
              <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: 13 }} />
            </div>
            <button type="submit" className="login-btn-main" disabled={isSubmitting || !dirty} style={{ width: '160px', margin: '18px auto 0 auto', display: 'block', padding: '10px 0', fontSize: '1rem' }}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            {status && status.success && <div style={{ color: '#111', fontSize: 15, marginTop: 12, textAlign: 'center', fontWeight: 500 }}>{status.success}</div>}
            {status && status.error && <div style={{ color: 'red', fontSize: 15, marginTop: 12 }}>{status.error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyAccount; 