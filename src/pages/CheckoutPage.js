import React from 'react';
import '../styles/CheckoutPage.css';
import OrderSum from '../components/OrderSum';
import { Row, Col } from 'antd';
import AccountForm from '../components/AccountForm';

const CheckoutPage = () => {
  // Placeholder props for AccountForm
  const initialValues = { name: '', address: '', phone: '', email: '' };
  const validationSchema = undefined; // Replace with real schema if needed
  const onSubmit = () => {};
  const status = null;

  return (
    <div className="checkout-page-container">
      <div className="checkout-page-inner">
        <h1 className="checkout-title">Checkout</h1>
        <Row gutter={32} justify="center" align="top" style={{width: '100%'}}>
          <Col xs={24} md={15} lg={15} xl={15} className="checkout-page-left">
            <AccountForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              status={status}
            />
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