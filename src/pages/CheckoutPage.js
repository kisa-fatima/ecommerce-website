import React, { useEffect, useState } from 'react';
import '../styles/CheckoutPage.css';
import OrderSum from '../components/OrderSum';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notSignedIn, setNotSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setNotSignedIn(true);
      setIsAdmin(false);
      return;
    }
    setNotSignedIn(false);
    setLoading(true);
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setIsAdmin(!!data.isAdmin);
          form.setFieldsValue({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        } else {
          setIsAdmin(false);
          form.setFieldsValue({
            name: user.displayName || '',
            email: user.email || '',
            phone: '',
            address: '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [form]);

  const handleFinish = (values) => {
    message.success('Order placed! (Demo)');
  };

  const showSignInPrompt = notSignedIn || isAdmin;

  return (
    <div className="checkout-page-container">
      <div className="checkout-page-inner">
        <h1 className="checkout-title">Checkout</h1>
        <Row gutter={32} justify="center" align="top" style={{width: '100%'}}>
          <Col xs={24} md={15} lg={15} xl={15} className="checkout-page-left">
            {showSignInPrompt ? (
              <div className="checkout-signin-msg">
                <p>You must be signed in as a user to checkout.</p>
                <Button type="primary" onClick={() => navigate('/login')}>Sign Up / Login</Button>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="checkout-form"
                initialValues={{ name: '', email: '', phone: '', address: '' }}
              >
                <Form.Item label="Name" name="name">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your address' }]}>
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block>Place Order</Button>
                </Form.Item>
              </Form>
            )}
          </Col>
          <Col xs={24} md={9} lg={7} xl={6} className="checkout-page-right">
            <OrderSum />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage; 