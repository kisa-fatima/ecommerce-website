import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import db from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Loader from '../components/Loader';
import AccountForm from '../components/AccountForm';
import { fetchUserByEmail } from '../services/databaseFunctions';

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
    const getUser = async () => {
      setLoading(true);
      try {
        const result = await fetchUserByEmail(userEmail);
        if (result) {
          setUserDocId(result.id);
          const data = result.data;
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
    if (userEmail) getUser();
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
        <AccountForm status={status} showSubmit={true} />
      </Formik>
    </div>
  );
};

export default MyAccount; 