import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const AccountForm = ({ initialValues, validationSchema, onSubmit, status }) => (
  <Formik
    initialValues={initialValues}
    enableReinitialize
    validationSchema={validationSchema}
    onSubmit={onSubmit}
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
);

export default AccountForm; 